import { Readable } from "stream";
import csvParser from "csv-parser";
import VisaRule from "../models/VisaRule.js";

export const VISA_REQUIREMENT_LABELS = {
  "traditional visa": "visa required",
  "e visa": "e-visa",
  evisa: "e-visa",
  "e-visa": "e-visa",
  "visa on arrival": "visa on arrival",
  "visa free": "visa free",
  "nomad visa": "nomad visa",
};

export const normalizeCountryKey = (value = "") => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");

  const aliases = {
    usa: "unitedstates",
    unitedstatesofamerica: "unitedstates",
    uae: "unitedarabemirates",
    unitedarabemirates: "unitedarabemirates",
    turkey: "turkiye",
    turkiye: "turkiye",
    czechrepublic: "czechia",
    czechia: "czechia",
    thebahamas: "bahamas",
    bahamas: "bahamas",
    thegambia: "gambia",
    gambia: "gambia",
    swaziland: "eswatini",
    eswatini: "eswatini",
    ivorycoast: "cotedivoire",
    cotedivoire: "cotedivoire",
    hongkong: "hongkongsarchina",
    hongkongsarchina: "hongkongsarchina",
    macao: "macaosarchina",
    macausarchina: "macaosarchina",
    macaosarchina: "macaosarchina",
    saintkittsandnevis: "stkittsandnevis",
    stkittsandnevis: "stkittsandnevis",
    saintlucia: "stlucia",
    stlucia: "stlucia",
    saintvincentandthegrenadines: "stvincentandthegrenadines",
    stvincentandthegrenadines: "stvincentandthegrenadines",
  };

  return aliases[normalized] || normalized;
};

export const normalizeVisaRequirement = (value = "") => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (!normalized || normalized === "show all") return "";

  return VISA_REQUIREMENT_LABELS[normalized] || normalized;
};

const escapeRegExp = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeRow = (row = {}) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      String(key || "")
        .replace(/\uFEFF/g, "")
        .trim(),
      typeof value === "string" ? value.trim() : value,
    ]),
  );

const parseCsvBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const rows = [];

    Readable.from(buffer.toString("utf-8"))
      .pipe(csvParser())
      .on("data", (row) => rows.push(normalizeRow(row)))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });

const getFirstColumnKey = (row = {}) => {
  const keys = Object.keys(row);
  return keys.find((key) => key) || null;
};

const getPassportFromRow = (row = {}) => {
  const key =
    Object.keys(row).find((rowKey) =>
      ["passport", "origin\\destination", "origin/destination"].includes(
        rowKey.toLowerCase(),
      ),
    ) || getFirstColumnKey(row);

  return key ? row[key] : "";
};

const buildMatrixMap = (rows = [], valueMapper = (value) => value) => {
  const matrix = new Map();

  rows.forEach((row) => {
    const passport = String(getPassportFromRow(row) || "").trim();
    if (!passport) return;

    Object.entries(row).forEach(([destination, rawValue]) => {
      if (destination === getFirstColumnKey(row)) return;

      const cleanedDestination = String(destination || "").trim();
      const value = valueMapper(rawValue);

      if (!cleanedDestination || value === undefined) return;

      const key = `${normalizeCountryKey(passport)}|${normalizeCountryKey(
        cleanedDestination,
      )}`;

      matrix.set(key, {
        passport,
        destination: cleanedDestination,
        value,
      });
    });
  });

  return matrix;
};

const parseDurationValue = (value) => {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || trimmed === "-1") return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

