import PointOfContact from "../models/PointOfContact.js";
import { Readable } from "stream";
import csvParser from "csv-parser";
import Company from "../models/Company.js";
import TestPointOfContact from "../models/TestPointOfContacts.js";
import axios from "axios";
import TestListing from "../models/TestCompany.js";

export const bulkInsertPoc = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "Please provide a valid CSV file",
      });
    }

    const companies = await Company.find().lean();
    const companyMap = new Map(
      companies.map((item) => [item.businessId?.trim(), item._id]),
    );
    const companyIdMap = new Map(
      companies.map((c) => [c.businessId, c.companyId]),
    );

    const existingPocs = await PointOfContact.find()
      .populate({ path: "company", select: "businessId" })
      .select("name email companyId");

    const brokenCompanyRefs = existingPocs.filter((p) => !p.company);

    if (brokenCompanyRefs.length) {
      console.log("\n=== POCs WITH NULL COMPANY REF ===");
      console.table(
        brokenCompanyRefs.map((p) => ({
          pocId: p._id,
          pocName: p.name,
          email: p.email,
          company: p.company, // will be null or undefined
        })),
      );
    }

    const existingPocSet = new Set(
      existingPocs.map(
        (poc) =>
          `${poc?.email
            ?.trim()
            .toLowerCase()}|${poc.company.businessId?.trim()}`,
      ),
    );

    // CSV parsing
    const parsedResult = await new Promise((resolve, reject) => {
      const temp = [];
      const seenInCSV = new Set();
      const duplicateExistingLogs = [];
      const duplicateCSVLogs = [];
      const missingCompanyRows = [];

      const stream = Readable.from(file.buffer.toString("utf-8").trim());
      stream
        .pipe(csvParser())
        .on("data", (row) => {
          const businessId = row["Business ID"]?.trim();
          const companyMongoId = companyMap.get(businessId);
          const companyId = companyIdMap.get(businessId);
          if (!companyMongoId) {
            missingCompanyRows.push({
              businessId,
              pocName: row["POC Name"]?.trim(),
              email: row["Email"]?.trim(),
              reason: "Invalid Business ID - Company not found",
            });

            return;
          }

          const pocName = row["POC Name"]?.trim();
          const email = row["Email"]?.trim() || "";
          const pocKey = `${email?.toLowerCase()}|${businessId?.trim()}`;

          if (existingPocSet.has(pocKey)) {
            duplicateExistingLogs.push({
              businessId,
              companyId,
              name: pocName,
              reason: "Already exists in DB",
            });
            return;
          }
          if (seenInCSV.has(pocKey)) {
            duplicateCSVLogs.push({
              businessId,
              companyId,
              name: pocName,
              email: email,
              reason: "Duplicate within same CSV",
            });
            return;
          }

          const languages =
            row["Languages"]?.split(",").map((lang) => lang.trim()) ||
            row["Languages"]?.trim();

          const pocData = {
            company: companyMongoId,
            companyId,
            name: pocName,
            profileImage: row["POC Image"]?.trim(),
            designation: row["POC Designation"]?.trim(),
            email: row["Email"]?.trim().toLowerCase(),
            phone: row["Phone Number"]?.trim(),
            linkedInProfile: row["LinkedIn Profile"]?.trim(),
            languagesSpoken: languages,
            address: row["Address"]?.trim(),
            availabilityTime: row["Availibility time"]?.trim(),
          };

          seenInCSV.add(pocKey);
          temp.push(pocData);
        })
        .on("end", () => {
          // Log duplicates for visibility
          // if (duplicateExistingLogs.length) {
          //   console.log("\n=== EXISTING POCs IN DB ===");
          //   console.table(duplicateExistingLogs);
          // }
          // if (duplicateCSVLogs.length) {
          //   console.log("\n=== DUPLICATES FOUND IN SAME CSV ===");
          //   console.table(duplicateCSVLogs);
          // }

          resolve({
            pocs: temp,
            duplicateExistingLogs,
            duplicateCSVLogs,
            missingCompanyRows,
          });
        })
        .on("error", (err) => reject(err));
    });

    const {
      pocs,
      duplicateExistingLogs,
      duplicateCSVLogs,
      missingCompanyRows,
    } = parsedResult;

    if (!pocs.length) {
      return res.status(400).json({
        message: `No valid POC data found in CSV. Check skipped entries below.`,
        skippedExisting: duplicateExistingLogs.length,
        duplicateExistingLogs,
        skippedDuplicateInCSV: duplicateCSVLogs.length,
        duplicateCSVLogs,
        missingCompanyCount: missingCompanyRows.length,
        missingCompanyRows,
      });
    }

    // Insert into Nomads DB
    let nomadsStatus = "failed";
    let masterPanelStatus = "not attempted";

    try {
      const uploadedPocs = await PointOfContact.insertMany(pocs);
      nomadsStatus = "success";

      const masterPanelPocs = uploadedPocs.map((poc) => ({
        companyId: poc.companyId,
        name: poc.name,
        designation: poc.designation,
        email: poc.email,
        phone: poc.phone,
        linkedInProfile: poc.linkedInProfile,
        languagesSpoken: poc.languagesSpoken,
        address: poc.address,
        profileImage: poc.profileImage,
      }));

      // Sync with master panel
      try {
        // (API base URL now configured via env)
        const response = await axios.post(
          `${process.env.MASTER_PANEL_URL || "http://localhost:5000"}/api/host-user/bulk-insert-poc`,
          { pocs: masterPanelPocs },
          { headers: { "Content-Type": "application/json" } },
        );
        masterPanelStatus = `success (${response.status})`;

        return res.status(201).json({
          message: "Bulk insert completed successfully",
          total:
            pocs.length +
            duplicateExistingLogs.length +
            duplicateCSVLogs.length +
            missingCompanyRows.length,
          inserted: pocs.length,
          skippedExisting: duplicateExistingLogs.length,
          duplicateExistingLogs,
          skippedDuplicateInCSV: duplicateCSVLogs.length,
          duplicateCSVLogs,
          missingCompanyCount: missingCompanyRows.length,
          missingCompanyRows,
          statusReport: {
            nomadsDB: nomadsStatus,
            masterPanel: masterPanelStatus,
            masterPanelLogs: response.data,
          },
        });

        // return res.status(201).json({
        //   message: `${pocs.length} POCs inserted successfully in both databases.`,
        //   inserted: pocs.length,
        //   skippedExisting: duplicateExistingLogs.length,
        //   skippedDuplicateInCSV: duplicateCSVLogs.length,
        //   duplicateExistingLogs,
        //   duplicateCSVLogs,
        //   statusReport: {
        //     nomadsDB: nomadsStatus,
        //     masterPanel: masterPanelStatus,
        //   },
        // });
      } catch (masterErr) {
        console.error(
          "Master panel error:",
          masterErr.response?.data || masterErr.message,
        );
        masterPanelStatus = `failed (${masterErr.message})`;

        return res.status(201).json({
          message: "POCs inserted in Nomads DB, but master panel sync failed.",
          total:
            pocs.length +
            duplicateExistingLogs.length +
            duplicateCSVLogs.length +
            missingCompanyRows.length,
          inserted: pocs.length,
          skippedExisting: duplicateExistingLogs.length,
          duplicateExistingLogs,
          skippedDuplicateInCSV: duplicateCSVLogs.length,
          duplicateCSVLogs,
          missingCompanyCount: missingCompanyRows.length,
          missingCompanyRows,
          statusReport: {
            nomadsDB: nomadsStatus,
            masterPanelStatus,
            masterPanel: masterErr.response?.data || masterErr.message,
          },
        });

        // return res.status(201).json({
        //   message: "POCs inserted in Nomads DB, but master panel sync failed.",
        //   inserted: pocs.length,
        //   skippedExisting: duplicateExistingLogs.length,
        //   skippedDuplicateInCSV: duplicateCSVLogs.length,
        //   duplicateExistingLogs,
        //   duplicateCSVLogs,
        //   statusReport: {
        //     nomadsDB: nomadsStatus,
        //     masterPanel: masterErr.message,
        //   },
        // });
      }
    } catch (nomadsErr) {
      nomadsStatus = `failed (${nomadsErr.message})`;

      return res.status(500).json({
        message: "Nomads DB upload failed. No data uploaded anywhere.",
        total: 0,
        inserted: 0,
        skippedExisting: duplicateExistingLogs.length,
        duplicateExistingLogs,
        skippedDuplicateInCSV: duplicateCSVLogs.length,
        duplicateCSVLogs,
        missingCompanyCount: missingCompanyRows.length,
        missingCompanyRows,
        statusReport: {
          nomadsDB: nomadsStatus,
          masterPanel: "not attempted",
        },
      });

      // return res.status(500).json({
      //   message: "Nomads DB upload failed. No data uploaded anywhere.",
      //   inserted: 0,
      //   skippedExisting: duplicateExistingLogs.length,
      //   skippedDuplicateInCSV: duplicateCSVLogs.length,
      //   duplicateExistingLogs,
      //   duplicateCSVLogs,
      //   statusReport: {
      //     nomadsDB: nomadsStatus,
      //     masterPanel: "not attempted",
      //   },
      // });
    }
  } catch (error) {
    console.error("Bulk insert error:", error);
    next(error);
  }
};

