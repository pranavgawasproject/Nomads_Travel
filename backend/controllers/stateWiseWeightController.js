import mongoose from "mongoose";
import StateWiseWeight from "../models/StateWiseWeight.js";
import VisaRule from "../models/VisaRule.js";
import { stateWiseWeightCalculation } from "../controllers/stateWiseWeightCalculation.js";
import {
  normalizeCountryKey,
  normalizeVisaRequirement,
} from "../controllers/visaRuleController.js";
import {
  deleteFileFromS3ByKey,
  // deleteFileFromS3ByUrl,
  uploadFileToS3,
} from "../config/s3Config.js";
import csvParser from "csv-parser";
import { Readable } from "stream";

// --- CSV MAPPING LOGIC ---

const CSV_TO_SCHEMA_MAP = {
  // Core Infra
  costofliving: "costOfLiving",
  internet: "internet",
  safety: "safety",
  nomadcommunity: "nomadCommunity",
  workinfrastructure: "workInfrastructure",
  qualityoflife: "qualityOfLife",
  visaflexibility: "visaFlexibility",
  visacost: "visaCost",
  visarenewalease: "visaRenewalEase",
  medicalinsuranceease: "medicalInsuranceEase",
  internalcommuting: "internalCommuting",
  lifestyleentertainment: "lifestyleEntertainment",
  climateenvironment: "climateEnvironment",
  accessibility: "accessibility",
  airqualityindex: "airQualityIndex",
  startupecosystemscore: "startupEcosystemScore",
  airportconnectivity: "airportConnectivity",
  directinternationalflights: "directInternationalFlights",

  // Financial
  lowertaxestaxfriendly: "taxFriendly", // Handles "Lower Taxes - Tax Friendly"
  purchasingpower: "purchasingPower",
  inflationstability: "inflationStability",
  startupsetupcost: "startupSetupCost",

  // Career / Startup
  venturecapitalpresence: "ventureCapital",
  localgovernmentsupport: "localGovernmentSupport",
  venturecapitalinvestments: "ventureCapitalInvestments",
  governmentstartupevents: "governmentStartupEvents",
  startupincubatorsaccelerators: "incubators",
  techtalentdensity: "techTalentDensity",
  conferencesevents: "conferences",
  remotejobavailability: "remoteJobs",

  // Lifestyle
  foundernomads: "founderNomads",
  meetupsevents: "meetupsEvents",
  solonomadtraveller: "soloNomad",
  familynomadtraveller: "familyNomads",
  girlnomadtraveller: "femaleNomads",
  couplenomadtravelletrs: "coupleNomads",
  partyeventsnomadtraveller: "partyLifestyle",
  naturenomadtravelling: "nature",
  adventurenomadtravelling: "adventure",
  nightlifepubs: "nightlife",
  yoga: "yoga",
  healthcarecostindex: "healthcareCostIndex",
};

// Updated to EXACTLY match the CSV headers you provided (ignoring the "Score ..." columns)
const CSV_TO_LABEL_MAP = {
  labelbestfornomads: "labelBestForNomads",
  labelmostaffordable: "labelMostAffordable",
  labelsafestcities: "labelSafestCities",
  labeleasyvisa: "labelEasyVisa",
  labelstrongnomadcommunity: "labelStrongNomadCommunity",
  labelhealthcarefriendly: "labelHealthcareFriendly",
  labelstartupbusinessopportunities: "labelStartupBusinessOpportunities",
  labelcleanairenvironment: "labelCleanAirEnvironment",
  labelbestworkinfrastructure: "labelBestWorkInfrastructure",
  labelbestforremoteworksetup: "labelBestForRemoteWorkSetup",
  labelcheapestplaces: "labelCheapestPlaces",
  labelbestconnectedcitiesflights: "labelBestConnectedCitiesFlights",

  labelstrongnomadcommunitywfa: "labelStrongNomadCommunityWfa",
  labelfastinternetcities: "labelFastInternetCities",
  labelbestworkinfrastructurewfa: "labelBestWorkInfrastructureWfa",
  labelmaximumsavings: "labelMaximumSavings",
  labellowtaxation: "labelLowTaxation",
  labelpurchasingpower: "labelPurchasingPower",
  labelfinancialstability: "labelFinancialStability",
  labelstartupsetupcost: "labelStartupSetupCost",
  labelbalancedfinanciallifestyle: "labelBalancedFinancialLifestyle",
  labelsocialpartylifestyle: "labelSocialPartyLifestyle",
  labelchillwellnesslifestyle: "labelChillWellnessLifestyle",
  labeladventureexploration: "labelAdventureExploration",
  labelnomadcommunitynetworking: "labelNomadCommunityNetworking",
  labelcouplefriendlylifestyle: "labelCoupleFriendlyLifestyle",
  labelfamilyfriendlylifestyle: "labelFamilyFriendlyLifestyle",
  labelfemalefriendlylifestyle: "labelFemaleFriendlyLifestyle",
  labelfoundernomads: "labelFounderNomads",
  labelsolonomads: "labelSoloNomads",
  labelstartupecosystems: "labelStartupEcosystems",
  labelremotejobopportunities: "labelRemoteJobOpportunities",
  labelfoundernomadsayc: "labelFounderNomadsAyc",
  labeltechtalentdensity: "labelTechTalentDensity",
  labelstartupincubatorsaccelerators: "labelStartupIncubatorsAccelerators",
  labelbalancedcareergrowth: "labelBalancedCareerGrowth",
  labelventurecapitalpresence: "labelVentureCapitalPresence",
  labelconferencesevents: "labelConferencesEvents",
};

