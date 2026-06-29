import Company from "../models/Company.js";
import Review from "../models/Reviews.js";
import PointOfContact from "../models/PointOfContact.js";
import { Readable } from "stream";
import csvParser from "csv-parser";
import { deleteFileFromS3ByUrl, uploadFileToS3 } from "../config/s3Config.js";
import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import axios from "axios";
import TestListing from "../models/TestCompany.js";
import NomadUser from "../models/NomadUser.js";

// Utility to calculate distance between two lat/lng points in meters
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in meters
}

export const bulkInsertCompanies = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ message: "Please provide a valid CSV file" });
    }

    const companies = [];

    //fetch companies from master panel
    const hostCompanies = await axios.get(
      `${process.env.MASTER_PANEL_URL || "http://localhost:5000"}/api/hosts/companies`,
    );

    const companyMap = new Map();
    hostCompanies.data.forEach((company) => {
      const key = `${company.companyName
        ?.trim()
        .toLowerCase()}|${company.companyCity
          ?.trim()
          .toLowerCase()}|${company.companyState
            ?.trim()
            .toLowerCase()}|${company.companyCountry?.trim().toLowerCase()}`;
      companyMap.set(key, company.companyId);
    });

    // Fetch existing business IDs from the database
    const existingCompanies = await Company.find().select("businessId");
    const existingBusinessIds = new Set(
      existingCompanies.map((c) => c.businessId?.trim()).filter(Boolean),
    );

    const stream = Readable.from(file.buffer.toString("utf-8").trim());
    stream
      .pipe(csvParser())
      .on("data", (row) => {
        const rowKey = `${row["Business Name"]?.trim()?.toLowerCase()}|${row[
          "City"
        ]
          ?.trim()
          ?.toLowerCase()}|${row["State"]?.trim()?.toLowerCase()}|${row[
            "Country"
          ]
            ?.trim()
            ?.toLowerCase()}`;

        const company = {
          businessId: row["Business ID"]?.trim(),
          companyId: companyMap.get(rowKey) || "",
          companyName: row["Business Name"]?.trim(),
          companyTitle: row["Business Name"]?.trim(),
          registeredEntityName: row["Registered Entity name"]?.trim(),
          website: row["Website"]?.trim() || null,
          address: row["Address"]?.trim(),
          city: row["City"]?.trim(),
          state: row["State"]?.trim(),
          country: row["Country"]?.trim(),
          continent: row["Continent"]?.trim(),
          about: row["About"]?.trim(),
          totalSeats: parseInt(row["Total Seats"]?.trim()) || null,
          latitude: parseFloat(row["latitude"]?.trim()),
          longitude: parseFloat(row["longitude"]?.trim()),
          googleMap: row["Google map"]?.trim() || null,
          ratings: parseFloat(row["Ratings"]) || 0,
          totalReviews: parseInt(row["Total Reviews"]?.trim()) || 0,
          inclusions: row["Inclusions"]?.trim(),
          services: row["Services"]?.trim(),
          units: row["Units"]?.trim(),
          companyType: row["Type"]?.trim()?.split(" ").length
            ? row["Type"]?.trim()?.split(" ").join("").toLowerCase()
            : row["Type"]?.trim()?.toLowerCase(),
        };

        companies.push(company);
      })
      // .on("end", async () => {
      //   try {
      //     const seenInCSV = new Set();
      //     const uniqueCompanies = [];
      //     let skippedExisting = 0;
      //     let skippedDuplicateInCSV = 0;

      //     for (const company of companies) {
      //       if (!company.businessId) continue;

      //       const businessId = company.businessId.trim();

      //       // Check if this business ID already exists in DB
      //       if (existingBusinessIds.has(businessId)) {
      //         skippedExisting++;
      //         continue;
      //       }

      //       // Check for duplicates within the CSV
      //       if (!seenInCSV.has(businessId)) {
      //         seenInCSV.add(businessId);
      //         uniqueCompanies.push(company);
      //       } else {
      //         // Duplicate business ID in CSV → skip
      //         skippedDuplicateInCSV++;
      //         continue;
      //       }
      //     }

      //     const result = await Company.insertMany(uniqueCompanies);

      //     const insertedCount = result.length;

      //     res.status(200).json({
      //       message: "Bulk insert completed",
      //       total: companies.length,
      //       inserted: insertedCount,
      //       skippedExisting,
      //       skippedDuplicateInCSV,
      //     });
      //   } catch (insertError) {
      //     if (insertError.name === "BulkWriteError") {
      //       const insertedCount = insertError.result?.nInserted || 0;

      //       res.status(200).json({
      //         message: "Bulk insert completed with partial failure",
      //         total: companies.length,
      //         inserted: insertedCount,
      //         writeErrors: insertError.writeErrors?.map((e) => ({
      //           index: e.index,
      //           errmsg: e.errmsg,
      //           code: e.code,
      //         })),
      //       });
      //     } else {
      //       res.status(500).json({
      //         message: "Unexpected error during bulk insert",
      //         error: insertError.message,
      //       });
      //     }
      //   }
      // });

      .on("end", async () => {
        try {
          const seenInCSV = new Set();
          const uniqueCompanies = [];
          const skippedMissingCompanyId = [];
          let skippedExisting = 0;
          let skippedDuplicateInCSV = 0;

          for (const company of companies) {
            if (!company.businessId) continue;

            const businessId = company.businessId.trim();

            // Missing companyId check
            if (!company.companyId) {
              skippedMissingCompanyId.push({
                businessId,
                companyName: company.companyName,
                city: company.city,
                state: company.state,
                country: company.country,
                reason: "Missing companyId mapping from master panel",
              });
              continue;
            }

            // Check if already exists in DB
            if (existingBusinessIds.has(businessId)) {
              skippedExisting++;
              continue;
            }

            // Duplicates within CSV
            if (seenInCSV.has(businessId)) {
              skippedDuplicateInCSV++;
              continue;
            }

            seenInCSV.add(businessId);
            uniqueCompanies.push(company);
          }

          // Log bad data
          if (skippedMissingCompanyId.length) {
            console.log(
              "\n=== COMPANIES MISSING COMPANY ID (from master panel) ===",
            );
            console.table(
              skippedMissingCompanyId.map((c) => ({
                businessId: c.businessId,
                companyName: c.companyName,
                city: c.city,
                state: c.state,
                country: c.country,
              })),
            );
          }

          // Proceed with insert
          const result = await Company.insertMany(uniqueCompanies);
          const insertedCount = result.length;

          res.status(200).json({
            message: "Bulk insert completed",
            total: companies.length,
            inserted: insertedCount,
            skippedExisting,
            skippedDuplicateInCSV,
            skippedMissingCompanyId: skippedMissingCompanyId.length,
            missingCompanyIds: skippedMissingCompanyId,
          });
        } catch (insertError) {
          if (insertError.name === "BulkWriteError") {
            const insertedCount = insertError.result?.nInserted || 0;

            res.status(200).json({
              message: "Bulk insert completed with partial failure",
              total: companies.length,
              inserted: insertedCount,
              writeErrors: insertError.writeErrors?.map((e) => ({
                index: e.index,
                errmsg: e.errmsg,
                code: e.code,
              })),
            });
          } else {
            // Log the companies that likely caused validation failure
            console.log("\n=== VALIDATION FAILED COMPANIES ===");
            console.table(
              companies
                .filter((c) => !c.companyId)
                .map((c) => ({
                  businessId: c.businessId,
                  companyName: c.companyName,
                  city: c.city,
                  state: c.state,
                  country: c.country,
                })),
            );

            res.status(500).json({
              message: "Unexpected error during bulk insert",
              error: insertError.message,
            });
          }
        }
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const bulkUpdateCompanyInclusions = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ message: "Please provide a valid CSV file" });
    }

    const updates = [];

    const stream = Readable.from(file.buffer.toString("utf-8").trim());
    stream
      .pipe(csvParser())
      .on("data", (row) => {
        const state = row["State"]?.trim();
        const businessId = row["Business ID"]?.trim();
        const inclusions = row["Inclusions"]?.trim();

        // Only collect Chiang Mai rows with valid Business ID and inclusions
        if (state === "Chiang Mai" && businessId && inclusions) {
          updates.push({
            updateOne: {
              filter: { businessId },
              update: { $set: { inclusions } },
            },
          });
        }
      })
      .on("end", async () => {
        try {
          if (updates.length === 0) {
            return res.status(400).json({
              message:
                "No valid Chiang Mai rows with Business ID and Inclusions found in CSV",
            });
          }

          // Perform bulkWrite operation
          const result = await Company.bulkWrite(updates);

          res.status(200).json({
            message: "Bulk inclusions update for Chiang Mai completed",
            totalProcessed: updates.length,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
          });
        } catch (updateError) {
          console.error(updateError);
          res.status(500).json({
            message: "Error during bulk inclusions update",
            error: updateError.message,
          });
        }
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createCompany = async (req, res, next) => {
  try {
    const {
      companyName,
      companyTitle,
      logo,
      companyId,
      registeredEntityName,
      website,
      address,
      city,
      state,
      country,
      continent,
      about,
      totalSeats,
      latitude,
      longitude,
      googleMap,
      ratings,
      totalReviews,
      inclusions,
      services,
      units,
      companyType,
      poc, // single POC object
      reviews, // array of reviews
      images,
      cost,
      description,
    } = req.body;

    const generateBuisnessId = () => {
      const base = "RoamIQ_world";
      const id = `${base} ${companyType} ${city} ${Date.now()}`;
      const finalId = id.replace(/\s+/g, "_");

      return finalId.trim();
    };

    if (!companyName) {
      return res.status(400).json({ message: "Company Name are required" });
    }

    const companyExists = await Company.findOne({ companyId, companyType });

    if (companyExists) {
      console.log("companyType", companyExists);
      return res
        .status(400)
        .json({ message: `${companyType} product already exists` });
    }

    // Create company
    const company = new Company({
      businessId: generateBuisnessId(),
      companyName: companyName.trim(),
      companyTitle: companyTitle.trim(),
      companyId,
      logo,
      registeredEntityName: registeredEntityName?.trim(),
      website: website?.trim() || null,
      address: address?.trim(),
      city: city?.trim(),
      state: state?.trim(),
      country: country?.trim(),
      continent: continent?.trim(),
      about: about?.trim(),
      totalSeats: totalSeats ? parseInt(totalSeats) : null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      googleMap: googleMap?.trim() || null,
      ratings: ratings ? parseFloat(ratings) : 0,
      totalReviews: totalReviews ? parseInt(totalReviews) : 0,
      inclusions: inclusions?.trim(),
      services: services?.trim(),
      units: units?.trim(),
      cost: cost?.trim(),
      description: description?.trim(),
      companyType: companyType?.trim()?.split(" ").join("").toLowerCase(),
      images,
    });

    // Save company first (needed for _id reference in POC/Reviews)
    const savedCompany = await company.save();

    /** ---------------- IMAGE UPLOAD LOGIC ---------------- **/

    const formatCompanyType = (type) => {
      const map = {
        hostel: "hostels",
        privatestay: "private-stay",
        meetingroom: "meetingroom",
        coworking: "coworking",
        cafe: "cafe",
        coliving: "coliving",
        workation: "workation",
      };
      const key = String(type || "").toLowerCase();
      return map[key] || "unknown";
    };

    const pathCompanyType = formatCompanyType(
      companyType || savedCompany.companyType,
    );

    const safeCompanyName =
      (companyName || "unnamed").replace(/[^\w\- ]+/g, "").trim() || "unnamed";

    const folderPath = `nomads/${pathCompanyType}/${country}/${safeCompanyName}`;

    // 1️⃣ Upload Logo if provided (req.files.logo)
    if (req.files?.logo?.[0]) {
      const logoFile = req.files.logo[0];
      const logoKey = `${folderPath}/logo/${logoFile.originalname}`;
      const data = await uploadFileToS3(logoKey, logoFile);
      savedCompany.logo = {
        url: data.url,
        id: data.id,
      };
    }

    // 2️⃣ Upload Images if provided (req.files.images[])
    if (req.files?.images && req.files.images.length > 0) {
      if (req.files?.images && req.files.images.length > 10) {
        return res.status(400).json({
          message: "You can upload a maximum of 10 images for this company.",
        });
      }

      if (!Array.isArray(savedCompany.images)) savedCompany.images = [];
      const startIndex = savedCompany.images.length;

      const sanitizeFileName = (name) =>
        String(name || "file")
          .replace(/[/\\?%*:|"<>]/g, "_")
          .replace(/\s+/g, "_");

      const results = await Promise.allSettled(
        req.files.images.map(async (file, i) => {
          const uniqueKey = `${folderPath}/images/${sanitizeFileName(
            file.originalname,
          )}`;
          const data = await uploadFileToS3(uniqueKey, file);
          return {
            url: data.url,
            id: data.id,
            index: startIndex + i + 1,
          };
        }),
      );

      const successes = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

      if (successes.length) {
        savedCompany.images.push(...successes);
      }
    }

    // Save company again with logo/images
    await savedCompany.save({ validateBeforeSave: false });

    /** ---------------- POC LOGIC ---------------- **/
    if (poc && Object.keys(poc).length > 0) {
      const pocDoc = new PointOfContact({
        company: savedCompany._id,
        name: poc.name?.trim(),
        image: poc.image?.trim(),
        designation: poc.designation?.trim(),
        email: poc.email?.trim()?.toLowerCase(),
        phoneNumber: poc.phoneNumber?.trim(),
        linkedInProfile: poc.linkedInProfile?.trim(),
        languages: Array.isArray(poc.languages)
          ? poc.languages.map((lang) => lang.trim())
          : poc.languages?.split(",").map((lang) => lang.trim()),
        address: poc.address?.trim(),
        availabilityTime: poc.availabilityTime?.trim(),
      });
      await pocDoc.save();
    }

    /** ---------------- REVIEWS LOGIC ---------------- **/
    let savedReviews;

    if (Array.isArray(reviews) && reviews.length > 0) {
      const reviewDocs = reviews.map((review) => ({
        company: savedCompany._id,
        companyId,
        name: review.name?.trim(),
        starCount: parseInt(review.starCount || 1),
        description: review.review?.trim(),
        reviewSource: review.reviewSource?.trim(),
        reviewLink: review.reviewLink?.trim(),
      }));
      savedReviews = await Review.insertMany(reviewDocs);

      if (!savedReviews) {
        return res.status(400).json({
          message: "Failed to add reviews",
        });
      }
    }

    res.status(201).json({
      message: "Company created successfully with images",
      company: savedCompany,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// export const getCompaniesData = async (req, res, next) => {
//   // console.log("🔥 getCompaniesData HIT");
//   try {
//     const companies = await Company.find({ isActive: true }).lean().exec();
//     const reviews = await Review.find().lean().exec();
//     const poc = await PointOfContact.find().lean().exec();

//     const { country, state, type, userId } = req.query;

//     // Base company dataset with reviews and active POC
//     const enrichCompanies = (base) => {
//       return base.map((company) => ({
//         ...company,
//         reviews: reviews.filter(
//           (review) => review.company.toString() === company?._id.toString()
//         ),
//         poc: poc
//           .filter((p) => p.company?._id.toString() === company?._id.toString())
//           .find((p) => p.isActive),
//       }));
//     };

//     let filteredCompanies = [];

//     // 1. Filter by all three: type + country + state
//     if (type && country && state) {
//       filteredCompanies = companies.filter(
//         (company) =>
//           company.companyType === type?.toLowerCase() &&
//           company.country?.toLowerCase() === country.toLowerCase() &&
//           company.state?.toLowerCase() === state.toLowerCase()
//       );
//     }
//     // 2. Filter only by type
//     else if (type) {
//       filteredCompanies = companies.filter(
//         (company) => company.companyType === type
//       );
//     }
//     // 3. Filter only by country and state
//     else if (country && state) {
//       filteredCompanies = companies.filter(
//         (company) =>
//           company.country?.toLowerCase() === country.toLowerCase() &&
//           company.state?.toLowerCase() === state.toLowerCase()
//       );
//     }
//     // 4. No filters → all companies
//     else {
//       filteredCompanies = companies;
//     }

//     // 🟡 Add these temporary debug lines here:
//     // console.log("🔍 Filtering for country:", country, "state:", state);
//     // console.log("✅ Matched companies count:", filteredCompanies.length);
//     // console.log(
//     //   "Example match:",
//     //   filteredCompanies.length > 0 ? filteredCompanies[0].companyName : "None"
//     // );

//     let companyData = enrichCompanies(filteredCompanies);

//     if (userId) {
//       if (!mongoose.Types.ObjectId.isValid(userId)) {
//         return res.status(400).json({ message: "Invalid user id provided" });
//       }

//       const user = await NomadUser.findOne({ _id: userId });

//       companyData = companyData.map((data) => {
//         const isLiked = user.likes.some(
//           (like) => like.toString() === data._id.toString()
//         );

//         return { ...data, isLiked };
//       });
//     }

//     res.status(200).json(companyData);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

export const getCompaniesData = async (req, res, next) => {
  try {
    const { country, state, type, userId } = req.query;

    // -----------------------------
    // 1. Fetch all companies first
    // (same as old behaviour)
    // -----------------------------
    const companies = await Company.find({
      isActive: true,
      companyType: { $ne: "privatestay" },
    })
      .lean()
      .select(
        "_id companyName companyId companyType country state city address about website businessId registeredEntityName images logo rating ratings totalReviews inclusions latitude longitude continent isRegistered isPublic",
      )
      .exec();

    // -----------------------------
    // 2. Apply EXACT same filtering
    // IN MEMORY (original logic)
    // -----------------------------
    let filtered = companies;

    // type + country + state
    if (type && country && state) {
      filtered = companies.filter(
        (c) =>
          c.companyType === type.toLowerCase() &&
          c.country?.toLowerCase() === country.toLowerCase() &&
          c.state?.toLowerCase() === state.toLowerCase(),
      );
    }
    // only type
    else if (type) {
      filtered = companies.filter((c) => c.companyType === type.toLowerCase());
    }
    // only country + state
    else if (country && state) {
      filtered = companies.filter(
        (c) =>
          c.country?.toLowerCase() === country.toLowerCase() &&
          c.state?.toLowerCase() === state.toLowerCase(),
      );
    }
    // nothing → all companies
    else {
      filtered = companies;
    }

    // -----------------------------
    // 3. Prepare IDs for reviews + POC
    // -----------------------------
    const ids = filtered.map((c) => c._id);

    const [reviews, pocs] = await Promise.all([
      Review.find({ company: { $in: ids } }).lean(),
      PointOfContact.find({
        company: { $in: ids },
        isActive: true,
      })
        .lean()
        .select("company name email phone isActive"),
    ]);

    // -----------------------------
    // 4. Map reviews + POCs efficiently
    // -----------------------------
    const reviewMap = new Map();
    reviews.forEach((review) => {
      const key = review.company.toString();
      if (!reviewMap.has(key)) reviewMap.set(key, []);
      reviewMap.get(key).push(review);
    });

    const pocMap = new Map();
    pocs.forEach((p) => {
      pocMap.set(p.company.toString(), p);
    });

    // -----------------------------
    // 5. Merge everything
    // -----------------------------
    let companyData = filtered.map((c) => ({
      ...c,
      reviews: reviewMap.get(c._id.toString()) || [],
      poc: pocMap.get(c._id.toString()) || null,
    }));

    // -----------------------------
    // 6. User likes (unchanged logic)
    // -----------------------------

    if (!companyData) {
      return res.status(404).json({ error: "Company not found" });
    }

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user id provided" });
      }

      const user = await NomadUser.findById(userId).lean().select("likes");

      const likedSet = new Set((user?.likes || []).map((id) => id.toString()));

      companyData = companyData.map((d) => ({
        ...d,
        isLiked: likedSet.has(d._id.toString()),
      }));
    }

    res.status(200).json(companyData);
  } catch (error) {
    console.error("Error in getCompaniesData:", error);
    next(error);
  }
};

export const getCompaniesDataMaster = async (req, res, next) => {
  try {
    const companies = await Company.find(
      { isActive: true, companyType: { $ne: "privatestay" } },
      "_id companyName companyId companyType country state",
    )
      .lean()
      .exec();

    res.status(200).json(companies);
  } catch (err) {
    next(err);
  }
};

export const getCompaniesDataNomads = async (req, res, next) => {
  try {
    const { country, state, type, userId } = req.query;

    const match = {
      isActive: true,
      companyType: { $ne: "privatestay" },
    };

    if (type) match.companyType = type;
    if (country) match.country = country;
    if (state) match.state = state;

    const pipeline = [
      { $match: match },

      {
        $project: {
          companyName: 1,
          companyTitle: 1,
          companyId: 1,
          companyType: 1,
          country: 1,
          state: 1,
          city: 1,
          latitude: 1,
          longitude: 1,

          // your original rating fields
          ratings: 1,
          totalReviews: 1,

          images: { $slice: ["$images", 1] },
        },
      },

      { $limit: 200 },
    ];

    console.log("pipe", pipeline)
    let companyData = await Company.aggregate(pipeline).collation({
      locale: "en",
      strength: 2,
    });

    // Add likes
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const user = await NomadUser.findById(userId).lean().select("likes");

      const likedSet = new Set((user?.likes || []).map((id) => id.toString()));

      companyData = companyData.map((c) => ({
        ...c,
        isLiked: likedSet.has(c._id.toString()),
      }));
    }

    return res.status(200).json(companyData);
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

export const getCompanyData = async (req, res, next) => {
  // Array of llats & long for centres ot cover all regions
  // Add at the top of getCompanyData
  const regionCenters = {
    goa: [
      { lat: 15.4909, lng: 73.8278 }, // Panaji (North-Central)
      { lat: 15.2993, lng: 74.124 }, // Ponda (East-Central)
      { lat: 15.184, lng: 73.969 }, // Margao (South-Central)
      { lat: 15.402, lng: 73.785 }, // Mapusa (Northwest)
      { lat: 15.517, lng: 73.9116 }, // Old Goa
      { lat: 15.272, lng: 73.958 }, // Vasco da Gama (Southwest)
      { lat: 15.01, lng: 74.02 }, // Canacona (South Goa)
      { lat: 15.6, lng: 73.75 }, // Pernem (Far North Goa)
      { lat: 15.35, lng: 73.9 }, // Bambolim
      { lat: 15.45, lng: 74.02 }, // Valpoi (Northeast Goa)
    ],
    bali: [
      { lat: -8.4095, lng: 115.1889 }, // Denpasar (South)
      { lat: -8.3405, lng: 115.092 }, // Ubud (Center)
      { lat: -8.139, lng: 115.089 }, // Amed (East)
      { lat: -8.72, lng: 115.175 }, // Uluwatu (Southwest tip)
      { lat: -8.36, lng: 114.62 }, // Gilimanuk (West end)
      { lat: -8.22, lng: 114.97 }, // Negara (West Bali)
      { lat: -8.54, lng: 115.51 }, // Candidasa (Southeast)
      { lat: -8.67, lng: 115.21 }, // Nusa Dua (Far South)
      { lat: -8.3, lng: 115.6 }, // Tulamben (Northeast coast)
      { lat: -8.45, lng: 115.25 }, // Gianyar (East-Central)
    ],
    bangkok: [
      { lat: 13.7563, lng: 100.5018 }, // Bangkok center
      { lat: 13.69, lng: 100.75 }, // Lat Krabang (East Bangkok)
      { lat: 13.81, lng: 100.55 }, // Chatuchak (North Bangkok)
      { lat: 13.72, lng: 100.53 }, // Silom/Sathorn
      { lat: 13.77, lng: 100.41 }, // Thonburi (West bank)
      { lat: 13.65, lng: 100.5 }, // Bang Na (Southeast)
      { lat: 13.85, lng: 100.6 }, // Don Mueang (North Airport area)
      { lat: 13.73, lng: 100.78 }, // Min Buri (Far East)
      { lat: 13.82, lng: 100.48 }, // Nonthaburi (Northwest metro)
      { lat: 13.55, lng: 100.6 }, // Samut Prakan (Far South)
    ],
    hochiminh: [
      { lat: 10.7769, lng: 106.7009 }, // District 1 (Center)
      { lat: 10.8231, lng: 106.6297 }, // Binh Thanh
      { lat: 10.85, lng: 106.77 }, // Thu Duc (Northeast)
      { lat: 10.8, lng: 106.64 }, // Go Vap (Northwest)
      { lat: 10.75, lng: 106.65 }, // District 5 (Cholon)
      { lat: 10.74, lng: 106.71 }, // District 7 (Phu My Hung, South)
      { lat: 10.72, lng: 106.62 }, // District 8 (Southwest)
      { lat: 10.77, lng: 106.58 }, // District 6 (West)
      { lat: 10.88, lng: 106.6 }, // Cu Chi (Far Northwest)
      { lat: 10.61, lng: 106.74 }, // Nha Be (Far South)
    ],
    cebu: [
      { lat: 10.3157, lng: 123.8854 }, // Cebu City center
      { lat: 10.7, lng: 123.8854 }, // North of Cebu — near Danao area
      { lat: 9.95, lng: 123.8854 }, // South direction — Talisay / Carcar side
      { lat: 10.3157, lng: 124.3 }, // East — over toward Camotes Sea / islands
      { lat: 10.3157, lng: 123.4 }, // West — inland mountains / western Cebu
      { lat: 10.8, lng: 124.3 }, // Northeast corner
      { lat: 10.8, lng: 123.4 }, // Northwest corner
      { lat: 9.95, lng: 124.3 }, // Southeast corner
      { lat: 9.95, lng: 123.4 }, // Southwest corner
      { lat: 10.5, lng: 123.8854 }, // mid-north-central
    ],
  };

  try {
    const { companyId, companyType, userId, companyName } = req.query;

    let companyQuery = {};

    if (companyId) {
      companyQuery.companyId = companyId;
    }
    const normalizedCompanyName =
      typeof companyName === "string" ? companyName.trim() : "";
    if (!companyId && normalizedCompanyName) {
      const escapedCompanyName = normalizedCompanyName.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );
      companyQuery.companyName = {
        $regex: new RegExp(`^${escapedCompanyName}$`, "i"),
      };
    }
    if (companyType) {
      companyQuery.companyType = companyType;
    }

    if (Object.keys(companyQuery).length === 0) {
      return res.status(400).json({ error: "Company identifier is required" });
    }

    // if (mongoose.Types.ObjectId.isValid(companyId)) {
    //   // Search by ObjectId
    //   companyQuery = Company.findById(companyId).lean().exec();
    // } else {
    //   // Search by companyName (case-insensitive regex)
    //   companyQuery = Company.findOne({
    //     companyName: { $regex: new RegExp(`^${companyId}$`, "i") },
    //   })
    //     .lean()
    //     .exec();
    // }

    // const companyData = await companyQuery;

    const company = await Company.findOne(companyQuery).lean().exec();

    let companyData = company;

    if (!companyData) {
      return res.status(404).json({ error: "Company not found" });
    }

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user id provided" });
      }

      const user = await NomadUser.findOne({ _id: userId });

      const isLiked = user.likes.some(
        (like) => like.toString() === companyData._id.toString(),
      );

      companyData = { ...companyData, isLiked };
    }

    // Use the actual ObjectId of the found company
    const companyObjectId = companyData._id;

    // Keywords
    const keywordMap = {
      coworking: "coworking space",
      hostel: "hostel",
      privatestay: "private accommodation",
      meetingroom: "meeting room",
      cafe: "cafe",
      coliving: "coliving space",
      workation: "resort OR workation",
    };

    const keyword =
      keywordMap[companyData.companyType?.toLowerCase()] || "coworking space";

    // ###

    // Decide centers: use multi-centers if region matches, else company coords
    const regionKey =
      companyData.state?.toLowerCase() || companyData.city?.toLowerCase();
    const centers = regionCenters[regionKey] || [
      { lat: companyData.latitude, lng: companyData.longitude },
    ];

    let coworkingSpaces = [];
    for (const center of centers) {
      const res = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${center.lat},${center.lng}`,
            radius: 50000, // ✅ max allowed by Google
            keyword,
            key: process.env.GOOGLE_PLACES_API_KEY,
          },
        },
      );
      coworkingSpaces.push(...(res.data.results || []));
    }

    // ###

    // Step 2: For each space, fetch reviews from Place Details API
    const detailedSpaces = await Promise.all(
      coworkingSpaces.map(async (place) => {
        try {
          const detailsRes = await axios.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            {
              params: {
                place_id: place.place_id,
                key: process.env.GOOGLE_PLACES_API_KEY,
                // ✅ include geometry so details.geometry is available if needed
                fields:
                  "name,rating,user_ratings_total,reviews,formatted_address,geometry",
              },
            },
          );

          const details = detailsRes.data.result || {};

          // Use lat/lng from Nearby first; fall back to Details if missing
          const nearbyLoc = place.geometry?.location;
          const detailsLoc = details.geometry?.location;
          const location = nearbyLoc || detailsLoc || null;

          // Top 5 five-star reviews (from the 0–5 reviews Google returns)
          const reviews = (details.reviews || [])
            .filter((r) => r.rating === 5)
            .slice(0, 5);

          return {
            place_id: place.place_id,
            name: details.name ?? place.name,
            address: details.formatted_address ?? place.vicinity ?? "",
            rating: details.rating ?? place.rating ?? null,
            user_ratings_total:
              details.user_ratings_total ?? place.user_ratings_total ?? 0,
            location, // { lat, lng } or null
            reviews,
          };
        } catch (err) {
          // On details failure, still return basic info + location from Nearby
          return {
            place_id: place.place_id,
            name: place.name,
            address: place.vicinity ?? "",
            rating: place.rating ?? null,
            user_ratings_total: place.user_ratings_total ?? 0,
            location: place.geometry?.location ?? null,
            reviews: [],
          };
        }
      }),
    );

    // Try to match Google place by decreasing decimal precision
    let closestGoogle = null;

    const toTruncate = (num, decimals) => {
      const factor = Math.pow(10, decimals);
      return Math.trunc(num * factor) / factor;
    };

    // First attempt: exact match (no truncation)
    closestGoogle = detailedSpaces.find(
      (place) =>
        place.location &&
        place.location.lat === companyData.latitude &&
        place.location.lng === companyData.longitude,
    );

    if (!closestGoogle) {
      // Try 5 → 4 → 3 decimals
      for (let decimals = 5; decimals >= 3; decimals--) {
        const match = detailedSpaces.find((place) => {
          if (!place.location) return false;

          const googleLat = toTruncate(place.location.lat, decimals);
          const googleLng = toTruncate(place.location.lng, decimals);
          const companyLat = toTruncate(companyData.latitude, decimals);
          const companyLng = toTruncate(companyData.longitude, decimals);

          return googleLat === companyLat && googleLng === companyLng;
        });

        if (match) {
          closestGoogle = match;
          break; // stop once we find a match
        }
      }
    }

    // Fetch DB reviews & POC
    const [reviews, poc] = await Promise.all([
      Review.find({ company: companyObjectId }).lean().exec(),
      PointOfContact.findOne({ company: companyObjectId, isActive: true })
        .lean()
        .exec(),
    ]);

    const updatedCompanyData = {
      ...companyData,
      ratings: closestGoogle?.rating || companyData.ratings,
      totalReviews:
        closestGoogle?.user_ratings_total || companyData.totalReviews,
    };

    return res.status(200).json({
      ...updatedCompanyData,
      reviews: [
        ...reviews,
        ...(closestGoogle?.reviews || []).map((r) => ({
          company: companyObjectId,
          name: r.author_name,
          starCount: r.rating,
          description: r.text,
          reviewLink: r.author_url,
          avatar: r.profile_photo_url,
        })),
      ],
      poc,
    });
  } catch (error) {
    console.error("getCompanyData error:", error);
    next(error);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    const { companyName } = req.params;
    const company = await Company.findOne({ companyName });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json(company);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { companyType } = req.query;
    let query = { companyId: companyId };

    console.log("get listings");
    if (companyType) {
      query = { ...query, companyType };
    }

    const listings = await Company.find(query).lean().exec();
    const reviews = await Review.find({ companyId })
      .populate({ path: "company", select: "companyType" })
      .lean()
      .exec();

    if (!listings || !listings.length) {
      return res.status(404).json({ error: "Company not found" });
    }

    const data = listings.map((list) => {
      const totalReviews =
        reviews.length > 0
          ? companyType
            ? reviews.filter((r) => r?.company?.companyType === companyType)
            : reviews
          : [];

      return { ...list, reviews: totalReviews };
    });

    return res.status(200).json(data);
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

// export const getUniqueDataLocations = async (req, res, next) => {
//   try {
//     const companies = await Company.find()
//       .select("country state continent")
//       .lean()
//       .exec();

//     const countryMap = new Map();

//     for (const company of companies) {
//       const country = company.country?.trim();
//       const state = company.state?.trim();
//       const continent = company.continent?.trim() || "Unknown";

//       if (!country) continue;

//       if (!countryMap.has(country)) {
//         countryMap.set(country, {
//           states: new Set(),
//           continent,
//         });
//       }

//       // if continent differs across records, prefer non-"Unknown"
//       const existing = countryMap.get(country);
//       if (continent !== "Unknown" && existing.continent === "Unknown") {
//         existing.continent = continent;
//       }

//       if (state) {
//         existing.states.add(state);
//       }
//     }

//     const finalizedLocations = Array.from(countryMap.entries()).map(
//       ([country, { states, continent }]) => ({
//         country,
//         states: Array.from(states),
//         continent,
//       })
//     );

//     return res.status(200).json(finalizedLocations);
//   } catch (error) {
//     next(error);
//   }
// };

export const getUniqueDataLocations = async (req, res, next) => {
  try {
    const companies = await Company.find()
      .select("country state continent isPublic")
      .lean()
      .exec();

    const countryMap = new Map();

    for (const company of companies) {
      const country = company.country?.trim();
      const state = company.state?.trim();
      const continent = company.continent?.trim() || "Unknown";
      const isPublic = !!company.isPublic;

      if (!country || !state) continue;

      // initialize country entry if missing
      if (!countryMap.has(country)) {
        countryMap.set(country, {
          states: new Map(),
          continent,
        });
      }

      const existing = countryMap.get(country);

      // prefer non-"Unknown" continent if previously unknown
      if (continent !== "Unknown" && existing.continent === "Unknown") {
        existing.continent = continent;
      }

      // initialize state entry if missing
      if (!existing.states.has(state)) {
        existing.states.set(state, { name: state, isPublic });
      } else {
        // if any company for this state is public, mark it true
        const stateObj = existing.states.get(state);
        if (isPublic) stateObj.isPublic = true;
      }
    }

    // convert map structure into array form
    const finalizedLocations = Array.from(countryMap.entries()).map(
      ([country, { states, continent }]) => ({
        country,
        states: Array.from(states.values()),
        continent,
      }),
    );

    return res.status(200).json(finalizedLocations);
  } catch (error) {
    next(error);
  }
};

export const addCompanyImage = async (req, res, next) => {
  try {
    const file = req.file;
    const { type = "", companyId, businessId, companyType = "" } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const normalizedType = String(type).toLowerCase();
    if (!["logo", "image", "images"].includes(normalizedType)) {
      return res
        .status(400)
        .json({ message: "Invalid type. Use 'logo' or 'image'." });
    }

    // 1️⃣ Find company
    let company;
    if (companyId) {
      company = await Company.findById(companyId).exec();
    } else if (businessId) {
      company = await Company.findOne({ businessId }).exec();
    } else {
      return res
        .status(400)
        .json({ message: "Provide companyId or businessId" });
    }

    if (!company) {
      return res.status(404).json({ message: "No such company found" });
    }

    if (
      companyType &&
      company.companyType?.toLowerCase() !== companyType.toLowerCase()
    ) {
      return res
        .status(400)
        .json({ message: "companyType does not match the stored company" });
    }

    // 2️⃣ Format folder paths
    const formatCompanyType = (type) => {
      const map = {
        hostel: "hostels",
        privatestay: "private-stay",
        meetingroom: "meetingroom",
        coworking: "coworking",
        cafe: "cafe",
        coliving: "coliving",
        workation: "workation",
      };
      const key = String(type || "").toLowerCase();
      return map[key] || "unknown";
    };

    const folderType = normalizedType === "logo" ? "logo" : "images";
    const pathCompanyType = formatCompanyType(
      companyType || company.companyType,
    );

    const safeCompanyName =
      (company.companyName || "unnamed").replace(/[^\w\- ]+/g, "").trim() ||
      "unnamed";

    const folderPath = `nomads/${pathCompanyType}/${company.country}/${safeCompanyName}`;
    const s3Key = `${folderPath}/${folderType}/${file.originalname}`;

    // 3️⃣ Upload to S3
    let data;
    try {
      data = await uploadFileToS3(s3Key, file);
    } catch (err) {
      console.error("❌ S3 upload failed:", err.message);
      return res.status(500).json({ message: "Failed to upload image to S3" });
    }

    // 4️⃣ Update Nomads DB
    if (folderType === "logo") {
      company.logo = {
        url: data.url,
        id: data.id,
      };
    } else {
      if (!Array.isArray(company.images)) company.images = [];
      company.images.push({
        url: data.url,
        id: data.id,
        index: company.images.length + 1,
      });
    }

    await company.save({ validateBeforeSave: false });

    // 5️⃣ If logo, sync to Master Panel
    if (folderType === "logo") {
      try {
        const payload = {
          companyId: company.companyId,
          logo: {
            url: data.url,
            id: data.id,
          },
        };

        console.log("📤 Syncing logo to Master Panel:", payload);

        const response = await axios.patch(
          `${process.env.MASTER_PANEL_URL || "http://localhost:5000"}/api/hosts/upload-logo`,
          payload,
          { headers: { "Content-Type": "application/json" } },
        );

        console.log(
          "✅ Master Panel sync success:",
          response.status,
          response.data.message,
        );
      } catch (masterErr) {
        console.error(
          "❌ Master Panel sync failed:",
          masterErr.response?.data || masterErr.message,
        );

        // Rollback: delete file from S3 and remove logo from DB
        try {
          await deleteFileFromS3ByUrl(data.url);
          company.logo = "";
          await company.save({ validateBeforeSave: false });
        } catch (rollbackErr) {
          console.error("⚠️ Rollback failed:", rollbackErr.message);
        }

        return res.status(500).json({
          message:
            "Failed to sync logo with Master Panel. Changes reverted in Nomads.",
          error: masterErr.message,
        });
      }
    }

    // ✅ Success Response
    return res.status(200).json({
      message: `Successfully uploaded ${pathCompanyType} company ${folderType}`,
      data: {
        companyId: company._id,
        businessId: company.businessId,
        type: folderType,
        url: data.url,
        id: data.id,
      },
    });
  } catch (error) {
    console.error("❌ addCompanyImage error:", error);
    next(error);
  }
};

export const addCompanyImagesBulk = async (req, res, next) => {
  try {
    const files = req.files;
    const { companyId, businessId, companyType = "" } = req.body;

    console.log("BULK UPLOAD IMAGES HIT");

    if (!files || !files.length) {
      return res.status(400).json({ message: "No files provided" });
    }

    let company;
    if (companyId) {
      company = await Company.findById(companyId).exec();
    } else if (businessId) {
      company = await Company.findOne({ businessId }).exec();
    } else {
      return res
        .status(400)
        .json({ message: "Provide companyId or businessId" });
    }

    if (!company) {
      return res.status(404).json({ message: "No such company found" });
    }

    if (
      companyType &&
      company.companyType?.toLowerCase() !== String(companyType).toLowerCase()
    ) {
      return res
        .status(400)
        .json({ message: "companyType does not match the stored company" });
    }

    if (company.images.length) {
      return res.status(404).json({
        message:
          "Images already exist.Please update them via the reupload tab.",
      });
    }

    const formatCompanyType = (type) => {
      const map = {
        hostel: "hostels",
        privatestay: "private-stay",
        meetingroom: "meetingroom",
        coworking: "coworking",
        cafe: "cafe",
        coliving: "coliving",
        workation: "workation",
      };
      const key = String(type || "").toLowerCase();
      return map[key] || "unknown";
    };

    const pathCompanyType = formatCompanyType(
      companyType || company.companyType,
    );

    const safeCompanyName =
      (company.companyName || "unnamed").replace(/[^\w\- ]+/g, "").trim() ||
      "unnamed";

    const folderPath = `nomads/${pathCompanyType}/${company.country}/${safeCompanyName}`;
    const folderType = "images";

    if (!Array.isArray(company.images)) company.images = [];
    const startIndex = company.images.length;

    const sanitizeFileName = (name) =>
      String(name || "file")
        .replace(/[/\\?%*:|"<>]/g, "_")
        .replace(/\s+/g, "_");

    const results = await Promise.allSettled(
      files.map(async (file, i) => {
        const uniqueKey = `${folderPath}/${folderType}/${sanitizeFileName(
          file.originalname,
        )}`;
        const data = await uploadFileToS3(uniqueKey, file);
        return {
          url: data.url,
          id: data.id,
          index: startIndex + i + 1,
          originalName: file.originalname,
          key: uniqueKey,
        };
      }),
    );

    // Split successes and failures
    const successes = [];
    const failures = [];

    for (const r of results) {
      if (r.status === "fulfilled") successes.push(r.value);
      else failures.push({ reason: r.reason?.message || "Unknown error" });
    }

    // Append successful uploads to the company doc
    if (successes.length) {
      company.images.push(
        ...successes.map((s) => ({ url: s.url, index: s.index })),
      );
      // Skip validators to avoid tripping on unrelated fields
      await company.save({ validateBeforeSave: false });
    }

    return res.status(failures.length ? 207 : 200).json({
      message:
        failures.length && successes.length
          ? `Uploaded ${successes.length} images; ${failures.length} failed`
          : failures.length
            ? "All uploads failed"
            : `Successfully uploaded ${successes.length} images`,
      data: {
        companyId: company._id,
        businessId: company.businessId,
        type: folderType,
        uploaded: successes,
        failed: failures,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editCompanyImagesBulk = async (req, res, next) => {
  try {
    const files = req.files;
    const { companyId, businessId, companyType = "" } = req.body;

    if (!companyId || !businessId || !companyType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!files || !files.length) {
      return res.status(400).json({ message: "No files provided" });
    }

    let company = await Company.findOne({ businessId }).exec();

    if (!company) {
      return res.status(404).json({ message: "No such company found" });
    }

    if (
      companyType &&
      company.companyType?.toLowerCase() !== String(companyType).toLowerCase()
    ) {
      return res
        .status(400)
        .json({ message: "companyType does not match the stored company" });
    }

    // --- STEP 1: Delete old images from S3 ---
    if (Array.isArray(company.images) && company.images.length > 0) {
      const deleteResults = await Promise.allSettled(
        company.images.map(async (img) => {
          if (img.url) {
            try {
              await deleteFileFromS3ByUrl(img.url);
              return { success: true, url: img.url };
            } catch (err) {
              return { success: false, url: img.url, reason: err.message };
            }
          }
        }),
      );

      const failedDeletes = deleteResults.filter(
        (r) => r.status === "rejected",
      );
      if (failedDeletes.length > 0) {
        console.warn("Some old images failed to delete:", failedDeletes);
      }
    }

    // Clear the old images array in DB
    company.images = [];

    // --- STEP 2: Upload new images to S3 ---
    const formatCompanyType = (type) => {
      const map = {
        hostel: "hostels",
        privatestay: "private-stay",
        meetingroom: "meetingroom",
        coworking: "coworking",
        cafe: "cafe",
        coliving: "coliving",
        workation: "workation",
      };
      const key = String(type || "").toLowerCase();
      return map[key] || "unknown";
    };

    const pathCompanyType = formatCompanyType(
      companyType || company.companyType,
    );
    const safeCompanyName =
      (company.companyName || "unnamed").replace(/[^\w\- ]+/g, "").trim() ||
      "unnamed";
    const folderPath = `nomads/${pathCompanyType}/${company.country}/${safeCompanyName}`;
    const folderType = "images";

    const sanitizeFileName = (name) =>
      String(name || "file")
        .replace(/[/\\?%*:|"<>]/g, "_")
        .replace(/\s+/g, "_");

    const uploadResults = await Promise.allSettled(
      files.map(async (file, i) => {
        const uniqueKey = `${folderPath}/${folderType}/${sanitizeFileName(
          file.originalname,
        )}`;
        const data = await uploadFileToS3(uniqueKey, file);
        return {
          url: data.url,
          id: data.id,
          index: i + 1,
          originalName: file.originalname,
          key: uniqueKey,
        };
      }),
    );

    const successes = [];
    const failures = [];

    for (const r of uploadResults) {
      if (r.status === "fulfilled") successes.push(r.value);
      else failures.push({ reason: r.reason?.message || "Unknown error" });
    }

    // --- STEP 3: Save new image list to DB ---
    if (successes.length) {
      company.images = successes.map((s) => ({
        url: s.url,
        id: s.id,
        index: s.index,
      }));
      await company.save({ validateBeforeSave: false });
    }

    // --- STEP 4: Return response ---
    return res.status(failures.length ? 207 : 200).json({
      message:
        failures.length && successes.length
          ? `Replaced ${successes.length} images; ${failures.length} failed`
          : failures.length
            ? "All uploads failed"
            : `Successfully replaced all images`,
      data: {
        companyId: company._id,
        businessId: company.businessId,
        type: folderType,
        uploaded: successes,
        failed: failures,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editCompany = async (req, res, next) => {
  try {
    const {
      businessId,
      address,
      about,
      totalSeats,
      latitude,
      longitude,
      googleMap,
      ratings,
      totalReviews,
      inclusions,
      cost,
      companyType,
      companyTitle,
      companyName,
      reviews,
      existingImages = [],
      images = [], // This comes from the remote API with all images (existing + new)
    } = req.body;

    const company = await Company.findOne({ businessId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const newCompanyType = companyType
      ?.trim()
      ?.split(" ")
      .join("")
      .toLowerCase();
    const isCompanyTypeChanged = newCompanyType !== company.companyType;

    // Store old images for potential deletion
    const oldImages = [...company.images];

    // Update scalar fields
    company.address = address?.trim() || company.address;
    company.companyName = companyName?.trim() || company.companyName;
    company.companyTitle = companyTitle?.trim() || company.companyTitle;
    company.about = about?.trim() || company.about;
    company.totalSeats = totalSeats ? parseInt(totalSeats) : company.totalSeats;
    company.latitude = latitude ? parseFloat(latitude) : company.latitude;
    company.longitude = longitude ? parseFloat(longitude) : company.longitude;
    company.googleMap = googleMap?.trim() || company.googleMap;
    company.ratings = ratings ? parseFloat(ratings) : company.ratings;
    company.totalReviews = totalReviews
      ? parseInt(totalReviews)
      : company.totalReviews;
    company.inclusions = inclusions?.trim() || company.inclusions;
    company.companyType = newCompanyType || company.companyType;

    // ---------- IMAGE HANDLING ----------
    let imagesToDelete = [];

    // Use 'images' from remote API (which has existing + new images)
    // or fallback to 'existingImages' if not provided
    // const updatedImages = images.length > 0 ? images : existingImages;

    let updatedImages;

    if (Array.isArray(images) && images.length > 0) {
      updatedImages = images;
    } else if (Array.isArray(existingImages) && existingImages.length > 0) {
      updatedImages = existingImages;
    } else {
      updatedImages = company.images; // fallback to existing DB images
    }

    if (updatedImages.length > 10) {
      console.log("updatedImages images", updatedImages.length);
      return res.status(400).json({
        message: `A maximum of 10 images is allowed. You sent ${updatedImages.length}.`,
      });
    }

    if (isCompanyTypeChanged) {
      console.log(
        "🔄 Company type changed - will delete all old images after save",
      );
      // When company type changes, delete ALL old images
      imagesToDelete = oldImages;
      company.images = updatedImages;
    } else {
      // Company type stayed the same - delete only removed images
      const updatedImageUrls = updatedImages.map((img) => img.url);
      imagesToDelete = oldImages.filter(
        (img) => !updatedImageUrls.includes(img.url),
      );

      if (imagesToDelete.length > 0) {
        console.log(
          `🗑️ Will delete ${imagesToDelete.length} removed images after save`,
        );
      }

      // Update with all images (existing + new)
      company.images = updatedImages;
      console.log(`📷 Updated company images: ${company.images.length} total`);
    }

    // Save company first
    const savedCompany = await company.save();
    console.log("✅ Company saved successfully");

    // NOW delete images from S3 after successful DB save
    if (imagesToDelete.length > 0) {
      console.log(`🗑️ Deleting ${imagesToDelete.length} images from S3...`);
      const deleteResults = await Promise.allSettled(
        imagesToDelete.map((img) => deleteFileFromS3ByUrl(img.url)),
      );

      const failed = deleteResults.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        console.warn(`⚠️ Failed to delete ${failed.length} images from S3`);
      } else {
        console.log("✅ All old images deleted from S3");
      }
    }

    /** ---------------- REVIEWS UPDATE LOGIC ---------------- **/
    // if (Array.isArray(reviews) && reviews.length > 0) {
    //   await Review.deleteMany({ company: company._id });
    //   const reviewDocs = reviews.map((review) => ({
    //     company: company._id,
    //     companyId: company.companyId,
    //     name: review.name?.trim(),
    //     starCount: parseInt(review.starCount),
    //     description: review.review?.trim(),
    //     reviewSource: review.reviewSource?.trim(),
    //     reviewLink: review.reviewLink?.trim(),
    //   }));
    //   await Review.insertMany(reviewDocs);
    // }

    if (Array.isArray(reviews)) {
      const existingReviews = await Review.find({ company: company._id });

      const incomingIds = reviews.map((r) => r._id).filter(Boolean);

      // Delete only removed ones
      await Review.deleteMany({
        company: company._id,
        _id: { $nin: incomingIds },
      });

      // Upsert each review
      for (const review of reviews) {
        if (review._id) {
          await Review.findByIdAndUpdate(review._id, review);
        } else {
          const reviewExists = await Review.findOne({
            company: company._id,
            name: review.name,
          });

          if (reviewExists) {
            return res.status(400).json({
              message: "You can add review to the same product only once.",
            });
          } else {
            await Review.create({
              ...review,
              company: company._id,
              companyId: company.companyId,
            });
          }
        }
      }
    }

    res.status(200).json({
      message: "Company updated successfully",
      company: savedCompany,
    });
  } catch (error) {
    console.error("❌ Error in editCompany:", error);
    next(error);
  }
};

export const addTemplateLink = async (req, res, next) => {
  try {
    const { companyName, link } = req.body;

    const updatedCompany = await Company.updateMany(
      { companyName },
      { $set: { websiteTemplateLink: link } },
      { new: true },
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "No company found" });
    }

    return res
      .status(200)
      .json({ message: "Template link added successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find();

    if (!leads || !leads.length) {
      return res.status(200).json({
        message: "No leads found",
      });
    }

    return res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

export const activateProduct = async (req, res, next) => {
  try {
    const { businessId, status } = req.body;

    if (!businessId) {
      return res.status(400).json({
        message: "Company Id missing",
      });
    }
    if (typeof status !== "boolean") {
      return res.status(400).json({
        message: "Status must be true/false",
      });
    }

    const product = await Company.findOneAndUpdate(
      { businessId },
      { isActive: status },
    );

    if (!product) {
      return res.status(400).json({
        message: "Failed to update product",
      });
    }

    const activeStatus = status ? "activated" : "deactivated";
    return res
      .status(200)
      .json({ message: `Product ${activeStatus} successfully` });
  } catch (error) {
    next(error);
  }
};

export const deactivateProduct = async (req, res, next) => {
  try {
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({
        message: "Company Id missing",
      });
    }

    const product = await Company.findOneAndUpdate(
      { businessId },
      { isActive: false },
    );

    if (!product) {
      return res.status(400).json({
        message: "Product not found or failed to deactivate",
      });
    }

    return res
      .status(200)
      .json({ message: "Product has been deactivated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCompanyLeads = async (req, res, next) => {
  try {
    const { companyId } = req.query;
    let query = {};

    if (companyId) {
      query.companyId = companyId;
    }

    const leads = await Lead.find(query);

    if (!leads || !leads.length) {
      return res.status(200).json({
        message: "No leads found",
      });
    }

    return res.status(200).json(leads);
  } catch (error) {
    console.error("[getCompanyLeads] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLeads = async (req, res, next) => {
  try {
    const { status, comment, leadId } = req.body;

    if ((!leadId && typeof status !== "boolean") || (!leadId && !comment)) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const query = {};

    if (comment) {
      query.comment = comment;
    }

    if (status) {
      query.status = status;
    }

    const leads = await Lead.findByIdAndUpdate(
      {
        _id: leadId,
      },
      query,
    );

    if (!leads) {
      return res.status(400).json({
        message: "Failed to update lead",
      });
    }

    return res.status(200).json({
      message: `Lead ${comment ? "comment" : "status"} updated`,
    });
  } catch (error) {
    console.error("[getCompanyLeads] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