export const createPOC = async (req, res, next) => {
  try {
    const payload = req.body;

    const pocData = {
      name: payload?.name,
      companyId: payload?.companyId,
      designation: payload?.designation,
      email: payload?.email,
      phone: payload?.phone,
      linkedInProfile: payload?.linkedInProfile,
      languagesSpoken: payload?.languagesSpoken || [],
      address: payload?.address,
      profileImage: payload?.profileImage,
      isActive: payload?.isActive ?? true,
      availibilityTime: payload?.availibilityTime,
    };

    const poc = await PointOfContact.findOne({
      companyId: payload.companyId,
    });

    if (poc) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newPOC = new PointOfContact(pocData);
    const savedPOC = await newPOC.save();

    return res.status(201).json({
      success: true,
      message: "Point of Contact created successfully",
      data: savedPOC,
    });
  } catch (error) {
    next(error);
  }
};

export const getPocDetails = async (req, res, next) => {
  try {
    const { companyId } = req.query;
    let query = {};

    if (companyId) {
      query = { companyId };
    }

    const pocDetails = await PointOfContact.find(query).populate({
      path: "company",
      select: "companyName",
    });

    if (!pocDetails) {
      return res.status(400).json({ message: "No POC details found" });
    }

    return res.status(200).json(pocDetails);
  } catch (error) {
    next(error);
  }
};