// Normalizes raw CSV keys
const normalize = (row = {}) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      String(key || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[_-]/g, "")
        .replace(/&/g, "")
        .replace(/[()]/g, "") // Added to handle "(flights)"
        .replace(/\//g, ""), // Added to handle "Startup / Business"
      typeof value === "string" ? value.trim() : value,
    ]),
  );

// Converts CSV values to numbers
const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  !(typeof value === "string" && value.trim() === "");

const toNumberOrUndefined = (value) => {
  if (!hasValue(value)) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const normalizeOptionalString = (value) => {
  if (!hasValue(value)) return undefined;
  return String(value).trim();
};

const buildImageSlotKey = (stateName = "", index = 0) => {
  const normalizedState =
    String(stateName || "state")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 12) || "STATE";
  return `${normalizedState}_img${String(index + 1).padStart(2, "0")}`;
};

const buildImagesMapFromUrls = (urls = [], stateName = "") =>
  (Array.isArray(urls) ? urls : []).reduce((acc, url, index) => {
    const cleanedUrl = String(url || "").trim();
    if (!cleanedUrl) return acc;
    acc[buildImageSlotKey(stateName, index)] = { url: cleanedUrl, s3Key: "" };
    return acc;
  }, {});

const normalizeImagesPayload = (images) => {
  if (!images) return {};
  if (images instanceof Map) return Object.fromEntries(images);
  if (Array.isArray(images)) {
    const normalizedUrls = images
      .map((entry) => {
        if (typeof entry === "string") return entry;
        if (entry && typeof entry === "object")
          return entry.url || entry.imageUrl || "";
        return "";
      })
      .filter(Boolean);
    return buildImagesMapFromUrls(normalizedUrls);
  }
  if (typeof images !== "object") return {};

  return Object.fromEntries(
    Object.entries(images).map(([slotKey, value]) => {
      if (typeof value === "string") {
        return [slotKey, { url: value, s3Key: "" }];
      }
      return [
        slotKey,
        {
          url: String(value?.url || "").trim(),
          s3Key: String(value?.s3Key || "").trim(),
        },
      ];
    }),
  );
};

const mapImagesForResponse = (images = {}) => {
  const plainImages = normalizeImagesPayload(images);
  const imageUrls = Object.values(plainImages)
    .map((img) => img?.url)
    .filter(Boolean);
  return { images: plainImages, imageUrls };
};

const getLegacyImageUrls = (item = {}) => {
  if (Array.isArray(item.imageUrls)) return item.imageUrls.filter(Boolean);
  if (Array.isArray(item.imageUrl)) return item.imageUrl.filter(Boolean);
  if (typeof item.imageUrl === "string" && item.imageUrl.trim())
    return [item.imageUrl.trim()];
  if (typeof item.imagelink === "string" && item.imagelink.trim())
    return [item.imagelink.trim()];
  return [];
};

