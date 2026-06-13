import { Readable } from "stream";
import csvParser from "csv-parser";
import WorldRankingState from "../models/WorldRankingState.js";

export const DEFAULT_WORLD_RANKING_WEIGHTS = {
  workInfrastructure: 0.2,
  internet: 0.15,
  costOfLiving: 0.2,
  safety: 0.1,
  visaFlexibility: 0.1,
  nomadCommunity: 0.15,
  healthcareCostIndex: 0.05,
  startupEcosystemScore: 0.03,
  airQualityIndex: 0.02,
};

const ATTRIBUTE_MAP = {
  overallScore: "overallScore",
  workInfrastructure: "scores.workInfrastructure",
  internet: "scores.internet",
  costOfLiving: "scores.costOfLiving",
  safety: "scores.safety",
  visaFlexibility: "scores.visaFlexibility",
  nomadCommunity: "scores.nomadCommunity",
  healthcareCostIndex: "scores.healthcareCostIndex",
  startupEcosystemScore: "scores.startupEcosystemScore",
  airQualityIndex: "scores.airQualityIndex",
};

const ATTRIBUTE_LABEL_TO_KEY = {
  "Overall Ranking Index": "overallScore",
  "Overall Score": "overallScore",
  "Work Infrastructure": "workInfrastructure",
  Internet: "internet",
  "Cost of Living": "costOfLiving",
  Safety: "safety",
  "Visa Flexibility": "visaFlexibility",
  "Nomad Community": "nomadCommunity",
  "Healthcare Cost Index": "healthcareCostIndex",
  "Startup Ecosystem Score": "startupEcosystemScore",
  "Air Quality Index": "airQualityIndex",
};

const SUPPORTED_SELECTION_TYPES = ["World Ranking"];

const resolveAttributeKey = (attribute) => {
  if (!attribute) return "overallScore";
  if (ATTRIBUTE_MAP[attribute]) return attribute;

  const normalized = String(attribute).trim();
  if (ATTRIBUTE_MAP[normalized]) return normalized;
  if (ATTRIBUTE_LABEL_TO_KEY[normalized])
    return ATTRIBUTE_LABEL_TO_KEY[normalized];

  return null;
};

const DROPDOWN_BADGES = {
  selectionTypes: SUPPORTED_SELECTION_TYPES,
  attributes: Object.keys(ATTRIBUTE_MAP),
  attributeLabels: ATTRIBUTE_LABEL_TO_KEY,
  formulas: {
    worldOverall:
      "FinalScore = 0.20*WorkInfrastructure + 0.15*Internet + 0.20*CostOfLiving + 0.10*Safety + 0.10*VisaFlexibility + 0.15*NomadCommunity + 0.05*HealthcareCostIndex + 0.03*StartupEcosystemScore + 0.02*AirQualityIndex",
  },
};

const normalize = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/\uFEFF/g, "").trim(),
      typeof v === "string" ? v.trim() : v,
    ]),
  );

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const parseTsv = (tsv) => {
  const lines = String(tsv || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0].split("\t").map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const cols = line.split("\t");
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = (cols[index] || "").trim();
    });
    return obj;
  });
};

const mapInputRow = (row) => {
  const rank = toNumber(row.rank ?? row.Rank);
  const continent = row.continent ?? row.Continent;
  const country = row.country ?? row.Country;
  const destination = row.destination ?? row.Destination;

  const mapped = {
    rank,
    continent,
    country,
    destination,
    scores: {
      workInfrastructure: toNumber(
        row.workInfrastructure ?? row["Work Infrastructure"],
      ),
      internet: toNumber(row.internet ?? row.Internet),
      costOfLiving: toNumber(row.costOfLiving ?? row["Cost of Living"]),
      safety: toNumber(row.safety ?? row.Safety),
      visaFlexibility: toNumber(row.visaFlexibility ?? row["Visa Flexibility"]),
      nomadCommunity: toNumber(row.nomadCommunity ?? row["Nomad Community"]),
      healthcareCostIndex: toNumber(
        row.healthcareCostIndex ?? row["Healthcare Cost Index"],
      ),
      startupEcosystemScore: toNumber(
        row.startupEcosystemScore ?? row["Startup Ecosystem Score"],
      ),
      airQualityIndex: toNumber(
        row.airQualityIndex ?? row["Air Quality Index"],
      ),
    },
    overallScore: toNumber(row.overallScore ?? row["Overall Score"]),
    weights: {
      ...DEFAULT_WORLD_RANKING_WEIGHTS,
      ...(row.weights || {}),
    },
  };

  return mapped;
};

