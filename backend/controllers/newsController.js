// // controllers/newsController.js
// import axios from "axios";
// import NewsCache from "../models/NewsCache.js";
import News from "../models/News.js";
import { Readable } from "stream";
import csvParser from "csv-parser";
import TestNews from "../models/TestNews.js";

// const BASE = "https://gnews.io/api/v4";
// const APIKEY = process.env.GNEWS_API_KEY;

// const TRAVEL_TERMS = [
//   `"digital nomad"`,
//   "nomads",
//   `"remote work"`,
//   `"private stay"`,
//   `"meeting room"`,
//   "coworking",
//   "workation",
//   "travel",
//   "tourism",
//   "visa",
//   "cafe",
//   "backpacking",
//   "hostel",
//   "coliving",
// ].join(" OR ");

// async function callGNews(path, params) {
//   const { data } = await axios.get(`${BASE}/${path}`, {
//     params: { apikey: APIKEY, ...params },
//     timeout: 10_000,
//   });
//   return data;
// }

// export const getNews = async (req, res, next) => {
//   try {
//     const {
//       country = "",
//       keyword = "",
//       lang = "en",
//       max = 10,
//       page = 1,
//     } = req.query;
//     const nMax = Math.min(Math.max(Number(max) || 10, 1), 10);

//     // use keyword if present, otherwise country as cache key
//     const locationKey = keyword || country || "global";

//     // 1. check DB cache
//     const cached = await NewsCache.findOne({ location: locationKey });
//     if (cached) {
//       return res.json({
//         fromCache: true,
//         scope: cached.scope,
//         articles: cached.articles,
//       });
//     }

//     // 2. build query for GNews
//     const query = keyword
//       ? `(${TRAVEL_TERMS}) AND (${keyword})`
//       : `(${TRAVEL_TERMS})`;

//     let data = await callGNews("search", {
//       q: query,
//       country: country || undefined,
//       lang,
//       max: nMax,
//       page,
//       sortby: "publishedAt",
//       in: "title,description",
//     });

//     let scope = keyword ? "travel+keyword" : "travel";

//     // fallback to global travel if empty
//     if (!data?.articles?.length) {
//       data = await callGNews("search", {
//         q: TRAVEL_TERMS,
//         lang,
//         max: nMax,
//         page,
//         sortby: "publishedAt",
//         in: "title,description",
//       });
//       scope = "global travel";
//     }

//     // 3. save to DB
//     await NewsCache.create({
//       location: locationKey,
//       scope,
//       articles: data.articles || [],
//     });

//     return res.json({ fromCache: false, scope, articles: data.articles || [] });
//   } catch (err) {
//     console.error("News error", err.response?.data || err.message);
//     next(err);
//   }
// };

export const getNews = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    let query = {};
    if (keyword) {
      query.destination = { $regex: keyword, $options: "i" };
    }

    const blogs = await News.find(query).sort({ date: -1 });

    return res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

// export const bulkInsertnews = async (req, res, next) => {
//   try {
//     const results = [];

//     if (!req.file) {
//       return res.status(400).json({ message: "Please upload a CSV file." });
//     }

//     const normalize = (obj) =>
//       Object.fromEntries(
//         Object.entries(obj).map(([k, v]) => [
//           k.replace(/\uFEFF/g, "").trim(),
//           typeof v === "string" ? v.trim() : v,
//         ])
//       );
//     let rowNumber = 1;

//     const stream = Readable.from(req.file.buffer.toString("utf-8"));
//     stream
//       .pipe(csvParser())
//       .on("data", (rawRow) => {
//         try {
//           const row = normalize(rawRow);
//           rowNumber++;

//           const rejected = [];

//           if (!row["Main Title"]) {
//             rejected.push({ reason: `Row ${rowNumber} missing Main Title` });
//             return;
//           }

//           if (rejected.length > 0) {
//             return res.status(400).json(rejected);
//           }
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
//           await News.insertMany(results);
//           res.status(201).json({
//             message: "News uploaded successfully",
//             count: results.length,
//           });
//         } catch (err) {
//           console.error("DB insert error:", err);
//           res.status(500).json({ error: "Error saving blogs to DB" });
//         }
//       });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

// POST: Create a single news item
export const createNews = async (req, res, next) => {
  try {
    const news = await News.create(req.body);
    res.status(201).json({ message: "News created", news });
  } catch (error) {
    next(error);
  }
};

// PUT: Update a single news item
export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndUpdate(id, req.body, { new: true });
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json({ message: "News updated", news });
  } catch (error) {
    next(error);
  }
};

// DELETE: Remove a single news item
export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndDelete(id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.status(200).json({ message: "News deleted" });
  } catch (error) {
    next(error);
  }
};

export const bulkInsertnews = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV file." });
    }

    const rows = [];
    const errors = [];

    const normalize = (obj) =>
      Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k.replace(/\uFEFF/g, "").trim(),
          typeof v === "string" ? v.trim() : v,
        ]),
      );

    let rowNumber = 1;

    Readable.from(req.file.buffer.toString("utf-8"))
      .pipe(csvParser())
      // .on("data", (rawRow) => {
      //   rowNumber++;
      //   const row = normalize(rawRow);

      //   // STRICT validation
      //   if (!row["Main Title"]) {
      //     errors.push({
      //       row: rowNumber,
      //       field: "Main Title",
      //       reason: "Required field missing",
      //     });
      //   }

      //   // Add more required checks here if needed
      //   // if (!row["Main Content"]) { ... }

      //   rows.push(row);
      // })
      .on("data", (rawRow) => {
        const row = normalize(rawRow);

        // ✅ skip completely empty rows
        const hasAnyValue = Object.values(row).some(
          (v) => v !== undefined && v !== null && v !== "",
        );
        if (!hasAnyValue) return;

        rowNumber++;

        if (!row["Main Title"]) {
          errors.push({
            row: rowNumber,
            field: "Main Title",
            reason: "Required field missing",
          });
        }

        rows.push(row);
      })
      .on("end", async () => {
        // 🚫 If ANY error exists → fail entire import
        if (errors.length > 0) {
          return res.status(400).json({
            message: "CSV validation failed. No data was inserted.",
            errorCount: errors.length,
            errors,
          });
        }

        // Build final docs ONLY after validation passed
        const results = rows.map((row) => {
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

          return {
            mainTitle: row["Main Title"],
            mainImage: row["Main Image URL"],
            mainContent: row["Main Content"],
            author: row["Author"] || "",
            date: row["Date"] ? new Date(row["Date"]) : null,
            destination: row["Destination"] || "",
            source: row["Source"] || "",
            blogType: row["Type"] || "",
            sections,
          };
        });

        try {
          await News.insertMany(results); // atomic
          res.status(201).json({
            message: "All news inserted successfully",
            count: results.length,
          });
        } catch (err) {
          console.error("DB insert error:", err);
          res.status(500).json({ error: "Error saving news to DB" });
        }
      });
  } catch (error) {
    next(error);
  }
};
