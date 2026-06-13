import axios from "axios";
import { Readable } from "stream";
import csvParser from "csv-parser";
import Blog from "../models/Blog.js";
import TestBlog from "../models/TestBlog.js";

const RSS2JSON_BASE = "https://api.rss2json.com/v1/api.json";

// RSS feeds for different locations (can expand later)
// const RSS_FEEDS = {
//   Goa: "https://www.nomadicmatt.com/feed/",
//   Bali: "https://www.thebrokebackpacker.com/feed/",
//   Bangkok: "https://www.goatsontheroad.com/feed/",
//   default: "https://www.nomadicmatt.com/feed/",
// };

const RSS_FEEDS = {
    Goa: "https://www.nomadicmatt.com/feed/", // works ✅
    // Goa: "https://www.holidify.com/blog/feed/", // Goa travel articles from Holidify
    Bali: "https://thehoneycombers.com/bali/feed/",

    Bangkok: "https://www.traveldudes.com/feed/", // works ✅
    default: "https://www.nomadicmatt.com/feed/",
};

// export const getBlogs = async (req, res, next) => {
//   try {
//     const { keyword = "default" } = req.query;

//     const feedURL = RSS_FEEDS[keyword] || RSS_FEEDS["default"];

//     const { data } = await axios.get(RSS2JSON_BASE, {
//       params: {
//         rss_url: feedURL,
//       },
//       timeout: 10000,
//     });

//     if (!data?.items?.length) {
//       return res.status(404).json({ message: "No blog posts found." });
//     }

//     return res.json({
//       scope: keyword,
//       total: data.items.length,
//       articles: data.items,
//     });
//   } catch (err) {
//     console.error("RSS fetch error:", {
//       message: err.message,
//       status: err.response?.status,
//       response: err.response?.data,
//     });

//     return res.status(500).json({ message: "Failed to fetch blog content." });
//   }
// };

export const getBlogs = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        let query = {};

        if (keyword) {
            query.destination = { $regex: keyword, $options: "i" };
        }

        const blogs = await Blog.find(query).sort({ date: -1 });
        return res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
};
// export const bulkInsertBlogs = async (req, res, next) => {
//   try {
//     const results = [];

//     if (!req.file) {
//       return res.status(400).json({ message: "Please upload a CSV file." });
//     }
//     const stream = Readable.from(req.file.buffer.toString("utf-8"));
//     stream
//       .pipe(csvParser())
//       .on("data", (row) => {
//         try {
//           // Build sections array
//           const sections = [];
//           for (let i = 1; i <= 20; i++) {
//             const image = row[`Section ${i} Image`];
//             const title = row[`Section ${i} Title`];
//             const content = row[`Section ${i} Content`];

//             if (image || title || content) {
//               sections.push({
//                 image: image || "",
//                 title: title || "",
//                 content: content || "",
//               });
//             }
//           }

//           results.push({
//             mainTitle: row["Main Title"],
//             mainImage: row["Main Image URL"],
//             mainContent: row["Main Content"],
//             author: row["Author"] || "",
//             date: row["Date"] ? new Date(row["Date"]) : null,
//             destination: row["Destination"] || "",
//             source: row["Source"] || "",
//             blogType: row["Type"] || "",
//             sections,
//           });
//         } catch (err) {
//           console.error("Error processing row:", err);
//         }
//       })
//       .on("end", async () => {
//         try {
//           await Blog.insertMany(results);
//           res.status(201).json({
//             message: "Blogs uploaded successfully",
//             count: results.length,
//           });
//         } catch (err) {
//           console.error("DB insert error:", err);
//           res.status(500).json({ error: "Error saving blogs to DB" });
//         }
//       });
//   } catch (error) {
//     next(error);
//   }
// };

export const bulkInsertBlogs = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a CSV file." });
        }

        const rows = [];
        const errors = [];

        // Normalize headers + values
        const normalize = (obj) =>
            Object.fromEntries(
                Object.entries(obj).map(([k, v]) => [
                    k.replace(/\uFEFF/g, "").trim(),
                    typeof v === "string" ? v.trim() : v,
                ]),
            );

        let rowNumber = 1; // header row

        Readable.from(req.file.buffer.toString("utf-8"))
            .pipe(csvParser())
            .on("data", (rawRow) => {
                rowNumber++;
                const row = normalize(rawRow);

                // ✅ skip completely empty rows
                const hasAnyValue = Object.values(row).some(
                    (v) => v !== undefined && v !== null && v !== "",
                );
                if (!hasAnyValue) return;

                // 🚨 strict validation BEFORE DB
                if (!row["Main Title"]) {
                    errors.push({
                        row: rowNumber,
                        field: "Main Title",
                        reason: "Required field missing",
                    });
                    return;
                }

                if (!row["Main Content"]) {
                    errors.push({
                        row: rowNumber,
                        field: "Main Content",
                        reason: "Required field missing",
                    });
                    return;
                }

                // Build sections
                const sections = [];
                for (let i = 1; i <= 20; i++) {
                    const image = row[`Section ${i} Image`];
                    const title = row[`Section ${i} Title`];
                    const content = row[`Section ${i} Content`];

                    if (image || title || content) {
                        sections.push({
                            image: image || "",
                            title: title || "",
                            content: content || "",
                        });
                    }
                }

                rows.push({
                    mainTitle: row["Main Title"],
                    mainImage: row["Main Image URL"] || "",
                    mainContent: row["Main Content"],
                    author: row["Author"] || "",
                    date: row["Date"] ? new Date(row["Date"]) : null,
                    destination: row["Destination"] || "",
                    source: row["Source"] || "",
                    blogType: row["Type"] || "",
                    sections,
                });
            })
            .on("end", async () => {
                // 🚫 fail entire import if ANY error exists
                if (errors.length > 0) {
                    return res.status(400).json({
                        message: "CSV validation failed. No data was inserted.",
                        errorCount: errors.length,
                        errors,
                    });
                }

                try {
                    await Blog.insertMany(rows, { ordered: true });
                    res.status(201).json({
                        message: "Blogs uploaded successfully",
                        count: rows.length,
                    });
                } catch (err) {
                    console.error("DB insert error:", err);
                    res.status(500).json({
                        message: "Error saving blogs to DB",
                        error: err.message,
                    });
                }
            });
    } catch (error) {
        next(error);
    }
};

// POST: Create a single blog item
export const createBlog = async (req, res, next) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json({ message: "Blog created", blog });
    } catch (error) {
        next(error);
    }
};

// PUT: Update a single blog item
export const updateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json({ message: "Blog updated", blog });
    } catch (error) {
        next(error);
    }
};

// DELETE: Remove a single blog item
export const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json({ message: "Blog deleted" });
    } catch (error) {
        next(error);
    }
};