export const importVisaRulesCsv = async (req, res, next) => {
  try {
    const requirementFile = req.files?.["visa-requirement-file"]?.[0];
    const durationFile = req.files?.["visa-duration-file"]?.[0];

    if (!requirementFile || !durationFile) {
      return res.status(400).json({
        message:
          "Upload both CSV files using fields visa-requirement-file and visa-duration-file.",
      });
    }

    const [requirementRows, durationRows] = await Promise.all([
      parseCsvBuffer(requirementFile.buffer),
      parseCsvBuffer(durationFile.buffer),
    ]);

    const requirementMap = buildMatrixMap(requirementRows, (value) => {
      const cleaned = String(value ?? "").trim();
      if (!cleaned || cleaned === "-1") return "";
      return normalizeVisaRequirement(cleaned);
    });
    const durationMap = buildMatrixMap(durationRows, parseDurationValue);

    const operations = [];
    const seenKeys = new Set();

    requirementMap.forEach((entry, key) => {
      seenKeys.add(key);
      const durationEntry = durationMap.get(key);

      operations.push({
        updateOne: {
          filter: {
            passport: entry.passport,
            destination: entry.destination,
          },
          update: {
            $set: {
              passport: entry.passport,
              normalizedPassport: normalizeCountryKey(entry.passport),
              destination: entry.destination,
              normalizedDestination: normalizeCountryKey(entry.destination),
              requirement: entry.value,
              durationDays: durationEntry?.value ?? null,
            },
          },
          upsert: true,
        },
      });
    });

    durationMap.forEach((entry, key) => {
      if (seenKeys.has(key)) return;

      operations.push({
        updateOne: {
          filter: {
            passport: entry.passport,
            destination: entry.destination,
          },
          update: {
            $set: {
              passport: entry.passport,
              normalizedPassport: normalizeCountryKey(entry.passport),
              destination: entry.destination,
              normalizedDestination: normalizeCountryKey(entry.destination),
              durationDays: entry.value,
            },
            $setOnInsert: { requirement: "" },
          },
          upsert: true,
        },
      });
    });

    if (!operations.length) {
      return res.status(400).json({
        message: "No visa rules were found in the uploaded CSV files.",
      });
    }

    const result = await VisaRule.bulkWrite(operations, { ordered: false });

    return res.status(200).json({
      message: "Visa rules imported successfully.",
      processedRules: operations.length,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getVisaRules = async (req, res, next) => {
  try {
    const {
      passportCountry,
      destinationCountry,
      requirement: rawRequirement,
    } = req.query;

    const requirement = normalizeVisaRequirement(rawRequirement);
    const query = {};

    if (passportCountry) {
      const normalizedPassport = normalizeCountryKey(passportCountry);
      query.$or = [{ passport: passportCountry }, { normalizedPassport }];
    }
    if (destinationCountry) {
      query.normalizedDestination = normalizeCountryKey(destinationCountry);
    }
    if (requirement) query.requirement = requirement;

    const data = (
      await VisaRule.find(query).sort({ passport: 1, destination: 1 }).lean()
    ).filter((rule) => {
      if (
        passportCountry &&
        (rule.normalizedPassport || normalizeCountryKey(rule.passport)) !==
          normalizeCountryKey(passportCountry)
      ) {
        return false;
      }

      if (
        destinationCountry &&
        (rule.normalizedDestination ||
          normalizeCountryKey(rule.destination)) !==
          normalizeCountryKey(destinationCountry)
      ) {
        return false;
      }

      return true;
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getUniqueDestinationCountries = async (req, res, next) => {
  try {
    const destinationCountries = await VisaRule.aggregate([
      {
        $project: {
          destination: 1,
          normalizedKey: {
            $toLower: {
              $trim: {
                input: {
                  $ifNull: ["$normalizedDestination", "$destination"],
                },
              },
            },
          },
        },
      },
      {
        $match: {
          destination: { $type: "string", $ne: "" },
          normalizedKey: { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$normalizedKey",
          destination: { $first: "$destination" },
        },
      },
      { $sort: { destination: 1 } },
      {
        $project: {
          _id: 0,
          destination: 1,
        },
      },
    ]);

    const countries = destinationCountries.map((item) => item.destination);

    return res.status(200).json({
      success: true,
      count: countries.length,
      countries,
    });
  } catch (error) {
    next(error);
  }
};

export const getVisaRuleDetailsByPassport = async (req, res, next) => {
  try {
    const passport = String(req.params.passport || "").trim();

    if (!passport) {
      return res.status(400).json({
        success: false,
        message: "passport is required in route params.",
      });
    }

    const normalizedPassport = normalizeCountryKey(passport);

    const data = await VisaRule.find({
      $or: [{ passport }, { normalizedPassport }],
    })
      .sort({ destination: 1 })
      .lean();

    const filteredData = data.filter(
      (rule) =>
        (rule.normalizedPassport || normalizeCountryKey(rule.passport)) ===
        normalizedPassport,
    );

    return res.status(200).json({
      success: true,
      count: filteredData.length,
      data: filteredData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVisaRuleByPassport = async (req, res, next) => {
  try {
    const passport = String(req.params.passport || "").trim();

    if (!passport) {
      return res.status(400).json({
        success: false,
        message: "passport is required in route params.",
      });
    }

    const destination = String(req.body.destination || "").trim();
    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "destination is required in request body.",
      });
    }

    const updates = {};

    if (Object.prototype.hasOwnProperty.call(req.body, "requirement")) {
      updates.requirement = normalizeVisaRequirement(req.body.requirement);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "durationDays")) {
      const rawDuration = req.body.durationDays;
      if (rawDuration === null || rawDuration === "") {
        updates.durationDays = null;
      } else {
        const parsed = Number(rawDuration);
        if (!Number.isFinite(parsed)) {
          return res.status(400).json({
            success: false,
            message: "durationDays must be a valid number or null.",
          });
        }
        updates.durationDays = parsed;
      }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "newDestination")) {
      const newDestination = String(req.body.newDestination || "").trim();
      if (!newDestination) {
        return res.status(400).json({
          success: false,
          message: "newDestination cannot be empty.",
        });
      }
      updates.destination = newDestination;
      updates.normalizedDestination = normalizeCountryKey(newDestination);
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message:
          "Provide at least one editable field (requirement, durationDays, newDestination).",
      });
    }

    const normalizedPassport = normalizeCountryKey(passport);
    const normalizedDestination = normalizeCountryKey(destination);

    const updatedRule = await VisaRule.findOneAndUpdate(
      {
        $and: [
          {
            $or: [
              { normalizedPassport },
              { passport: new RegExp(`^${escapeRegExp(passport)}$`, "i") },
            ],
          },
          {
            $or: [
              { normalizedDestination },
              {
                destination: new RegExp(`^${escapeRegExp(destination)}$`, "i"),
              },
            ],
          },
        ],
      },
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedRule) {
      return res.status(404).json({
        success: false,
        message:
          "Visa rule not found for the provided passport and destination.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Visa rule updated successfully.",
      data: updatedRule,
    });
  } catch (error) {
    next(error);
  }
};
