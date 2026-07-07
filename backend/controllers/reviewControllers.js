import Review from "../models/Reviews.js";
import { Readable } from "stream";
import csvParser from "csv-parser";
import Company from "../models/Company.js";
// import TestReview from "../models/TestReview.js";
import NomadUser from "../models/NomadUser.js";

export const bulkInsertReviews = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ message: "Please provide a valid CSV file" });
    }

    const companies = await Company.find().lean();
    const companyMap = new Map(
      companies.map((item) => [item.businessId?.trim(), item._id]),
    );

    const companyIdMap = new Map();
    const companyNameMap = new Map(); // To get company names for logging
    companies.map((company) => {
      companyIdMap.set(company.businessId, company.companyId);
      companyNameMap.set(company.businessId, company.companyName);
    });

    // Fetch existing reviews to check for duplicates
    const existingReviews = await Review.find().select("name company");
    const existingReviewSet = new Set(
      existingReviews.map(
        (review) =>
          `${review.name?.trim().toLowerCase()}|${review.company?.toString()}`,
      ),
    );

    const reviews = [];
    const seenInCSV = new Set();
    let skippedExisting = 0;
    let skippedDuplicateInCSV = 0;
    const missingCompanyRows = [];
    const duplicateExistingLogs = [];
    const duplicateCSVLogs = [];

    const stream = Readable.from(file.buffer.toString("utf-8").trim());
    stream
      .pipe(csvParser())
      .on("data", (row) => {
        const businessId = row["Business ID"]?.trim();
        const companyMongoId = companyMap.get(businessId);
        const companyId = companyIdMap.get(businessId);
        const companyName = companyNameMap.get(businessId);
        const reviewerName = row["Reviewer Name"]?.trim();

        if (!companyMongoId) {
          missingCompanyRows.push({
            businessId,
            reviewerName,
            reason: "Invalid Business ID - Company not found",
          });
          console.log(
            `❌ Missing Company - Business ID: "${businessId}", Reviewer: "${reviewerName}"`,
          );
          return;
        }

        if (!reviewerName || !companyMongoId) {
          return;
        }

        // Create unique key for this review (name + company ObjectId)
        const reviewKey = `${reviewerName.toLowerCase()}|${companyMongoId.toString()}`;

        // Check if this review already exists in DB
        if (existingReviewSet.has(reviewKey)) {
          skippedExisting++;
          duplicateExistingLogs.push({
            reviewerName,
            companyName,
            companyId,
            reason: "Already exists in database",
          });
          // console.log(
          //   `⚠️ Skipped (Exists in DB) - Reviewer: "${reviewerName}", Company: "${companyName}" (${companyId})`,
          // );
          return;
        }

        // Check for duplicates within the CSV
        if (seenInCSV.has(reviewKey)) {
          skippedDuplicateInCSV++;
          duplicateCSVLogs.push({
            reviewerName,
            companyName,
            companyId,
            reason: "Duplicate within CSV",
          });
          console.log(
            `⚠️ Skipped (Duplicate in CSV) - Reviewer: "${reviewerName}", Company: "${companyName}" (${companyId})`,
          );
          return;
        }

        const formattedReviews = {
          company: companyMongoId,
          companyId,
          name: reviewerName,
          starCount: parseInt(row["Rating"]?.trim()) || 0,
          description: row["Review Text"]?.trim(),
          reviewSource: row["Platform"]?.trim(),
          reviewLink: row["Review Link"]?.trim(),
          status: "approved",
        };

        seenInCSV.add(reviewKey);
        reviews.push(formattedReviews);
      })
      .on("end", async () => {
        // Log summary of duplicates
        console.log("\n📊 REVIEW SUMMARY:");
        console.log(`Total skipped (existing in DB): ${skippedExisting}`);
        console.log(
          `Total skipped (duplicate in CSV): ${skippedDuplicateInCSV}`,
        );
        console.log(`Total missing companies: ${missingCompanyRows.length}`);
        console.log(`Total to be inserted: ${reviews.length}`);

        if (missingCompanyRows.length > 0) {
          console.log("\n❌ Missing Companies:");
          missingCompanyRows.forEach((log, index) => {
            console.log(
              `${index + 1}. Business ID: "${log.businessId}", Reviewer: "${
                log.reviewerName
              }"`,
            );
          });
        }

        if (duplicateExistingLogs.length > 0) {
          console.log("\n🔍 Reviews already in database:");
          duplicateExistingLogs.forEach((log, index) => {
            console.log(
              `${index + 1}. Reviewer: "${log.reviewerName}", Company: "${
                log.companyName
              }" (${log.companyId})`,
            );
          });
        }

        if (duplicateCSVLogs.length > 0) {
          console.log("\n🔍 Duplicate reviews within CSV:");
          duplicateCSVLogs.forEach((log, index) => {
            console.log(
              `${index + 1}. Reviewer: "${log.reviewerName}", Company: "${
                log.companyName
              }" (${log.companyId})`,
            );
          });
        }

        if (reviews.length === 0) {
          return res.status(400).json({
            message:
              "No valid review data found in CSV.\nCheck if the entries are already uploaded.",
            skippedExisting,
            duplicateExistingLogs,
            skippedDuplicateInCSV,
            duplicateCSVLogs,
            missingCompanyCount: missingCompanyRows.length,
            missingCompanyRows,
          });
        }

        try {
          const result = await Review.insertMany(reviews);
          const insertedCount = result.length;

          res.status(200).json({
            message: "Bulk insert completed successfully",
            total:
              reviews.length +
              skippedExisting +
              skippedDuplicateInCSV +
              missingCompanyRows.length,
            inserted: insertedCount,
            skippedExisting,
            duplicateExistingLogs,
            skippedDuplicateInCSV,
            duplicateCSVLogs,
            missingCompanyCount: missingCompanyRows.length,
            missingCompanyRows,
          });
        } catch (insertError) {
          if (insertError.name === "BulkWriteError") {
            const insertedCount = insertError.result?.nInserted || 0;

            res.status(200).json({
              message: "Bulk insert completed with partial failure",
              total: reviews.length,
              inserted: insertedCount,
              skippedExisting,
              duplicateExistingLogs,
              skippedDuplicateInCSV,
              duplicateCSVLogs,
              missingCompanyCount: missingCompanyRows.length,
              missingCompanyRows,
              writeErrors: insertError.writeErrors?.map((e) => ({
                index: e.index,
                errmsg: e.errmsg,
                code: e.code,
              })),
            });
          } else {
            res.status(500).json({
              message: "Unexpected error during bulk insert",
              error: insertError.message,
            });
          }
        }
      });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const {
      businessId,
      name,
      starCount,
      description,
      reviewSource,
      reviewLink,
    } = req.body;

    if (!businessId) {
      return res
        .status(400)
        .json({ message: "Company identifier is required" });
    }

    const parsedStarCount = starCount ? Number(starCount) : undefined;
    if (
      parsedStarCount !== undefined &&
      (Number.isNaN(parsedStarCount) ||
        parsedStarCount < 1 ||
        parsedStarCount > 5)
    ) {
      return res
        .status(400)
        .json({ message: "Star count must be between 1 and 5" });
    }

    const company = await Company.findOne({ businessId });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const reviewExists = await Review.findOne({ company: company._id, name });

    if (reviewExists) {
      return res
        .status(400)
        .json({ message: "You can add review for same product only once" });
    }

    const review = await Review.create({
      company: company._id,
      companyId: company.companyId,
      name: name?.trim(),
      starCount: parsedStarCount,
      description: description?.trim(),
      reviewSource: reviewSource?.trim(),
      reviewLink: reviewLink?.trim(),
      status: "pending",
      reviewer: req.userData._id,
    });

    return res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReviewStatus = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { status, userId, date, userType } = req.body;
    let data = { status, userType };

    if (!userType || !["MASTER", "HOST"].includes(userType)) {
      return res.status(400).json({ message: "User type is invalid" });
    }

    if (!reviewId) {
      return res.status(400).json({ message: "Review id is required" });
    }

    const allowedStatuses = ["approved", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid review status" });
    }

    if (status === "approved") {
      data = {
        ...data,
        approvedBy: { userId, userType },
        approvedDate: new Date(date),
      };
    } else {
      data = {
        ...data,
        rejectedBy: { userId, userType },
        rejectedDate: new Date(date),
      };
    }
    const review = await Review.findByIdAndUpdate(reviewId, data, {
      new: true,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({
      message: `Review ${status} successfully`,
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByCompany = async (req, res, next) => {
  try {
    const { companyId, companyType = "", status: _status = "pending" } = req.query;

    let cmpQuery = {};

    if (companyId) {
      cmpQuery = { companyId };
    }
    if (companyType) {
      cmpQuery = { ...cmpQuery, companyType };
    }

    // 1️⃣ Resolve company once (cheap, indexed)
    let company;

    if (companyId) {
      company = await Company.findOne(cmpQuery).select("_id").lean();

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
    }

    let query = {
      $or: [
        { status: "pending" },
        { "approvedBy.userId": { $exists: true, $ne: null } },
        { "rejectedBy.userId": { $exists: true, $ne: null } },
      ],
    };

    if (companyId) {
      query = { ...query, companyId };
    }

    if (companyType) {
      query = { ...query, company: company._id };
    }

    // if (status) {
    //   query = { ...query, status };
    // }

    // 2️⃣ Fetch reviews using ObjectId (fast)
    const reviews = await Review.find(query)
      .populate("reviewer", "fullName email mobile")
      .lean()
      .exec();

    return res.status(200).json({
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByUser = async (req, res, next) => {
  try {
    const user = req.userData._id;

    // 1️⃣ Resolve company once (cheap, indexed)

    const userExists = await NomadUser.findOne({ _id: user })
      .select("_id fullName")
      .lean();

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Fetch reviews using ObjectId (fast)
    const reviews = await Review.find({ reviewer: user })
      .populate([
        { path: "reviewer", select: "fullName email mobile" },
        {
          path: "company",
          select:
            "businessId companyName companyId images logo totalReviews ratings companyType isActive isPublic city state",
        },
      ])
      .lean()
      .exec();

    return res.status(200).json({
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};