const calculateWeightedScore = (stateDoc) => {
  const { scores, weights } = stateDoc;

  return Number(
    (
      scores.workInfrastructure * weights.workInfrastructure +
      scores.internet * weights.internet +
      scores.costOfLiving * weights.costOfLiving +
      scores.safety * weights.safety +
      scores.visaFlexibility * weights.visaFlexibility +
      scores.nomadCommunity * weights.nomadCommunity +
      scores.healthcareCostIndex * weights.healthcareCostIndex +
      scores.startupEcosystemScore * weights.startupEcosystemScore +
      scores.airQualityIndex * weights.airQualityIndex
    ).toFixed(3),
  );
};

export const getDropdownBadges = async (_req, res, next) => {
  try {
    const [continents, countries] = await Promise.all([
      WorldRankingState.distinct("continent"),
      WorldRankingState.distinct("country"),
    ]);

    return res.status(200).json({
      ...DROPDOWN_BADGES,
      continents: ["World", ...continents.sort()],
      countries: countries.sort(),
    });
  } catch (error) {
    next(error);
  }
};

export const getWorldRankingStates = async (req, res, next) => {
  try {
    const {
      continent,
      country,
      destination,
      attribute = "overallScore",
      limit,
      page = 1,
    } = req.query;

    const attributeKey = resolveAttributeKey(attribute);

    if (!attributeKey) {
      return res.status(400).json({
        message: `Invalid attribute. Use one of: ${Object.keys(ATTRIBUTE_MAP).join(", ")}`,
      });
    }

    const query = {};
    if (continent && continent !== "World") {
      query.continent = continent;
    }
    if (country) {
      query.country = country;
    }
    if (destination) {
      query.destination = { $regex: destination, $options: "i" };
    }

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.max(Number(limit) || 20, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [rows, total] = await Promise.all([
      WorldRankingState.find(query)
        .sort({ [ATTRIBUTE_MAP[attributeKey]]: -1, rank: 1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      WorldRankingState.countDocuments(query),
    ]);

    const data = rows.map((row, index) => ({
      ...row,
      weightedScore: calculateWeightedScore(row),
      rankLabel: `Rank ${skip + index + 1}`,
    }));

    return res.status(200).json({
      selectedAttribute: attributeKey,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
      },
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllWorldRankingStates = async (_req, res, next) => {
  try {
    const data = await WorldRankingState.find({})
      .sort({ rank: 1, country: 1, destination: 1 })
      .lean();

    return res.status(200).json({
      total: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const searchWorldRankingByBadges = async (req, res, next) => {
  try {
    const {
      selectionType = "World Ranking",
      continent = "World",
      attribute = "overallScore",
      page = 1,
      limit = 20,
    } = req.body || {};

    if (!SUPPORTED_SELECTION_TYPES.includes(selectionType)) {
      return res.status(400).json({
        message: `Invalid selectionType. Supported values: ${SUPPORTED_SELECTION_TYPES.join(", ")}`,
      });
    }

    const attributeKey = resolveAttributeKey(attribute);
    if (!attributeKey) {
      return res.status(400).json({
        message: `Invalid attribute. Use one of: ${Object.keys(ATTRIBUTE_MAP).join(", ")}`,
      });
    }

    const query = {};
    if (continent && continent !== "World") {
      query.continent = continent;
    }

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.max(Number(limit) || 20, 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [rows, total] = await Promise.all([
      WorldRankingState.find(query).lean(),
      WorldRankingState.countDocuments(query),
    ]);

    const data = rows
      .map((row) => {
        const selectedRawValue =
          attributeKey === "overallScore"
            ? row.overallScore
            : (row.scores?.[attributeKey] ?? null);

        const selectedWeight =
          attributeKey === "overallScore"
            ? 1
            : (row.weights?.[attributeKey] ??
              DEFAULT_WORLD_RANKING_WEIGHTS[attributeKey] ??
              1);

        const selectedWeightedValue = Number(
          (selectedRawValue * selectedWeight).toFixed(3),
        );

        return {
          ...row,
          selectedAttribute: attributeKey,
          selectedAttributeValue: selectedRawValue,
          selectedAttributeWeight: selectedWeight,
          selectedWeightedValue,
          weightedScore: calculateWeightedScore(row),
        };
      })
      .sort((a, b) => {
        if (b.selectedWeightedValue !== a.selectedWeightedValue) {
          return b.selectedWeightedValue - a.selectedWeightedValue;
        }

        if (
          attributeKey === "overallScore" &&
          b.overallScore !== a.overallScore
        ) {
          return b.overallScore - a.overallScore;
        }

        return a.rank - b.rank;
      })
      .slice(skip, skip + parsedLimit)
      .map((row, index) => ({
        ...row,
        rankLabel: `Rank ${skip + index + 1}`,
      }));

    return res.status(200).json({
      selectionType,
      continent,
      selectedAttribute: attributeKey,
      sortOrder: "desc",
      message:
        total === 0
          ? "No world ranking rows found. Import data first using /api/world-ranking/states/upsert, /api/world-ranking/states/bulk-upload-csv, or /api/world-ranking/states/import-tsv."
          : undefined,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
      },
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const upsertWorldRankingStates = async (req, res, next) => {
  try {
    const rows = req.body?.rows;

    if (!Array.isArray(rows) || !rows.length) {
      return res.status(400).json({
        message:
          "Please send payload as { rows: [...] } with at least one row.",
      });
    }

    const operations = rows.map((rawRow) => {
      const row = mapInputRow(rawRow);
      return {
        updateOne: {
          filter: { country: row.country, destination: row.destination },
          update: { $set: row },
          upsert: true,
        },
      };
    });

    const result = await WorldRankingState.bulkWrite(operations, {
      ordered: false,
    });

    return res.status(200).json({
      message: "World ranking states upserted successfully.",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });
  } catch (error) {
    next(error);
  }
};

// Old one - Works
export const bulkInsertWorldRankingCsv = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a CSV file using field world-ranking-file.",
      });
    }

    const rows = [];
    const rowErrors = [];
    let rowNumber = 1;

    Readable.from(req.file.buffer.toString("utf-8"))
      .pipe(csvParser())
      .on("data", (rawRow) => {
        rowNumber += 1;
        const row = mapInputRow(normalize(rawRow));

        if (!row.rank || !row.continent || !row.country || !row.destination) {
          rowErrors.push({
            rowNumber,
            reason: "Missing rank/continent/country/destination",
          });
          return;
        }

        rows.push(row);
      })
      .on("end", async () => {
        try {
          if (!rows.length) {
            return res.status(400).json({
              message: "No valid rows were found in CSV.",
              rowErrors,
            });
          }

          const operations = rows.map((row) => ({
            updateOne: {
              filter: { country: row.country, destination: row.destination },
              update: { $set: row },
              upsert: true,
            },
          }));

          const result = await WorldRankingState.bulkWrite(operations, {
            ordered: false,
          });

          return res.status(200).json({
            message: "CSV imported successfully.",
            processedRows: rows.length,
            rowErrors,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            upsertedCount: result.upsertedCount,
          });
        } catch (error) {
          return next(error);
        }
      });
  } catch (error) {
    next(error);
  }
};

export const importWorldRankingTsv = async (req, res, next) => {
  try {
    let tsv = null;

    if (typeof req.body === "string") {
      const bodyText = req.body.trim();
      if (bodyText.startsWith("{")) {
        try {
          const parsed = JSON.parse(bodyText);
          tsv = parsed?.tsv ?? parsed?.data ?? parsed?.payload ?? null;
        } catch (_error) {
          tsv = bodyText;
        }
      } else {
        tsv = bodyText;
      }
    } else if (req.body && typeof req.body === "object") {
      tsv = req.body.tsv ?? req.body.data ?? req.body.payload ?? null;
    }

    if (!tsv || typeof tsv !== "string") {
      return res.status(400).json({
        message:
          'Please send body as JSON { tsv: "...tab-separated excel data..." } OR raw text/plain body containing TSV data.',
        receivedBodyType: typeof req.body,
        receivedKeys:
          req.body && typeof req.body === "object" ? Object.keys(req.body) : [],
      });
    }

    const rawRows = parseTsv(tsv);
    if (!rawRows.length) {
      return res.status(400).json({ message: "No valid TSV rows found." });
    }

    const operations = rawRows
      .map((rawRow) => mapInputRow(rawRow))
      .filter(
        (row) => row.rank && row.continent && row.country && row.destination,
      )
      .map((row) => ({
        updateOne: {
          filter: { country: row.country, destination: row.destination },
          update: { $set: row },
          upsert: true,
        },
      }));

    if (!operations.length) {
      return res.status(400).json({
        message:
          "Rows were parsed but required columns are missing (Rank/Continent/Country/Destination).",
      });
    }

    const result = await WorldRankingState.bulkWrite(operations, {
      ordered: false,
    });

    return res.status(200).json({
      message: "TSV imported successfully.",
      processedRows: operations.length,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorldRankingWeights = async (_req, res) => {
  res.status(200).json({ weights: DEFAULT_WORLD_RANKING_WEIGHTS });
};