const mapCsvRowToStateWiseWeight = (rawRow = {}) => {
  const row = normalize(rawRow);

  const continent = row["continent"];
  const country = row["country"];
  const state = row["destination"];
  const title = normalizeOptionalString(row["title"]);

  // Handle rank - safely grab the first number column
  const rank = toNumber(row["rank"]);

  // Handle Status -> isActive boolean
  const isActive = row["status"]
    ? row["status"].toLowerCase() === "active"
    : true;

  const weight = {};

  // Build the nested weight object from the mapping table.
  for (const [csvKey, schemaKey] of Object.entries(CSV_TO_SCHEMA_MAP)) {
    weight[schemaKey] = toNumber(row[csvKey]);
  }

  const labels = {};
  for (const [csvKey, schemaKey] of Object.entries(CSV_TO_LABEL_MAP)) {
    labels[schemaKey] = row[csvKey] || ""; // Default to empty string to prevent undefined
  }

  return {
    continent,
    country,
    state,
    title,
    rank,
    weight,
    labels,
    isActive,
    raw: row,
  };
};

const buildSelectiveUpdateData = (row = {}) => {
  const updateData = {};
  const raw = row.raw || {};

  if (hasValue(raw["continent"])) updateData.continent = row.continent;
  if (hasValue(raw["country"])) updateData.country = row.country;
  if (hasValue(raw["destination"])) updateData.state = row.state;
  if (hasValue(raw["title"])) updateData.title = row.title;

  if (hasValue(raw["rank"])) {
    const parsedRank = toNumberOrUndefined(raw["rank"]);
    if (parsedRank !== undefined) updateData.rank = parsedRank;
  }

  if (hasValue(raw["status"])) {
    updateData.isActive = row.isActive;
  }

  const weightUpdates = {};
  for (const [csvKey, schemaKey] of Object.entries(CSV_TO_SCHEMA_MAP)) {
    if (!hasValue(raw[csvKey])) continue;
    const parsedValue = toNumberOrUndefined(raw[csvKey]);
    if (parsedValue !== undefined) {
      weightUpdates[`weight.${schemaKey}`] = parsedValue;
    }
  }

  const labelUpdates = {};
  for (const [csvKey, schemaKey] of Object.entries(CSV_TO_LABEL_MAP)) {
    if (!hasValue(raw[csvKey])) continue;
    labelUpdates[`labels.${schemaKey}`] = row.labels[schemaKey];
  }

  return {
    updateData: {
      ...updateData,
      ...weightUpdates,
      ...labelUpdates,
    },
    insertOnlyData: {},
  };
};

// --- CONTROLLERS ---