export const editPOC = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const payload = req.body;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "companyId is required",
      });
    }

    const existingPOCs = await PointOfContact.find({ companyId }).select("_id");

    if (!existingPOCs.length) {
      return res.status(404).json({
        success: false,
        message: "No POC entries found for this companyId",
      });
    }

    const normalizedEmail = payload?.email?.trim()?.toLowerCase();
    const sourceCompanyId = companyId;
    const targetCompanyId = payload?.companyId || sourceCompanyId;

    const updatedFields = {
      name: payload?.name,
      companyId: payload?.companyId,
      designation: payload?.designation,
      email: normalizedEmail || payload?.email,
      phone: payload?.phone,
      linkedInProfile: payload?.linkedInProfile,
      languagesSpoken: payload?.languagesSpoken,
      address: payload?.address,
      profileImage: payload?.profileImage,
      isActive: payload?.isActive,
      availibilityTime: payload?.availibilityTime,
    };

    Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] === undefined) {
        delete updatedFields[key];
      }
    });

    const sourceCompanyPocIds = existingPOCs.map((poc) => poc._id);

    if (normalizedEmail) {
      const duplicatePOC = await PointOfContact.findOne({
        _id: { $nin: sourceCompanyPocIds },
        companyId: targetCompanyId,
        email: normalizedEmail,
      });

      if (duplicatePOC) {
        return res.status(400).json({
          success: false,
          message: "Email already exists for this company",
        });
      }
    }

    const updateResult = await PointOfContact.updateMany(
      { companyId: sourceCompanyId },
      { $set: updatedFields },
      { runValidators: true },
    );

    const updatedPOCs = await PointOfContact.find({
      companyId: targetCompanyId,
    });

    return res.status(200).json({
      success: true,
      message: "Point of Contact entries updated successfully",
      sourceCompanyId,
      updatedCompanyId: targetCompanyId,
      matchedCount: updateResult.matchedCount,
      updatedCount: updateResult.modifiedCount,
      data: updatedPOCs,
    });
  } catch (error) {
    next(error);
  }
};