export const getStateWiseWeight = async (req, res, next) => {
  try {
    const {
      selectionType,
      continent,
      attribute = "bestForNomads",
      visaRequirement = "Show All",
      passportCountry = "India",
    } = req.body;

    let query = {};
    const normalizedVisaRequirement = normalizeVisaRequirement(visaRequirement);
    let visaRuleByDestination = new Map();
    let allowedDestinationKeys = null;

    // 1. Resolve effective attribute based on selectionType
    let effectiveAttribute = attribute;
    if (selectionType === "Work From Anywhere") {
      if (attribute === "strongNomadCommunity")
        effectiveAttribute = "strongNomadCommunityWFA";
      if (attribute === "bestWorkInfrastructure")
        effectiveAttribute = "bestWorkInfrastructureWFA";
    }

    // 2. Filter by continent if provided and not "World"
    if (continent && continent.toLowerCase() !== "world") {
      query.continent = { $regex: new RegExp(`^${continent}$`, "i") };
    }

    if (normalizedVisaRequirement) {
      const normalizedPassportCountry = normalizeCountryKey(passportCountry);
      const visaRules = (
        await VisaRule.find({
          requirement: normalizedVisaRequirement,
        }).lean()
      ).filter(
        (rule) =>
          (rule.normalizedPassport || normalizeCountryKey(rule.passport)) ===
          normalizedPassportCountry,
      );

      visaRuleByDestination = new Map(
        visaRules.map((rule) => [
          rule.normalizedDestination || normalizeCountryKey(rule.destination),
          rule,
        ]),
      );
      allowedDestinationKeys = new Set(visaRuleByDestination.keys());
    }

    // 3. Fetch state weights based on query
    const stateWeights = await StateWiseWeight.find(query).lean();

    // 4. Calculate scores for each state and pick the requested attribute
    const results = stateWeights.flatMap((item) => {
      const destinationCountryKey = normalizeCountryKey(item.country);

      if (
        allowedDestinationKeys &&
        !allowedDestinationKeys.has(destinationCountryKey)
      ) {
        return [];
      }

      const visaRule = visaRuleByDestination.get(destinationCountryKey);
      const allScores = stateWiseWeightCalculation(item.weight);
      const scoreForSorting = allScores[effectiveAttribute] || 0;
      const imagePayload = mapImagesForResponse(item.images);
      const fallbackImageUrls = getLegacyImageUrls(item);
      const resolvedImageUrls = imagePayload.imageUrls.length
        ? imagePayload.imageUrls
        : fallbackImageUrls;
      const resolvedImages = imagePayload.imageUrls.length
        ? imagePayload.images
        : buildImagesMapFromUrls(resolvedImageUrls, item.state);

      const resolvedImageUrl =
        resolvedImageUrls.length > 0
          ? resolvedImageUrls[
              Math.floor(Math.random() * resolvedImageUrls.length)
            ]
          : "";

      return [
        {
          _id: item._id,
          state: item.state,
          title: item.title,
          country: item.country,
          isActive: item.isActive,
          weight: item.weight,
          allScores,
          [effectiveAttribute]: scoreForSorting,
          imageUrl: resolvedImageUrl,
          imageUrls: resolvedImageUrls,
          images: resolvedImages,
          labels: item.labels,
          visa: visaRule
            ? {
                passport: visaRule.passport,
                destination: visaRule.destination,
                requirement: visaRule.requirement,
                durationDays: visaRule.durationDays,
              }
            : null,
        },
      ];
    });

    // 5. Sort by the requested attribute score in descending order
    results.sort((a, b) => b[effectiveAttribute] - a[effectiveAttribute]);

    res.status(200).json({
      success: true,
      count: results.length,
      selectedAttribute: attribute,
      selectedVisaRequirement: normalizedVisaRequirement || "show all",
      passportCountry,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStateWiseWeight = async (req, res, next) => {
  try {
    const stateWiseWeight = await StateWiseWeight.find();

    const dataWithScores = stateWiseWeight.map((item) => {
      const plainItem = item.toObject();
      const imagePayload = mapImagesForResponse(plainItem.images);
      const fallbackImageUrls = getLegacyImageUrls(plainItem);
      const resolvedImageUrls = imagePayload.imageUrls.length
        ? imagePayload.imageUrls
        : fallbackImageUrls;
      const resolvedImageUrl =
        resolvedImageUrls.length > 0
          ? resolvedImageUrls[
              Math.floor(Math.random() * resolvedImageUrls.length)
            ]
          : "";

      plainItem.calculatedScores = stateWiseWeightCalculation(plainItem.weight);
      plainItem.imageUrl = resolvedImageUrl;
      plainItem.imageUrls = resolvedImageUrls;
      plainItem.images = imagePayload.imageUrls.length
        ? imagePayload.images
        : buildImagesMapFromUrls(resolvedImageUrls, plainItem.state);
      return plainItem;
    });

    res.status(200).json({
      success: true,
      count: dataWithScores.length,
      data: dataWithScores,
    });
  } catch (error) {
    next(error);
  }
};

export const createStateWiseWeight = async (req, res, next) => {
  try {
    const createPayload = { ...req.body };
    createPayload.title = normalizeOptionalString(createPayload.title);

    // Parse weight if it's a string (FormData)
    if (typeof createPayload.weight === "string") {
      try {
        createPayload.weight = JSON.parse(createPayload.weight);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for weight field.",
        });
      }
    }

    // Parse labels if it's a string (FormData)
    if (typeof createPayload.labels === "string") {
      try {
        createPayload.labels = JSON.parse(createPayload.labels);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for labels field.",
        });
      }
    }

    if (typeof createPayload.images === "string") {
      try {
        createPayload.images = JSON.parse(createPayload.images);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for images field.",
        });
      }
    }
    if (typeof createPayload.imageUrls === "string") {
      try {
        createPayload.imageUrls = JSON.parse(createPayload.imageUrls);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for imageUrls field.",
        });
      }
    }
    if (Array.isArray(createPayload.imageUrls)) {
      createPayload.images = buildImagesMapFromUrls(
        createPayload.imageUrls,
        createPayload.state,
      );
    } else if (
      typeof createPayload.imageUrl === "string" &&
      createPayload.imageUrl.trim()
    ) {
      createPayload.images = buildImagesMapFromUrls(
        [createPayload.imageUrl.trim()],
        createPayload.state,
      );
    } else {
      createPayload.images = normalizeImagesPayload(createPayload.images);
    }

    if (Object.keys(createPayload.images || {}).length > 5) {
      return res
        .status(400)
        .json({ success: false, message: "A maximum of 5 images is allowed." });
    }

    // Generate a new ID for the document so we can use it in the S3 path
    const newId = new mongoose.Types.ObjectId();
    createPayload._id = newId;

    if (Array.isArray(req.files) && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({
          success: false,
          message: "A maximum of 5 images is allowed.",
        });
      }
      const uploadedImages = await Promise.all(
        req.files.map(async (file, index) => {
          const fileName = String(file.originalname || `image-${index + 1}`)
            .replace(/[/\\?%*:|"<>]/g, "_")
            .replace(/\s+/g, "_");
          const fileKey = `nomads/states/${createPayload.country}/${createPayload.state}/${newId}/${Date.now()}-${index}-${fileName}`;
          return uploadFileToS3(fileKey, file);
        }),
      );
      createPayload.images = uploadedImages.reduce((acc, img, index) => {
        const slotKey = buildImageSlotKey(createPayload.state, index);
        acc[slotKey] = { url: img.url, s3Key: img.id };
        return acc;
      }, {});
    }

    const newStateWiseWeight = await StateWiseWeight.create(createPayload);

    return res.status(201).json({
      success: true,
      message: "State-wise weight data created successfully.",
      data: newStateWiseWeight,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateStateWiseWeight = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "State-wise weight id is required." });
    }

    const existingStateWiseWeight = await StateWiseWeight.findById(id);
    if (!existingStateWiseWeight) {
      return res
        .status(404)
        .json({ success: false, message: "State-wise weight data not found." });
    }

    const updatePayload = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(updatePayload, "title")) {
      updatePayload.title = normalizeOptionalString(updatePayload.title);
    }

    // Standard parsers for FormData fields
    if (typeof updatePayload.weight === "string") {
      try {
        updatePayload.weight = JSON.parse(updatePayload.weight);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for weight field.",
        });
      }
    }
    if (typeof updatePayload.labels === "string") {
      try {
        updatePayload.labels = JSON.parse(updatePayload.labels);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for labels field.",
        });
      }
    }
    if (typeof updatePayload.images === "string") {
      try {
        updatePayload.images = JSON.parse(updatePayload.images);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for images field.",
        });
      }
    }
    if (typeof updatePayload.imageUrls === "string") {
      try {
        updatePayload.imageUrls = JSON.parse(updatePayload.imageUrls);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format for imageUrls field.",
        });
      }
    }

    // 1. Determine the "base" images map from the payload
    let resolvedImages = {};
    if (Array.isArray(updatePayload.imageUrls)) {
      resolvedImages = buildImagesMapFromUrls(
        updatePayload.imageUrls,
        updatePayload.state || existingStateWiseWeight.state,
      );
    } else if (
      typeof updatePayload.imageUrl === "string" &&
      updatePayload.imageUrl.trim()
    ) {
      resolvedImages = buildImagesMapFromUrls(
        [updatePayload.imageUrl.trim()],
        updatePayload.state || existingStateWiseWeight.state,
      );
    } else if (updatePayload.images) {
      resolvedImages = normalizeImagesPayload(updatePayload.images);
    } else {
      // If images field is missing from payload, we assume it's NOT being updated.
      // But if it is an empty object/array, we assume they want to clear it.
      resolvedImages = normalizeImagesPayload(existingStateWiseWeight.images);
    }

    // 2. Preserve existing S3 keys if the URL matches (crucial for deletion logic)
    const existingImagesMap = normalizeImagesPayload(
      existingStateWiseWeight.images,
    );
    const existingImagesList = Object.values(existingImagesMap);

    Object.keys(resolvedImages).forEach((slotKey) => {
      const img = resolvedImages[slotKey];
      if (!img.s3Key || img.s3Key === "") {
        const match = existingImagesList.find((e) => e.url === img.url);
        if (match) {
          img.s3Key = match.s3Key;
        }
      }
    });

    // 3. Handle physical file uploads
    if (Array.isArray(req.files) && req.files.length > 0) {
      if (Object.keys(resolvedImages).length + req.files.length > 5) {
        return res.status(400).json({
          success: false,
          message: "A maximum of 5 images is allowed.",
        });
      }

      // Upload new files
      const uploadedImages = await Promise.all(
        req.files.map(async (file, index) => {
          const fileName = String(file.originalname || `image-${index + 1}`)
            .replace(/[/\\?%*:|"<>]/g, "_")
            .replace(/\s+/g, "_");
          const fileKey = `nomads/states/${updatePayload.country || existingStateWiseWeight.country}/${updatePayload.state || existingStateWiseWeight.state}/${id}/${Date.now()}-${index}-${fileName}`;
          return uploadFileToS3(fileKey, file);
        }),
      );

      const stateForSlots =
        updatePayload.state || existingStateWiseWeight.state;
      const usedSlotKeys = new Set(Object.keys(resolvedImages));
      let nextSlotIndex = 0;

      uploadedImages.forEach((img) => {
        while (
          usedSlotKeys.has(buildImageSlotKey(stateForSlots, nextSlotIndex))
        ) {
          nextSlotIndex += 1;
        }

        const slotKey = buildImageSlotKey(stateForSlots, nextSlotIndex);
        resolvedImages[slotKey] = { url: img.url, s3Key: img.id };
        usedSlotKeys.add(slotKey);
        nextSlotIndex += 1;
      });
    }

    // 4. Identify and delete removed images from S3
    const newS3Keys = Object.values(resolvedImages)
      .map((img) => img.s3Key)
      .filter(Boolean);

    for (const oldImg of Object.values(existingImagesMap)) {
      if (oldImg.s3Key && !newS3Keys.includes(oldImg.s3Key)) {
        await deleteFileFromS3ByKey(oldImg.s3Key);
      }
    }

    // 5. Finalize payload and update
    if (Object.keys(resolvedImages).length > 5) {
      return res
        .status(400)
        .json({ success: false, message: "A maximum of 5 images is allowed." });
    }

    updatePayload.images = resolvedImages;

    const updatedStateWiseWeight = await StateWiseWeight.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "State-wise weight data updated successfully.",
      data: updatedStateWiseWeight,
    });
  } catch (error) {
    return next(error);
  }
};

export const bulkInsertStateWiseWeightCsv = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a CSV file using field state-wise-weight-file.",
      });
    }

    const rows = [];
    const rowErrors = [];
    let rowNumber = 1;

    Readable.from(req.file.buffer.toString("utf-8"))
      .pipe(csvParser())
      .on("data", (rawRow) => {
        rowNumber += 1;
        const row = mapCsvRowToStateWiseWeight(rawRow);

        if (!row.country || !row.state) {
          rowErrors.push({
            rowNumber,
            reason: "Missing required fields: country/state",
          });
          return;
        }

        rows.push({ ...row, rowNumber });
      })
      .on("end", async () => {
        try {
          if (!rows.length) {
            return res
              .status(400)
              .json({ message: "No valid rows were found in CSV.", rowErrors });
          }

          const operations = rows.flatMap((row) => {
            const { updateData, insertOnlyData } =
              buildSelectiveUpdateData(row);

            if (
              Object.keys(updateData).length === 0 &&
              Object.keys(insertOnlyData).length === 0
            ) {
              rowErrors.push({
                rowNumber: row.rowNumber,
                reason: "No updatable fields found in this row.",
              });
              return [];
            }

            return [
              {
                updateOne: {
                  filter: { country: row.country, state: row.state },
                  update: {
                    ...(Object.keys(updateData).length > 0
                      ? { $set: updateData }
                      : {}),
                    ...(Object.keys(insertOnlyData).length > 0
                      ? { $setOnInsert: insertOnlyData }
                      : {}),
                  },
                  upsert: true,
                },
              },
            ];
          });

          if (!operations.length) {
            return res.status(400).json({
              message: "No valid update operations were generated from CSV.",
              rowErrors,
            });
          }

          const result = await StateWiseWeight.bulkWrite(operations, {
            ordered: false,
          });

          return res.status(200).json({
            message: "State-wise weight CSV imported successfully.",
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
