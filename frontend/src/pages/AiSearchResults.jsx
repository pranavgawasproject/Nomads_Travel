import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  HiOutlineChevronDown,
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";
import { AiFillHeart, AiTwotoneHeart } from "react-icons/ai";
import { FaCheck, FaSyncAlt } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { aiDestinationCards } from "../constants/aiDestinationCards";
import { persistSelectedDestination } from "../utils/selectedDestinationSession";

import axios from "../utils/axios";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showErrorAlert } from "../utils/alerts";

import {
  defaultGoal,
  // getGoalOptionMetricLabel,
  goalFilterMap,
} from "../constants/aiGoalFilters";

const continentOptions = [
  "Explore The World",
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

const visaRequirementOptions = [
  "Show All",
  "Physical Visa",
  "e-Visa",
  "Visa on Arrival",
  "Visa Free",
];

const visaRequirementApiValueMap = {
  "Physical Visa": "visa required",
  "e-Visa": "e-visa",
  "Visa on Arrival": "visa on arrival",
  "Visa Free": "visa free",
};

const getVisaRequirementApiValue = (value) =>
  visaRequirementApiValueMap[value] || value;

const formatVisaRequirementLabel = (value) => {
  if (!value) return "Visa";

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "e-visa") {
    return "e-Visa";
  }

  return `${normalizedValue.charAt(0).toUpperCase()}${normalizedValue.slice(1)}`;
};

const DEFAULT_PASSPORT_COUNTRY = "India";

const destinationCards = aiDestinationCards;
const getDestinationFavoriteKey = (destination) =>
  destination?._id || `${destination.city}-${destination.country}`;

const goalOptionToApiAttributeMap = {
  "Best for Explorers": "bestForExplorers",
  "Most Affordable": "mostAffordable",
  "Safest Cities": "safestCities",
  "Easy Visa / Long Stay": "easyVisaLongStay",
  "Strong Explorer Community": "strongNomadCommunity",
  "Healthcare Friendly": "healthcareFriendly",
  "Startup / Business Opportunities": "startupBusinessOpportunities",
  "Clean Air / Environment": "cleanAirEnvironment",
  "Best for Remote Work Setup": "bestForRemoteWorkSetup",
  "Cheapest Places": "cheapestPlaces",
  "Best Connected Cities (Flights)": "bestConnectedCitiesFlights",
  "Fast Internet Cities": "fastInternetCities",
  "Best Work Infrastructure": "bestWorkInfrastructure",
  "Maximum Savings": "maximumSavings",
  "Low Taxation": "lowTaxation",
  "Purchasing Power": "purchasingPower",
  "Financial Stability(Low Risk)": "financialStabilityLowRisk",
  "Startup Setup Cost": "startupSetupCost",
  "Balanced Financial Lifestyle": "balancedFinancialLifestyle",
  "Startup Ecosystems": "startupEcosystems",
  "Remote Job Opportunities": "remoteJobOpportunities",
  "Founder Explorers": "founderExplorers",
  "Tech Talent Density": "techTalentDensity",
  "Startup Funding & Support": "startupIncubatorsAccelerators",
  "Balanced Career Growth": "balancedCareerGrowth",
  "Venture Capital Presence": "ventureCapitalPresence",
  "Conferences & Events": "conferencesEvents",
  "Social & Party Lifestyle": "socialPartyLifestyle",
  "Chill & Wellness Lifestyle": "chillWellnessLifestyle",
  "Adventure & Exploration": "adventureExploration",
  "Explorer Community & Networking": "nomadCommunityNetworking",
  "Couple - Friendly Lifestyle": "coupleFriendlyLifestyle",
  "Family - Friendly Lifestyle": "familyFriendlyLifestyle",
  "Female - Friendly Lifestyle": "femaleFriendlyLifestyle",
  "Solo Explorers": "soloExplorers",
};

const leftBadgeFieldByGoalOption = {
  "Fast Internet Cities": "internetSpeed",
  "Clean Air / Environment": "aqiValue",
  "Low Taxation": "roamiqTax",
  "Cheapest Places": "costOfLivingPerMonth",
};

const leftBadgeLabelFieldByGoalOption = {
  "Easy Visa / Long Stay": "labelEasyVisa",
  "Best for Remote Work Setup": "labelBestWorkInfrastructureWfa",
  "Financial Stability (Low Risk)": "labelFinancialStability",
};

const toLabelFieldKey = (apiAttribute = "") =>
  apiAttribute
    ? `label${apiAttribute.charAt(0).toUpperCase()}${apiAttribute.slice(1)}`
    : "";

const formatLeftBadgeValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return `${value}`;
    }

    return `${Number(value.toFixed(2))}`;
  }

  return `${value}`;
};

const SCORE_RANGE_MAX = 10;
const SCORE_RANGE_MIN_DEFAULT = 0;

const getScoreRangeMin = () => {
  const configuredMin = Number(import.meta.env.VITE_AI_SCORE_RANGE_MIN);

  if (Number.isFinite(configuredMin)) {
    return Math.min(SCORE_RANGE_MAX, Math.max(0, configuredMin));
  }

  return SCORE_RANGE_MIN_DEFAULT;
};

const getScoreFillPercentage = (score) => {
  const min = getScoreRangeMin();
  const normalizedScore = Number(score);

  if (!Number.isFinite(normalizedScore)) {
    return 0;
  }

  const clampedScore = Math.max(
    min,
    Math.min(SCORE_RANGE_MAX, normalizedScore),
  );
  const denominator = SCORE_RANGE_MAX - min;

  if (denominator <= 0) {
    return 100;
  }

  return ((clampedScore - min) / denominator) * 100;
};

const quickStatsConfigByGoalOption = {
  "Best for Explorers": [
    { label: "Work Infra", weightKey: "workInfrastructure" },
    { label: "Internet", weightKey: "internet" },
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Community", weightKey: "nomadCommunity" },
  ],
  "Most Affordable": [
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Purchasing Power", weightKey: "purchasingPower" },
    { label: "Heathcare Cost", weightKey: "healthcareCostIndex" },
    { label: "Visa Cost", weightKey: "inflationStability" },
  ],
  "Safest Cities": [
    { label: "Safety", weightKey: "safety" },
    { label: "Livability", weightKey: "qualityOfLife" },
    { label: "Heathcare Cost", weightKey: "healthcareCostIndex" },
    { label: "Air Quality", weightKey: "airQualityIndex" },
  ],
  "Easy Visa / Long Stay": [
    { label: "Visa-Friendly", weightKey: "visaFlexibility" },
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Safety", weightKey: "safety" },
    { label: "Livability", weightKey: "qualityOfLife" },
  ],
  "Strong Explorer Community": [
    { label: "Community", weightKey: "nomadCommunity" },
    { label: "Meetups & Events", weightKey: "meetupsEvents" },
    { label: "Lifestyle & Entertainment", weightKey: "lifestyleEntertainment" },
    { label: "Safety", weightKey: "safety" },
  ],
  "Healthcare Friendly": [
    { label: "Livability", weightKey: "qualityOfLife" },
    { label: "Healthcare Cost", weightKey: "healthcareCostIndex" },
    { label: "Safety", weightKey: "safety" },
    { label: "Air Quality", weightKey: "airQualityIndex" },
  ],
  "Startup / Business Opportunities": [
    { label: "Startup Ecosystem", weightKey: "startupEcosystemScore" },
    { label: "Tech Talent", weightKey: "techTalentDensity" },
    { label: "Work Infra", weightKey: "workInfrastructure" },
    { label: "Startup Support", weightKey: "incubators" },
  ],
  "Clean Air / Environment": [
    { label: "Safety", weightKey: "safety" },
    { label: "Livability", weightKey: "qualityOfLife" },
    { label: "Heathcare Cost", weightKey: "healthcareCostIndex" },
    { label: "Air Quality", weightKey: "airQualityIndex" },
  ],
  "Best Work Infrastructure": [
    { label: "Work Infra", weightKey: "workInfrastructure" },
    { label: "Internet", weightKey: "internet" },
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Community", weightKey: "nomadCommunity" },
  ],
  "Best for Remote Work Setup": [
    { label: "Internet", weightKey: "internet" },
    { label: "Work Infra", weightKey: "workInfrastructure" },
    { label: "Community", weightKey: "nomadCommunity" },
    { label: "Affordability", weightKey: "costOfLiving" },
  ],
  "Cheapest Places": [
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Internet", weightKey: "internet" },
    { label: "Work Infra", weightKey: "workInfrastructure" },
    { label: "Community", weightKey: "nomadCommunity" },
  ],
  "Best Connected Cities (Flights)": [
    { label: "Direct Flights", weightKey: "directInternationalFlights" },
    { label: "Connectivity", weightKey: "airportConnectivity" },
    { label: "Work Infra", weightKey: "workInfrastructure" },
    { label: "Community", weightKey: "nomadCommunity" },
  ],
  "Fast Internet Cities": [
    { label: "Internet", weightKey: "internet" },
    { label: "Work Infra", weightKey: "workInfrastructure" },
    { label: "Community", weightKey: "nomadCommunity" },
    { label: "Affordability", weightKey: "costOfLiving" },
  ],
  "Maximum Savings": [
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Tax Friendly", weightKey: "taxFriendly" },
    { label: "Purchasing Power", weightKey: "purchasingPower" },
    { label: "Visa Cost", weightKey: "inflationStability" },
  ],
  "Low Taxation": [
    { label: "Tax Friendly", weightKey: "taxFriendly" },
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Purchasing Power", weightKey: "purchasingPower" },
    { label: "Visa Cost", weightKey: "inflationStability" },
  ],
  "Purchasing Power": [
    { label: "Purchasing Power", weightKey: "purchasingPower" },
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Tax Friendly", weightKey: "taxFriendly" },
    { label: "Visa Cost", weightKey: "inflationStability" },
  ],
  "Financial Stability(Low Risk)": [
    { label: "Visa Cost", weightKey: "inflationStability" },
    { label: "Heathcare Cost", weightKey: "healthcareCostIndex" },
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Tax Friendly", weightKey: "taxFriendly" },
  ],
  "Startup Setup Cost": [
    { label: "Startup Costs", weightKey: "startupSetupCost" },
    { label: "Tax Friendly", weightKey: "taxFriendly" },
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Work Infra", weightKey: "workInfrastructure" },
  ],
  "Balanced Financial Lifestyle": [
    { label: "Affordability", weightKey: "costOfLiving" },
    { label: "Purchasing Power", weightKey: "purchasingPower" },
    { label: "Tax Friendly", weightKey: "taxFriendly" },
    { label: "Startup Costs", weightKey: "startupSetupCost" },
  ],
  "Social & Party Lifestyle": [
    { label: "Social Scene", weightKey: "partyLifestyle" },
    { label: "Nightlife", weightKey: "nightlife" },
    { label: "Lifestyle & Entertainment", weightKey: "lifestyleEntertainment" },
    { label: "Community", weightKey: "nomadCommunity" },
  ],
  "Chill & Wellness Lifestyle": [
    { label: "Environment", weightKey: "climateEnvironment" },
    { label: "Nature", weightKey: "nature" },
    { label: "Wellness", weightKey: "yoga" },
    { label: "Community", weightKey: "nomadCommunity" },
  ],
  "Adventure & Exploration": [
    { label: "Adventure", weightKey: "adventure" },
    { label: "Nature", weightKey: "nature" },
    { label: "Environment", weightKey: "climateEnvironment" },
    { label: "Community", weightKey: "nomadCommunity" },
  ],
  "Explorer Community & Networking": [
    { label: "Community", weightKey: "nomadCommunity" },
    { label: "Meetups & Events", weightKey: "meetupsEvents" },
    { label: "Founder Explorers", weightKey: "founderExplorers" },
    { label: "Conferences", weightKey: "conferences" },
  ],
  "Couple - Friendly Lifestyle": [
    { label: "Couple-Friendly", weightKey: "coupleExplorers" },
    { label: "Community", weightKey: "nomadCommunity" },
    { label: "Lifestyle & Entertainment", weightKey: "lifestyleEntertainment" },
    { label: "Safety", weightKey: "safety" },
  ],
  "Family - Friendly Lifestyle": [
    { label: "Family-Friendly", weightKey: "familyExplorers" },
    { label: "Safety", weightKey: "safety" },
    { label: "Community", weightKey: "nomadCommunity" },
    { label: "Lifestyle & Entertainment", weightKey: "lifestyleEntertainment" },
  ],
  "Female - Friendly Lifestyle": [
    { label: "Female-Friendly", weightKey: "femaleExplorers" },
    { label: "Safety", weightKey: "safety" },
    { label: "Community", weightKey: "nomadCommunity" },
    { label: "Travel Ease", weightKey: "accessibility" },
  ],
  "Founder Explorers": [
    { label: "Founder Explorers", weightKey: "founderExplorers" },
    { label: "Startup Ecosystem", weightKey: "startupEcosystemScore" },
    { label: "Venture Capital", weightKey: "ventureCapital" },
    { label: "Community", weightKey: "nomadCommunity" },
  ],
  "Solo Explorers": [
    { label: "Social Scene", weightKey: "partyLifestyle" },
    { label: "Community", weightKey: "nomadCommunity" },
    { label: "Lifestyle & Entertainment", weightKey: "lifestyleEntertainment" },
    { label: "Safety", weightKey: "safety" },
  ],
  "Startup Ecosystems": [
    { label: "Startup Ecosystem", weightKey: "startupEcosystemScore" },
    { label: "Venture Capital", weightKey: "ventureCapital" },
    { label: "Startup Support", weightKey: "incubators" },
    { label: "Tech Talent", weightKey: "techTalentDensity" },
  ],
  "Remote Job Opportunities": [
    { label: "Remote Jobs", weightKey: "remoteJobs" },
    { label: "Community", weightKey: "nomadCommunity" },
    { label: "Work Infra", weightKey: "workInfrastructure" },
    { label: "Startup Ecosystem", weightKey: "startupEcosystemScore" },
  ],
  "Tech Talent Density": [
    { label: "Tech Talent", weightKey: "techTalentDensity" },
    { label: "Startup Ecosystem", weightKey: "startupEcosystemScore" },
    { label: "Founder Explorers", weightKey: "founderExplorers" },
    { label: "Venture Capital", weightKey: "ventureCapital" },
  ],
  "Startup Funding & Support": [
    { label: "Startup Support", weightKey: "incubators" },
    { label: "Startup Ecosystem", weightKey: "startupEcosystemScore" },
    { label: "Founder Explorers", weightKey: "founderExplorers" },
    { label: "Venture Capital", weightKey: "ventureCapital" },
  ],
  "Balanced Career Growth": [
    { label: "Remote Jobs", weightKey: "remoteJobs" },
    { label: "Work Infra", weightKey: "workInfrastructure" },
    { label: "Startup Ecosystem", weightKey: "startupEcosystemScore" },
    { label: "Tech Talent", weightKey: "techTalentDensity" },
  ],
  "Venture Capital Presence": [
    { label: "Venture Capital", weightKey: "ventureCapital" },
    { label: "Startup Ecosystem", weightKey: "startupEcosystemScore" },
    { label: "Startup Support", weightKey: "incubators" },
    { label: "Tech Talent", weightKey: "techTalentDensity" },
  ],
  "Conferences & Events": [
    { label: "Conferences", weightKey: "conferences" },
    { label: "Founder Explorers", weightKey: "founderExplorers" },
    { label: "Startup Ecosystem", weightKey: "startupEcosystemScore" },
    { label: "Community", weightKey: "nomadCommunity" },
  ],
};

const fallbackQuickStatsConfig = [
  { label: "Internet", labelKey: "labelInternetSpeed", field: "internetSpeed" },
  {
    label: "Cost",
    labelKey: "labelCostOfLivingPerMonth",
    field: "costOfLivingPerMonth",
  },
  { label: "AQI", labelKey: "labelAqiValue", field: "aqiValue" },
  { label: "Score", field: "suggestions" },
];

const labelToAllScoresKeyMap = {
  labelCostOfLivingPerMonth: "cheapestPlaces",
  labelBestWorkInfrastructureWfa: "bestWorkInfrastructureWFA",
  labelStrongNomadCommunityWfa: "strongNomadCommunityWFA",
  labelFinancialStability: "financialStabilityLowRisk",
};

const labelToWeightKeyMap = {
  labelCostOfLivingPerMonth: "costOfLiving",
  labelBestWorkInfrastructure: "workInfrastructure",
  labelBestWorkInfrastructureWfa: "workInfrastructure",
  labelFastInternetCities: "internet",
  labelStrongNomadCommunity: "nomadCommunity",
  labelStrongNomadCommunityWfa: "nomadCommunity",
  labelMostAffordable: "qualityOfLife",
  labelSafestCities: "safety",
  labelEasyVisa: "visaFlexibility",
  labelHealthcareFriendly: "healthcareCostIndex",
  labelStartupBusinessOpportunities: "startupEcosystemScore",
  labelCleanAirEnvironment: "airQualityIndex",
  labelBestConnectedCitiesFlights: "airportConnectivity",
  labelLowTaxation: "taxFriendly",
  labelPurchasingPower: "purchasingPower",
  labelFinancialStability: "inflationStability",
  labelStartupSetupCost: "startupSetupCost",
  labelBalancedFinancialLifestyle: "inflationStability",
  labelStartupEcosystems: "startupEcosystemScore",
  labelRemoteJobOpportunities: "remoteJobs",
  labelFounderExplorers: "founderExplorers",
  labelFounderExplorersAyc: "founderExplorers",
  labelTechTalentDensity: "techTalentDensity",
  labelStartupIncubatorsAccelerators: "incubators",
  labelBalancedCareerGrowth: "remoteJobs",
  labelVentureCapitalPresence: "ventureCapital",
  labelConferencesEvents: "conferences",
  labelSocialPartyLifestyle: "partyLifestyle",
  labelChillWellnessLifestyle: "yoga",
  labelAdventureExploration: "adventure",
  labelNomadCommunityNetworking: "meetupsEvents",
  labelCoupleFriendlyLifestyle: "coupleExplorers",
  labelFamilyFriendlyLifestyle: "familyExplorers",
  labelFemaleFriendlyLifestyle: "femaleExplorers",
};

const getQuickStatsForDestination = (
  destination,
  selectedGoal,
  selectedGoalOption,
) => {
  const statConfig =
    quickStatsConfigByGoalOption[selectedGoalOption] ||
    fallbackQuickStatsConfig;
  const selectedGoalScoreKey = getApiAttributeForSelection(
    selectedGoal,
    selectedGoalOption,
  );

  const configuredStats = statConfig.slice(0, 4).map((config) => {
    const scoreKeyFromLabel = config.labelKey
      ? labelToAllScoresKeyMap[config.labelKey] ||
        `${config.labelKey.charAt(5).toLowerCase()}${config.labelKey.slice(6)}`
      : null;
    const scoreKey = config.scoreKey || scoreKeyFromLabel || config.field;
    const weightKey =
      config.weightKey ||
      (config.labelKey ? labelToWeightKeyMap[config.labelKey] : null) ||
      scoreKey;
    const weights = destination?.weight || {};
    const directWeight = weightKey ? weights[weightKey] : undefined;
    const caseInsensitiveScore =
      directWeight === undefined && weightKey
        ? Object.entries(weights).find(
            ([key]) => key.toLowerCase() === weightKey.toLowerCase(),
          )?.[1]
        : undefined;

    const score = Number(
      directWeight !== undefined
        ? directWeight
        : caseInsensitiveScore !== undefined
          ? caseInsensitiveScore
          : selectedGoalScoreKey
            ? weights[selectedGoalScoreKey]
            : undefined,
    );

    return {
      label: config.label,
      score: Number.isFinite(score) ? score : null,
    };
  });

  return configuredStats;
};

const getScoreBarColorValue = (score) => {
  if (!Number.isFinite(score)) {
    return "rgba(255, 255, 255, 0.3)";
  }

  if (score < 5) {
    return "#ef4444";
  }

  if (score < 7.5) {
    return "#facc15";
  }

  return "#22c55e";
};

const destinationAliasMap = {
  "Ho Chi Minh City": "Ho Chi Minh City",
  Surigao: "Surigao del Norte",
  "Las Palmas": "Las Palmas",
  Florianopolis: "Santa Catarina",
  "Playa del Carmen": "Playa del Carmen",
  "Western Cape": "Western Cape",
  Queensland: "Gold Coast",
  Amsterdam: "Amsterdam",
  Tenerife: "Tenerife",
  Casablanca: "Casablanca",
  Cairo: "Cairo",
  Queenstown: "Otago Region",
  Giza: "Giza",
};

const normalizeDestinationKey = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

const normalizedCountryAliasMap = {
  usa: "unitedstates",
  unitedstatesofamerica: "unitedstates",
  uae: "unitedarabemirates",
  turkey: "turkiye",
  czechrepublic: "czechia",
  thebahamas: "bahamas",
  thegambia: "gambia",
  swaziland: "eswatini",
  ivorycoast: "cotedivoire",
  hongkong: "hongkongsarchina",
  macao: "macaosarchina",
  macau: "macaosarchina",
  saintkittsandnevis: "stkittsandnevis",
  saintlucia: "stlucia",
  saintvincentandthegrenadines: "stvincentandthegrenadines",
};

const normalizeCountryKey = (value = "") => {
  const normalized = normalizeDestinationKey(value).replace(/&/g, "and");
  return normalizedCountryAliasMap[normalized] || normalized;
};

const isVisaRequirementFilterActive = (value = "") =>
  value && value !== visaRequirementOptions[0];

const toApiAttribute = (goalOption = "") => {
  const normalizedGoalOption =
    typeof goalOption === "string" ? goalOption : `${goalOption || ""}`;

  if (goalOptionToApiAttributeMap[normalizedGoalOption]) {
    return goalOptionToApiAttributeMap[normalizedGoalOption];
  }

  const normalized = normalizedGoalOption
    .replace(/&/g, " ")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (!normalized.length) return "";

  return normalized
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`,
    )
    .join("");
};

const getApiAttributeForSelection = (selectedGoal, selectedGoalOption) => {
  if (
    selectedGoal === "Work From Anywhere" &&
    selectedGoalOption === "Best Work Infrastructure"
  ) {
    return "bestWorkInfrastructureWFA";
  }

  return toApiAttribute(selectedGoalOption);
};

const getLabelFieldKeyForSelection = (selectedGoal, selectedGoalOption) => {
  if (selectedGoalOption === "Best Work Infrastructure") {
    return selectedGoal === "Work From Anywhere"
      ? "labelBestWorkInfrastructureWfa"
      : "labelBestWorkInfrastructure";
  }

  return toLabelFieldKey(
    getApiAttributeForSelection(selectedGoal, selectedGoalOption),
  );
};

const INITIAL_VISIBLE_DESTINATIONS = 20;
const TYPING_INTERVAL_MS = 7;
const SELECTED_HEADING_TRANSITION_DELAY_MS = 1200;
const DESTINATION_REVEAL_INTERVAL_MS = 70;
const SEARCH_RESULTS_GOAL_STORAGE_KEY = "aiSearchResults.selectedGoal";
const SEARCH_RESULTS_SELECTION_SIGNATURE_STORAGE_KEY =
  "aiSearchResults.selectionSignature";

const PRIORITY_POINTS_VISIBLE_LIMIT = 4;
const ADDITIONAL_PRIORITY_POINTS_TEXT =
  "along with other aspects calculated by our proprietary algorithm.";

const addAdditionalPriorityPointsText = (narrative = "") => {
  let priorityPointsCount = 0;
  const visibleNarrativeLines = narrative.split("\n").filter((line) => {
    if (!line.trim().startsWith("•")) {
      return true;
    }

    priorityPointsCount += 1;
    return priorityPointsCount <= PRIORITY_POINTS_VISIBLE_LIMIT;
  });
  const endingLineIndex = visibleNarrativeLines.findIndex((line) =>
    line.trim().startsWith("→"),
  );

  if (endingLineIndex === -1) {
    return narrative;
  }

  visibleNarrativeLines.splice(
    endingLineIndex,
    0,
    ADDITIONAL_PRIORITY_POINTS_TEXT,
  );

  return visibleNarrativeLines.join("\n");
};

const goalNameBySlug = {
  worldranking: "World Ranking",
  workfromanywhere: "Work From Anywhere",
  increaseyoursavings: "Increase Your Savings",
  advanceyourcareer: "Advance Your Career",
  findyourcommunity: "Find Your Community",
};

const goalNarrativeTopHeadingMap = {
  "World Ranking":
    "Please find below the best curated results from the options you suggested to me based on world ranking index.",
  "Work From Anywhere":
    "Please find below the best curated results from the options you suggested to me to help you discover and work from the best explorer destinations.",
  "Increase Your Savings":
    "Please find below the best curated results from the options you suggested to me to help you increase your savings.",
  "Advance Your Career":
    "Please find below the best curated results from the options you suggested to me to help you advance your career.",
  "Find Your Community":
    "Please find below the best curated results from the options you suggested to me to help you discover your preferred community in explorer destinations.",
  "Search Old School":
    "Please find below the best curated results from the options you suggested to me to help you discover your preferred explorer destinations.",
};

const normalizeNarrativeKey = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const getNarrativeContinentLabel = (continent) =>
  continent === "World" ? "the World" : continent;

const normalizeSelectedContinent = (continent) =>
  continent === "Explore The World" ? "World" : continent;

const goalNarrativeByGoalAndAttribute = {
  [normalizeNarrativeKey("World Ranking")]: {
    [normalizeNarrativeKey("Best for Explorers")]:
      "Curated below are the top cities in X based on overall livability for modern remote professionals.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💰 Cost of living\n• 🏢 Work infrastructure\n• ⚡ High-speed, stable internet\n• 🤝 Explorer community\n• 🚀 Startup ecosystem\n• 🛡️ Safety\n• 🛂 Visa flexibility for longer stays\n\n→ Find the best overall place to live and work.",
    [normalizeNarrativeKey("Most Affordable")]:
      "Curated below are the most affordable cities in X designed to help you maximize your budget.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💰 Low cost of living\n• 📊 Strong purchasing power\n• 🎫 Visa cost\n\n→ Find cities where affordability meets comfort.",
    [normalizeNarrativeKey("Safest Cities")]:
      "Curated below are the safest cities in X based on your preference for security and peace of mind.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🛡️ Safety levels\n• 🏥 Healthcare accessibility\n• 🌿 Clean environments\n\n→ Live confidently, whether short-term or long-term.",
    [normalizeNarrativeKey("Easy Visa / Long Stay")]:
      "Curated below are the most visa-friendly cities in X for extended stays.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🛂 Visa flexibility\n• 💰 Visa cost\n• 🔄 Visa renewal ease\n\n→ Stay longer, with fewer restrictions.",
    [normalizeNarrativeKey("Strong Explorer Community")]:
      "Curated below are the best cities in X with strong and active explorer communities.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🤝 Active explorer communities\n• 🌐 Social & collaborative environments\n\n→ Find your people, anywhere you go.",
    [normalizeNarrativeKey("Healthcare Friendly")]:
      "Curated below are the most healthcare-friendly cities in X for reliable and accessible medical support.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🏥 Healthcare quality & accessibility\n• 🩺 Reliable medical infrastructure\n• 📄 Easy Medical Insurance \n\n→ Access dependable healthcare wherever you live.",
    [normalizeNarrativeKey("Startup / Business Opportunities")]:
      "Curated below are the best cities in X for startups, entrepreneurship, and career growth.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🤝 Startup ecosystems/communities \n• 🧠 Talent density\n• 🏢 Work infrastructure\n• 🚀 Incubators & accelerator programs\n\n→ Build, scale, and grow faster.",
    [normalizeNarrativeKey("Clean Air / Environment")]:
      "Curated below are the cleanest and most environmentally friendly cities in X.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🌿 Air quality\n• 🛡️ Safe, livable environments\n• 🏥 Health-conscious conditions\n\n→ Breathe better, live better.",
    [normalizeNarrativeKey("Best Work Infrastructure")]:
      "Curated below are the best cities in X optimized for productivity and remote work performance.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🏢 Work infrastructure\n• ⚡ High-speed, stable internet\n• 🚌 Internal Commuting\n\n→ Work efficiently from anywhere, without compromise.",
  },
  [normalizeNarrativeKey("Work From Anywhere")]: {
    [normalizeNarrativeKey("Best for Remote Work Setup")]:
      "Curated below are the best cities in X optimized for a seamless remote work setup.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• ⚡ Fast, reliable internet\n• 🏢 Strong work infrastructure\n\n→ Work efficiently, from anywhere in the world.",
    [normalizeNarrativeKey("Cheapest Places")]:
      "Curated below are the cheapest cities in X designed to help you minimize your living expenses.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💰 Low cost of living\n• 📊 Strong purchasing power\n\n→ Spend less, live comfortably.",
    [normalizeNarrativeKey("Best Connected Cities (Flights)")]:
      "Curated below are the best-connected cities in X for global travel and accessibility.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• ✈️ Direct international flights\n• 🌐 Airport connectivity\n\n→ Travel easily, stay connected.",
    [normalizeNarrativeKey("Strong Explorer Community")]:
      "Curated below are the best cities in X with strong and active explorer communities.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🤝 Strong explorer communities\n• 🚀 Startup ecosystems\n\n→ Meet people, plug in, and belong.",
    [normalizeNarrativeKey("Fast Internet Cities")]:
      "Curated below are the cities in X with the fastest and most reliable internet connectivity.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• ⚡ High-speed internet\n• 📡 Network reliability\n• 🏢 Work-ready infrastructure\n\n→ Stay fast, stay online.",
    [normalizeNarrativeKey("Best Work Infrastructure")]:
      "Curated below are the best cities in X with strong work infrastructure and professional environments.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🏢 Strong work infrastructure\n• ⚡ Reliable internet\n• 🚀 Strong startup activity\n\n→ Work smarter, not harder.",
  },
  [normalizeNarrativeKey("Increase Your Savings")]: {
    [normalizeNarrativeKey("Maximum Savings")]:
      "Curated below are the best cities in X to maximize your savings after expenses.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💰 Low cost of living\n• 🏦 Tax-friendly environments\n• 🏥 Affordable healthcare\n\n→ Keep more of what you earn.",
    [normalizeNarrativeKey("Low Taxation")]:
      "Curated below are the best cities in X for a low-tax and financially efficient lifestyle.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🏦 Tax-friendly environments\n• 📉 Economic stability\n\n→ Keep more, spend smarter.",
    [normalizeNarrativeKey("Purchasing Power")]:
      "Curated below are the best cities in X with the strongest purchasing power.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 📊 Strong purchasing power\n• 💰 Low cost of living\n• 🏦 Tax efficiency\n\n→ Maximize the value of your income.",
    [normalizeNarrativeKey("Financial Stability (Low Risk)")]:
      "Curated below are the best cities in X for a financially stable and low-risk lifestyle.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 📉 Stable inflation\n• 🏦 Tax efficiency\n• 💰 Cost control\n\n→ Protect what you’ve built.",
    [normalizeNarrativeKey("Startup Setup Cost")]:
      "Curated below are the best cities in X to start and run a business cost-effectively.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🚀 Low startup setup costs\n• 🏦 Tax-friendly environments\n• 💰 Affordable living\n\n→ Build lean, scale smart.",
    [normalizeNarrativeKey("Balanced Financial Lifestyle")]:
      "Curated below are the best cities in X for a well-balanced financial lifestyle.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💰 Cost efficiency\n• 🏦 Tax balance\n• 📊 Purchasing power\n\n→ Live well, spend wisely, stay secure.",
  },
  [normalizeNarrativeKey("Find Your Community")]: {
    [normalizeNarrativeKey("Social & Party Lifestyle")]:
      "Curated below are the best cities in X for a vibrant social and party lifestyle.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🎉 Party & events culture\n• 🍸 Nightlife & pubs\n• 🤝 Active explorer community\n\n→ Go out, meet people, enjoy the vibe.",
    [normalizeNarrativeKey("Chill & Wellness Lifestyle")]:
      "Curated below are the best cities in X for a calm and wellness-focused lifestyle.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🌿 Peaceful environments\n• 🧘 Wellness & yoga culture\n• 🌱 Nature & slow living\n\n→ Slow down, recharge, feel better.",
    [normalizeNarrativeKey("Adventure & Exploration")]:
      "Curated below are the best cities in X for adventure and exploration.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🧗 Adventure activities\n• 🌿 Nature access\n\n→ Go beyond the ordinary.",
    [normalizeNarrativeKey("Explorer Community & Networking")]:
      "Curated below are the best cities in X for building connections and expanding your network.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🤝 Active explorer communities\n• 📅 Meetups & events\n• 🧑‍💼 Founder & professional circles\n\n→ Connect, collaborate, grow.",
    [normalizeNarrativeKey("Couple-Friendly Lifestyle")]:
      "Curated below are the best cities in X for couples seeking a balanced and enjoyable lifestyle.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💑 Couple-friendly destinations\n• 🌿 Lifestyle & shared experiences\n• 🛡️ Safety and comfort for couples\n\n→ Build a life together, not just travel.",
    [normalizeNarrativeKey("Family-Friendly Lifestyle")]:
      "Curated below are the best cities in X for families seeking a safe and comfortable lifestyle.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 👨‍👩‍👧 Family-friendly destinations\n• 🛡️ Safety & stability\n• 🌿 Calm & livable surroundings\n\n→ Build a secure and balanced life for your family.",
    [normalizeNarrativeKey("Female - Friendly Lifestyle")]:
      "Curated below are the best cities in X for solo female travelers seeking safety and comfort.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 👩 Female-friendly destinations\n• 🛡️ Safety & security\n• 🤝 Supportive communities\n• 🌍 Ease of navigation\n\n→ Travel independently with confidence.",
    [normalizeNarrativeKey("Founder Explorers")]:
      "Curated below are the best cities in X for founder explorers and startup builders.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💎 Strong founder destinations\n• 🚀 Startup ecosystems\n• 🤝 Startup investors presence for networking\n• 📅 Startup events & activities\n\n→ Build, connect, scale.",
    [normalizeNarrativeKey("Solo Explorers")]:
      "Curated below are the best cities in X for solo explorer travelers.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🧍 Solo-friendly destinations\n• 🤝 Easy social integration\n• 🌍 Freedom & flexibility\n\n→ Explore freely, connect easily.",
  },
  [normalizeNarrativeKey("Advance Your Career")]: {
    [normalizeNarrativeKey("Startup Ecosystems")]:
      "Curated below are the best cities in X with strong startup ecosystems and innovation-driven environments.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🚀 Strong startup activity\n• 💰 Access to venture capital\n• 🏢 Incubators & accelerators\n• 📅 Startup events & activities\n\n→ Build, scale, and thrive.",
    [normalizeNarrativeKey("Remote Job Opportunities")]:
      "Curated below are the best cities in X for accessing remote job opportunities and global work.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💼 Availability of remote jobs\n• 🧑‍💻 Digital work ecosystem\n• 🚀 Startup ecosystems\n\n→ Work globally, earn flexibly.",
    [normalizeNarrativeKey("Founder Explorers")]:
      "Curated below are the best cities in X for building strong networks and valuable connections.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💎 Strong founder destinations\n• 📅 Startup conferences & networking events\n• 📈 Emerging startup ecosystems\n\n→ Meet the right people, unlock opportunities.",
    [normalizeNarrativeKey("Tech Talent Density")]:
      "Curated below are the best cities in X with high tech talent density and innovation-driven ecosystems.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🧠 Skilled tech workforce\n• 💻 Tech startups ecosystem\n• 🚀 Innovation-driven environments\n\n→ Build faster with the right people around you.",
    [normalizeNarrativeKey("Startup Funding & Support")]:
      "Curated below are the best cities in X for startup support through incubators and accelerators.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 🚀 Incubators & accelerator presence\n• 🧠 Mentorship & founder community\n• 🏛️ Local government support\n\n→ Build faster with guidance and support.",
    [normalizeNarrativeKey("Balanced Career Growth")]:
      "Curated below are the best cities in X for balanced career growth and long-term opportunities.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💼 Growing job opportunities\n• 🚀 Emerging startup ecosystems\n• 🤝 Startup networking communities\n• 🏛️ Government support towards startups\n\n→ Grow consistently while staying balanced.",
    [normalizeNarrativeKey("Venture Capital Presence")]:
      "Curated below are the best cities in X for accessing venture capital and startup funding.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 💰 Active venture capital communities\n• 💸 Venture capital investments\n\n→ Raise faster, scale bigger.",
    [normalizeNarrativeKey("Conferences & Events")]:
      "Curated below are the best cities in X for conferences, events, and professional networking.\nPowered by roamiq’s intelligence model, prioritizing:\n\n• 📅 Startup programs\n• 🏛️ Government startup events\n• 🎤 Conferences & industry events\n\n→ Learn, connect, and unlock opportunities.",
  },
};

const searchBarBadgeClassName =
  "inline-flex min-h-[40px] min-w-[5rem] items-center rounded-full border border-glass-border bg-glass px-4 py-2 text-xs font-medium text-gray-300";

const searchBarBroaderGoalLabelMap = {
  "World Ranking": "Worldwide Explorer Destinations Ranking",
  "Work From Anywhere": "Best Explorer Destinations for Remote Work",
  "Increase Your Savings": "Budget-Friendly Explorer Destinations",
  "Find Your Community": "Be with your Community",
  "Advance Your Career": "Advance your Career",
};

const searchBarEndGoalLabelMap = {
  "World Ranking": {
    "Best for Explorers": "Best Overall Explorer Destinations",
    "Most Affordable": "Most Affordable Explorer Destinations",
    "Safest Cities": "Safest Explorer Destinations",
    "Easy Visa / Long Stay": "Visa-Friendly Explorer Destinations",
    "Strong Explorer Community": "Most Active Explorer Destinations",
    "Healthcare Friendly": "Healthcare-Friendly Explorer Destinations",
    "Startup / Business Opportunities":
      "Startup/Business Ready Explorer Destinations",
    "Clean Air / Environment": "Environment-Friendly Explorer Destinations",
    "Best Work Infrastructure": "Best Work Infrastructure Explorer Destinations",
  },
  "Work From Anywhere": {
    "Best for Remote Work Setup":
      "Best Overall Explorer Destinations for Remote Work",
    "Cheapest Places": "Cheapest Explorer Destinations",
    "Best Connected Cities (Flights)": "Globally Accessible Explorer Destinations",
    "Strong Explorer Community": "Most Active Explorer Destinations",
    "Fast Internet Cities": "Explorer Destinations with the Fastest Internet",
    "Best Work Infrastructure": "Best Work Infrastructure Explorer Destinations",
  },
  "Increase Your Savings": {
    "Maximum Savings": "Best Explorer Destinations to Maximize you Savings",
    "Low Taxation": "Tax-Friendly Explorer Destinations",
    "Purchasing Power": "Explorer Destinations with Strong Purchasing Power",
    "Financial Stability(Low Risk)": "Financially Stable Explorer Destinations",
    "Startup Setup Cost": "Cheapest Explorer Destinations for Startups",
    "Balanced Financial Lifestyle":
      "Best Overall Explorer Destinations for Savings",
  },
  "Find Your Community": {
    "Social & Party Lifestyle": "Party & Social Lifestyle Explorer Destinations",
    "Chill & Wellness Lifestyle":
      "Chill & Wellness Lifestyle Explorer Destinations",
    "Adventure & Exploration": "Adventurous Explorer Destinations",
    "Explorer Community & Networking": "Explorer Destinations for Networking",
    "Couple - Friendly Lifestyle": "Couple-Friendly Explorer Destinations",
    "Family - Friendly Lifestyle": "Explorer Destinations for Family Travel",
    "Female - Friendly Lifestyle": "Safe Explorer Destinations for Females",
    "Founder Explorers": "Explorer Destinations for Founders",
    "Solo Explorers": "Explorer Destinations for Solo Travellers",
  },
  "Advance Your Career": {
    "Startup Ecosystems": "Best Startup Ecosystems",
    "Remote Job Opportunities": "Destinations with Remote Job Opportunities",
    "Founder Explorers": "Grow Connections through Founders",
    "Tech Talent Density": "Tech Dense Explorer Destinations",
    "Startup Incubators & Accelerators": "Startup Incubators & Accelerators",
    "Balanced Career Growth": "Balanced Career Growth",
    "Venture Capital Presence": "Venture Capital Presence",
    "Conferences & Events": "Best Explorer Destinations for Conferences & Events",
  },
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightSelectedTokens = (text, tokens) => {
  if (!text) {
    return "";
  }

  const validTokens = tokens.filter(Boolean);
  if (!validTokens.length) {
    return text;
  }

  const tokenPattern = validTokens
    .sort((left, right) => right.length - left.length)
    .map((token) => escapeRegExp(token))
    .join("|");

  if (!tokenPattern) {
    return text;
  }

  const parts = text.split(new RegExp(`(${tokenPattern})`, "g"));

  return parts.map((part, index) => {
    const isSelectedToken = validTokens.some((token) => token === part);

    if (!isSelectedToken) {
      return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
    }

    return (
      <span key={`${part}-${index}`} className="text-accent">
        {part}
      </span>
    );
  });
};

const DropdownBadge = ({
  label,
  options,
  selectedValue,
  isOpen,
  onToggle,
  onSelect,
  align = "left",
  size = "default",
}) => {
  const menuAlignment = align === "right" ? "right-0" : "left-0";
  const isSmall = size === "small";

  return (
    <div
      className={`relative min-w-0 ${isSmall ? "w-full sm:flex-1" : "w-full flex-1"}`}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-2 rounded-full border font-medium transition-colors ${
          isSmall
            ? "min-h-[38px] px-3 py-1.5 text-xs sm:px-4"
            : "min-h-[44px] px-4 py-2 text-xs sm:px-5"
        } ${
          isOpen
            ? "border-accent bg-accent text-surface"
            : "border-glass-border bg-glass text-gray-300 hover:border-accent"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedValue}</span>
        <HiOutlineChevronDown
          size={18}
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full z-40 mt-3 min-w-[11rem] w-full max-w-[calc(100vw-4rem)] rounded-2xl border border-glass-border bg-surface-50 p-2 shadow-glass backdrop-blur-xl ${menuAlignment}`}
        >
          <ul
            className="max-h-72 overflow-y-auto"
            role="listbox"
            aria-label={label}
          >
            {options.map((option) => {
              const isSelected = option === selectedValue;

              return (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => onSelect(option)}
                    className={`group flex w-full items-center rounded-xl px-4 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-accent/15 font-medium text-accent"
                        : "text-gray-400 hover:bg-surface-100"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="mr-2 inline-flex w-4 shrink-0 items-center justify-center">
                      <FaCheck
                        size={13}
                        className={`shrink-0 text-accent transition-opacity ${
                          isSelected
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="pl-1">{option}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const AiSearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { goal, loc, attr } = useParams();
  const { auth } = useAuth();
  const isLoggedIn = Boolean(auth?.user);
  const axiosPrivate = useAxiosPrivate();
  const { state } = location;
  const requestedGoalFromUrl = goal ? goalNameBySlug[goal.toLowerCase()] : null;
  const requestedGoal = state?.selectedGoal || requestedGoalFromUrl;
  const selectedGoal =
    requestedGoal && goalFilterMap[requestedGoal] ? requestedGoal : defaultGoal;
  const searchResultsBasePath = goal
    ? `/search/${encodeURIComponent(goal)}/results`
    : "/search/results";
  const goalOptions = goalFilterMap[selectedGoal] || goalFilterMap[defaultGoal];
  const getPersistedGoal = () => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(SEARCH_RESULTS_GOAL_STORAGE_KEY);
    },
    getPersistedSelectionSignature = () => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(
        SEARCH_RESULTS_SELECTION_SIGNATURE_STORAGE_KEY,
      );
    };

  const initialContinent = useMemo(() => {
    if (loc) return decodeURIComponent(loc);
    return state?.selectedFilters?.continent || null;
  }, [loc, state?.selectedFilters?.continent]);

  const initialGoalOption = useMemo(() => {
    if (attr) return decodeURIComponent(attr);
    return state?.selectedFilters?.goalOption || null;
  }, [attr, state?.selectedFilters?.goalOption]);

  const [typedTopHeading, setTypedTopHeading] = useState("");
  const [typedBottomHeading, setTypedBottomHeading] = useState("");
  const [typedResultsHeading, setTypedResultsHeading] = useState("");
  const [selectedContinent, setSelectedContinent] = useState(initialContinent);
  const [selectedGoalOption, setSelectedGoalOption] =
    useState(initialGoalOption);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedVisaRequirement, setSelectedVisaRequirement] = useState(
    visaRequirementOptions[0],
  );
  const [isResultsReady, setIsResultsReady] = useState(false);
  const [visibleDestinationCount, setVisibleDestinationCount] = useState(0);
  const [likedDestinations, setLikedDestinations] = useState([]);
  const [isDestinationsLoading, setIsDestinationsLoading] = useState(false);
  const dropdownContainerRef = useRef(null);
  const closeDropdownTimeoutRef = useRef(null);

  const topTypingIntervalRef = useRef(null);
  const bottomTypingIntervalRef = useRef(null);
  const selectedHeadingDelayTimeoutRef = useRef(null);
  const previousSelectedPairRef = useRef(null);
  const previousGoalRef = useRef(getPersistedGoal() || selectedGoal);

  const previousVisibleDestinationsLengthRef = useRef(0);

  const hasSelectedContinent = Boolean(selectedContinent);
  const selectedContinentDisplay =
    normalizeSelectedContinent(selectedContinent);
  const hasSelectedGoalOption = Boolean(selectedGoalOption);
  const hasSelectedFilters = hasSelectedContinent && hasSelectedGoalOption;
  const selectedContinentDropdownValue = hasSelectedContinent
    ? selectedContinentDisplay === "World"
      ? "You Intend To > Explore the World"
      : `You Intend To > Explore ${selectedContinentDisplay}`
    : "Where Do You Want To Go?";
  const selectedGoalOptionDropdownValue = hasSelectedGoalOption
    ? `Your End Goal > ${
        searchBarEndGoalLabelMap[selectedGoal]?.[selectedGoalOption] ||
        selectedGoalOption
      }`
    : "Choose Your Goal!";
  const passportCountry =
    auth?.user?.country ||
    auth?.user?.countryOfResidence ||
    DEFAULT_PASSPORT_COUNTRY;
  const userId = auth?.user?._id || auth?.user?.id;

  const [apiDestinations, setApiDestinations] = useState([]);
  const [visaRuleDestinationKeys, setVisaRuleDestinationKeys] = useState(null);

  const [visaRuleDurationByCountry, setVisaRuleDurationByCountry] =
    useState(null);

  const destinationLookup = useMemo(() => {
    const map = new Map();

    destinationCards.forEach((destination) => {
      const keys = [
        destination.city,
        destination.displayCity,
        destination.routeCity,
        destinationAliasMap[destination.city],
      ].filter(Boolean);

      keys.forEach((key) => {
        map.set(normalizeDestinationKey(key), destination);
      });
    });

    return map;
  }, []);

  const rankedDestinations = useMemo(() => {
    const leftBadgeField = leftBadgeFieldByGoalOption[selectedGoalOption];
    const leftBadgeLabelField =
      leftBadgeLabelFieldByGoalOption[selectedGoalOption] ||
      getLabelFieldKeyForSelection(selectedGoal, selectedGoalOption);

    const filteredDestinations = apiDestinations.filter((destination) => {
      if (destination?.isActive !== true) {
        return false;
      }

      if (!visaRuleDestinationKeys) {
        return true;
      }

      return visaRuleDestinationKeys.has(
        normalizeCountryKey(destination.country),
      );
    });

    const sortedDestinations =
      isVisaRequirementFilterActive(selectedVisaRequirement) &&
      visaRuleDurationByCountry
        ? filteredDestinations
            .map((destination, index) => ({ destination, index }))
            .sort((a, b) => {
              const aDuration =
                visaRuleDurationByCountry.get(
                  normalizeCountryKey(a.destination.country),
                ) ?? 0;
              const bDuration =
                visaRuleDurationByCountry.get(
                  normalizeCountryKey(b.destination.country),
                ) ?? 0;

              if (bDuration !== aDuration) {
                return bDuration - aDuration;
              }

              return a.index - b.index;
            })
            .map(({ destination }) => destination)
        : filteredDestinations;

    return sortedDestinations.map((destination, index) => {
      const leftBadgeValueFromLabel =
        leftBadgeLabelField && destination?.labels
          ? formatLeftBadgeValue(destination.labels[leftBadgeLabelField])
          : null;
      const leftBadgeValueFromField = leftBadgeField
        ? formatLeftBadgeValue(destination[leftBadgeField])
        : null;

      return {
        ...destination,
        rankLabel: `Rank ${index + 1}`,
        leftBadgeLabel: leftBadgeValueFromLabel || leftBadgeValueFromField,
      };
    });
  }, [
    apiDestinations,
    selectedGoal,
    selectedGoalOption,
    selectedVisaRequirement,
    visaRuleDestinationKeys,
    visaRuleDurationByCountry,
  ]);

  useEffect(() => {
    if (!isVisaRequirementFilterActive(selectedVisaRequirement)) {
      setVisaRuleDestinationKeys(null);
      setVisaRuleDurationByCountry(null);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchVisaRules = async () => {
      try {
        const response = await axios.get("/visa-rules", {
          params: {
            passportCountry,
            requirement: getVisaRequirementApiValue(selectedVisaRequirement),
          },
          signal: controller.signal,
        });

        const allowedDestinationKeys = new Set(
          (response?.data?.data || []).map((rule) =>
            normalizeCountryKey(rule.destination),
          ),
        );
        const durationByCountry = new Map(
          (response?.data?.data || []).map((rule) => [
            normalizeCountryKey(rule.destination),
            Number(rule.durationDays) || 0,
          ]),
        );

        if (isMounted) {
          setVisaRuleDestinationKeys(allowedDestinationKeys);
          setVisaRuleDurationByCountry(durationByCountry);
        }
      } catch {
        if (!controller.signal.aborted && isMounted) {
          setVisaRuleDestinationKeys(new Set());
          setVisaRuleDurationByCountry(new Map());
        }
      }
    };

    fetchVisaRules();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [passportCountry, selectedVisaRequirement]);

  useEffect(() => {
    if (!userId) {
      setLikedDestinations([]);
      return;
    }

    let isMounted = true;

    const fetchFavoriteDestinations = async () => {
      try {
        const response = await axiosPrivate.get(
          `/user/favorite-destination/${userId}`,
        );

        if (!isMounted) {
          return;
        }

        const favoriteIds =
          response?.data
            ?.map((destination) => destination?._id)
            .filter(Boolean) || [];

        setLikedDestinations(favoriteIds);
      } catch (error) {
        if (isMounted) {
          showErrorAlert(
            error?.response?.data?.message ||
              "Failed to load favorite destinations.",
          );
        }
      }
    };

    fetchFavoriteDestinations();

    return () => {
      isMounted = false;
    };
  }, [axiosPrivate, userId]);

  useEffect(() => {
    if (!hasSelectedFilters) {
      setApiDestinations([]);
      setIsDestinationsLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchRankedDestinations = async () => {
      if (isMounted) {
        setIsDestinationsLoading(true);
      }
      try {
        const response = await axios.post(
          "/state-wise-weight",
          {
            selectionType: selectedGoal,
            continent: selectedContinentDisplay,
            attribute: getApiAttributeForSelection(
              selectedGoal,
              selectedGoalOption,
            ),
            visaRequirement: getVisaRequirementApiValue(
              selectedVisaRequirement,
            ),
            passportCountry,
          },
          { signal: controller.signal },
        );

        const responseData = response?.data?.data || [];
        const selectedAttribute = response?.data?.selectedAttribute;

        const mappedDestinations = responseData.map((item) => {
          const rawState = item?.state || "";
          const aliasedState = destinationAliasMap[rawState] || rawState;
          const existingDestination =
            destinationLookup.get(normalizeDestinationKey(aliasedState)) ||
            destinationLookup.get(normalizeDestinationKey(rawState));

          const metricValue =
            typeof item?.[selectedAttribute] === "number"
              ? item[selectedAttribute]
              : Object.entries(item).find(
                  ([, value]) => typeof value === "number",
                )?.[1] || 0;

          return {
            ...(existingDestination || {}),
            _id: item?._id,
            city: existingDestination?.city || rawState,
            title: existingDestination?.title || item?.title || rawState,
            displayCity: existingDestination?.displayCity || rawState,
            routeCity: existingDestination?.routeCity || rawState,
            displayCountry:
              existingDestination?.displayCountry ||
              existingDestination?.country ||
              item?.country ||
              "Unknown",
            routeCountry:
              existingDestination?.routeCountry ||
              existingDestination?.country ||
              item?.country ||
              "Unknown",
            country: existingDestination?.country || item?.country || "Unknown",
            continent:
              existingDestination?.continent || selectedContinentDisplay,
            suggestions: Number(metricValue.toFixed(3)),
            internetSpeed: item?.internetSpeed,
            aqiValue: item?.aqiValue,
            roamiqTax: item?.roamiqTax,
            costOfLivingPerMonth: item?.costOfLivingPerMonth,
            allScores: item?.allScores || {},
            weight: item?.weight || {},
            labels: item?.labels || {},
            isActive: item?.isActive ?? existingDestination?.isActive ?? false,
            image: (() => {
              const urls = Array.isArray(item?.imageUrl)
                ? item.imageUrl
                : item?.imageUrl
                  ? [item.imageUrl]
                  : [];
              if (urls.length > 0) {
                // If it's still an array here for some reason, pick random.
                // Note: Backend now returns a random string in imageUrl, but this is a safety net.
                return urls[Math.floor(Math.random() * urls.length)];
              }
              return existingDestination?.image || "/images/goa-image.jpg";
            })(),
          };
        });

        if (isMounted) {
          setApiDestinations(mappedDestinations);
        }
      } catch {
        if (!controller.signal.aborted && isMounted) {
          setApiDestinations([]);
        }
      } finally {
        if (isMounted) {
          setIsDestinationsLoading(false);
        }
      }
    };

    fetchRankedDestinations();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    destinationLookup,
    hasSelectedFilters,
    selectedContinent,
    selectedGoal,
    selectedGoalOption,
    selectedVisaRequirement,
    passportCountry,
  ]);

  const searchBarBadges = useMemo(() => {
    const broaderGoal =
      searchBarBroaderGoalLabelMap[selectedGoal] || selectedGoal;
    return [`Your Broader Goal > ${broaderGoal}`];
  }, [selectedGoal]);

  const visibleDestinations = useMemo(
    () => rankedDestinations,
    [rankedDestinations],
  );

  const handleDestinationClick = (destination) => {
    const routeCountry = destination.routeCountry || destination.country;
    const country = routeCountry.toLowerCase();
    const selectedLocationLabel = destination.displayCity || destination.city;
    const selectedLocationParam = (
      destination.routeCity || destination.city
    ).toLowerCase();
    const continent = destination.continent.toLowerCase();
    const destinationTitle = destination.title || selectedLocationLabel;
    const nextSearchBarBadges = [...searchBarBadges, destinationTitle];

    persistSelectedDestination({
      continent,
      country,
      city: selectedLocationParam,
      title: destinationTitle,
    });

    navigate(
      `/ai-verticals?country=${encodeURIComponent(country)}&state=${encodeURIComponent(selectedLocationParam)}`,
      {
        state: {
          selectedStateLabel: destinationTitle,
          breadcrumbFilters: {
            continent,
            country,
            location: selectedLocationParam,
          },
          selectedFilters: {
            continent: selectedContinent,
            goalOption: selectedGoalOption,
          },
          searchBarBadges: nextSearchBarBadges,
        },
      },
    );
  };
  const toggleDestinationLike = useCallback(
    (destination) => {
      const destinationKey = getDestinationFavoriteKey(destination);
      const destinationId = destination?._id;

      if (!userId) {
        navigate("/ai-login", {
          state: {
            redirectTo: `${location.pathname}${location.search}`,
            loginContext: {
              title: "Save destination favorites",
              description:
                "Login to save your favorite destinations and continue from this results page.",
            },
          },
        });
        return;
      }

      if (!destinationId) {
        showErrorAlert("This destination cannot be favorited yet.");
        return;
      }

      const isCurrentlyLiked = likedDestinations.includes(destinationKey);
      const nextLikedDestinations = isCurrentlyLiked
        ? likedDestinations.filter((key) => key !== destinationKey)
        : [...likedDestinations, destinationKey];

      setLikedDestinations(nextLikedDestinations);

      axiosPrivate
        .patch("/user/favorite-destination", {
          destinationId,
          isFavorited: !isCurrentlyLiked,
        })
        .catch((error) => {
          setLikedDestinations(likedDestinations);
          showErrorAlert(
            error?.response?.data?.message ||
              "Failed to update favorite destination.",
          );
        });
    },
    [
      axiosPrivate,
      likedDestinations,
      location.pathname,
      location.search,
      navigate,
      userId,
    ],
  );

  const handleDropdownToggle = (dropdownKey) => {
    setOpenDropdown((currentDropdown) =>
      currentDropdown === dropdownKey ? null : dropdownKey,
    );
  };

  const handleContinentSelect = (continent) => {
    setSelectedContinent(continent);
    const encodedLoc = encodeURIComponent(continent);
    if (selectedGoalOption) {
      navigate(
        `${searchResultsBasePath}/${encodedLoc}/${encodeURIComponent(selectedGoalOption)}`,
        { state },
      );
    } else {
      navigate(`${searchResultsBasePath}/${encodedLoc}`, { state });
    }

    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
    }
    closeDropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 120);
  };

  const handleGoalOptionSelect = (option) => {
    setSelectedGoalOption(option);
    const encodedLoc = selectedContinent
      ? encodeURIComponent(selectedContinentDisplay)
      : "World";
    const encodedAttr = encodeURIComponent(option);
    navigate(`${searchResultsBasePath}/${encodedLoc}/${encodedAttr}`, {
      state,
    });

    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
    }
    closeDropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 120);
  };

  const handleVisaRequirementSelect = (option) => {
    setSelectedVisaRequirement(option);
    if (closeDropdownTimeoutRef.current) {
      clearTimeout(closeDropdownTimeoutRef.current);
    }
    closeDropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 120);
  };

  // const isPrimaryGoalOptionSelected =
  //   hasSelectedGoalOption && selectedGoalOption === goalOptions[0];

  const initialTopHeadingText =
    "Please select one option from each below so that I can display the best curated results.";
  const selectedTopHeadingText =
    goalNarrativeTopHeadingMap[requestedGoal] ||
    goalNarrativeTopHeadingMap[selectedGoal] ||
    goalNarrativeTopHeadingMap["World Ranking"];
  const selectedBottomHeadingText =
    "Feel free to edit your above selection anytime, and I will curate a new set of the best results for you.";

  const selectedResultsHeadingText = useMemo(() => {
    if (!selectedContinent || !selectedGoalOption) {
      return "";
    }

    const narrativeContinentLabel = getNarrativeContinentLabel(
      selectedContinentDisplay,
    );

    const goalNarratives =
      goalNarrativeByGoalAndAttribute[normalizeNarrativeKey(selectedGoal)] ||
      {};
    const narrativeTemplate =
      goalNarratives[normalizeNarrativeKey(selectedGoalOption)];

    if (narrativeTemplate) {
      return addAdditionalPriorityPointsText(
        narrativeTemplate.replaceAll("X", narrativeContinentLabel),
      );
    }

    return `Curated below are the best cities in ${narrativeContinentLabel} as per the ${selectedGoalOption} for you. The results below are ranked using RoamIQ’s Intelligence Model, analyzing 50+ global factors — including safety, explorer population, healthcare, visa flexibility, cost of living, taxation, work infrastructure, lifestyle quality, and community — tailored to your personal profile.`;
  }, [selectedContinentDisplay, selectedGoal, selectedGoalOption]);

  const thinkingHeadingText = "Curating the best results for you";

  const isThinkingHeadingVisible =
    typedTopHeading.length > 0 &&
    thinkingHeadingText.startsWith(typedTopHeading);

  const clearTypingAnimations = useCallback(() => {
    if (topTypingIntervalRef.current) {
      clearInterval(topTypingIntervalRef.current);
      topTypingIntervalRef.current = null;
    }

    if (bottomTypingIntervalRef.current) {
      clearInterval(bottomTypingIntervalRef.current);
      bottomTypingIntervalRef.current = null;
    }

    if (selectedHeadingDelayTimeoutRef.current) {
      clearTimeout(selectedHeadingDelayTimeoutRef.current);
      selectedHeadingDelayTimeoutRef.current = null;
    }
  }, []);

  const animateTypedText = useCallback((text, setText, onComplete) => {
    setText("");

    if (!text) {
      onComplete?.();
      return null;
    }

    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex += 1;
      setText(text.slice(0, currentIndex));

      if (currentIndex >= text.length) {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, TYPING_INTERVAL_MS);

    return intervalId;
  }, []);

  const playInitialHeadingAnimation = useCallback(() => {
    clearTypingAnimations();
    setIsResultsReady(false);
    setTypedBottomHeading("");

    setTypedResultsHeading("");

    topTypingIntervalRef.current = animateTypedText(
      initialTopHeadingText,
      setTypedTopHeading,
    );
  }, [animateTypedText, clearTypingAnimations, initialTopHeadingText]);

  const playSelectedHeadingAnimation = useCallback(() => {
    clearTypingAnimations();
    setIsResultsReady(false);
    setTypedBottomHeading("");
    setTypedResultsHeading("");

    topTypingIntervalRef.current = animateTypedText(
      thinkingHeadingText,
      setTypedTopHeading,
      () => {
        selectedHeadingDelayTimeoutRef.current = setTimeout(() => {
          topTypingIntervalRef.current = animateTypedText(
            selectedTopHeadingText,
            setTypedTopHeading,
            () => {
              bottomTypingIntervalRef.current = animateTypedText(
                selectedBottomHeadingText,
                setTypedBottomHeading,
                () => {
                  bottomTypingIntervalRef.current = animateTypedText(
                    selectedResultsHeadingText,
                    setTypedResultsHeading,
                    () => {
                      setIsResultsReady(true);
                    },
                  );
                },
              );
            },
          );
        }, SELECTED_HEADING_TRANSITION_DELAY_MS);
      },
    );
  }, [
    animateTypedText,
    clearTypingAnimations,
    thinkingHeadingText,
    selectedBottomHeadingText,
    selectedResultsHeadingText,
    selectedTopHeadingText,
  ]);

  useEffect(() => {
    playInitialHeadingAnimation();

    return () => {
      clearTypingAnimations();
    };
  }, [clearTypingAnimations, playInitialHeadingAnimation]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(
    () => () => {
      if (closeDropdownTimeoutRef.current) {
        clearTimeout(closeDropdownTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (loc) {
      setSelectedContinent(decodeURIComponent(loc));
    } else if (loc === undefined) {
      setSelectedContinent(null);
    }
  }, [loc]);

  useEffect(() => {
    if (attr) {
      setSelectedGoalOption(decodeURIComponent(attr));
    } else if (attr === undefined) {
      setSelectedGoalOption(null);
    }
  }, [attr]);

  useEffect(() => {
    const incomingFilters = location.state?.selectedFilters;
    if (!incomingFilters || loc || attr) return; // If URL params exist, they take priority

    setSelectedContinent(incomingFilters.continent || null);
    setSelectedGoalOption(incomingFilters.goalOption || null);
  }, [location.state, loc, attr]);

  // Redundant localStorage sync removed as per user request to use URLs instead
  /*
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (selectedContinent) {
      localStorage.setItem(
        SEARCH_RESULTS_LOCATION_STORAGE_KEY,
        selectedContinent,
      );
    } else {
      localStorage.removeItem(SEARCH_RESULTS_LOCATION_STORAGE_KEY);
    }
  }, [selectedContinent]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (selectedGoalOption) {
      localStorage.setItem(
        SEARCH_RESULTS_ATTRIBUTE_STORAGE_KEY,
        selectedGoalOption,
      );
    } else {
      localStorage.removeItem(SEARCH_RESULTS_ATTRIBUTE_STORAGE_KEY);
    }
  }, [selectedGoalOption]);
  */

  // Goal-change effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (previousGoalRef.current !== selectedGoal) {
      setSelectedContinent(null);
      setSelectedGoalOption(null);
      // If we are at a deep results URL, go back to root results on goal change
      if (loc || attr) {
        navigate(searchResultsBasePath, { state: location.state });
      }
    }

    if (selectedGoal) {
      localStorage.setItem(SEARCH_RESULTS_GOAL_STORAGE_KEY, selectedGoal);
    }

    previousGoalRef.current = selectedGoal;
  }, [
    selectedGoal,
    navigate,
    loc,
    attr,
    location.state,
    searchResultsBasePath,
  ]);

  useEffect(() => {
    if (!hasSelectedFilters) {
      setIsResultsReady(false);
      setTypedBottomHeading("");
      setTypedResultsHeading("");
    }
  }, [hasSelectedFilters]);

  useEffect(() => {
    if (!hasSelectedFilters || !isResultsReady) {
      setVisibleDestinationCount(0);
      previousVisibleDestinationsLengthRef.current = 0;
      return;
    }

    if (!visibleDestinations.length) {
      setVisibleDestinationCount(0);
      previousVisibleDestinationsLengthRef.current = 0;
      return;
    }

    const previousVisibleLength = Math.min(
      previousVisibleDestinationsLengthRef.current,
      visibleDestinations.length,
    );
    setVisibleDestinationCount(previousVisibleLength);

    if (previousVisibleLength >= visibleDestinations.length) {
      previousVisibleDestinationsLengthRef.current = visibleDestinations.length;
      return;
    }

    let currentVisibleCount = previousVisibleLength;

    const revealInterval = setInterval(() => {
      currentVisibleCount += 1;
      setVisibleDestinationCount(currentVisibleCount);

      if (currentVisibleCount >= visibleDestinations.length) {
        previousVisibleDestinationsLengthRef.current =
          visibleDestinations.length;
        clearInterval(revealInterval);
      }
    }, DESTINATION_REVEAL_INTERVAL_MS);

    return () => {
      clearInterval(revealInterval);
      previousVisibleDestinationsLengthRef.current = currentVisibleCount;
    };
  }, [hasSelectedFilters, isResultsReady, visibleDestinations]);

  useEffect(() => {
    const persistedSignature = getPersistedSelectionSignature();
    const persistedGoal = getPersistedGoal();
    const selectedPair = hasSelectedFilters
      ? `${selectedContinent}|${selectedGoalOption}`
      : null;
    const selectedSignature = selectedPair
      ? `${selectedGoal}|${selectedPair}`
      : null;

    if (!selectedSignature) {
      previousSelectedPairRef.current = selectedPair;
      return;
    }

    const isFirstRenderForSelection = previousSelectedPairRef.current === null;
    const hasPersistedMatch =
      persistedSignature === selectedSignature &&
      persistedGoal === selectedGoal;

    if (isFirstRenderForSelection && hasPersistedMatch) {
      clearTypingAnimations();
      setTypedTopHeading(selectedTopHeadingText);
      setTypedBottomHeading(selectedBottomHeadingText);
      setTypedResultsHeading(selectedResultsHeadingText);
      setIsResultsReady(true);
    } else if (previousSelectedPairRef.current !== selectedPair) {
      playSelectedHeadingAnimation();
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        SEARCH_RESULTS_SELECTION_SIGNATURE_STORAGE_KEY,
        selectedSignature,
      );
    }

    previousSelectedPairRef.current = selectedPair;
  }, [
    clearTypingAnimations,
    hasSelectedFilters,
    playSelectedHeadingAnimation,
    selectedBottomHeadingText,
    selectedContinent,
    selectedGoal,
    selectedGoalOption,
    selectedResultsHeadingText,
    selectedTopHeadingText,
  ]);

  const shouldShowResultsContent = hasSelectedFilters && isResultsReady;
  const shouldShowNarrative =
    hasSelectedFilters && (typedBottomHeading || typedResultsHeading);

  const [resultsHeadingFirstLine, resultsHeadingRemainingLines] =
    useMemo(() => {
      const [firstLine = "", ...remainingLines] =
        typedResultsHeading.split("\n");

      return [firstLine, remainingLines.join("\n")];
    }, [typedResultsHeading]);

  const highlightedResultsHeadingFirstLine = useMemo(
    () =>
      highlightSelectedTokens(resultsHeadingFirstLine, [
        selectedContinentDisplay,
        selectedGoalOption,
      ]),
    [resultsHeadingFirstLine, selectedContinentDisplay, selectedGoalOption],
  );

  const highlightedResultsHeadingRemainingLines = useMemo(
    () =>
      highlightSelectedTokens(resultsHeadingRemainingLines, [
        selectedContinentDisplay,
        selectedGoalOption,
      ]),
    [
      resultsHeadingRemainingLines,
      selectedContinentDisplay,
      selectedGoalOption,
    ],
  );

  const [resultsHeadingBodyLines, resultsHeadingLastLine] = useMemo(() => {
    if (!resultsHeadingRemainingLines) {
      return ["", ""];
    }

    const lines = resultsHeadingRemainingLines
      .split("\n")
      .map((line) => line.trimEnd());
    const lastLineIndex = [...lines]
      .reverse()
      .findIndex((line) => line.trim().startsWith("→"));

    if (lastLineIndex === -1) {
      return [resultsHeadingRemainingLines, ""];
    }

    const resolvedLastLineIndex = lines.length - 1 - lastLineIndex;
    const bodyLines = lines
      .slice(0, resolvedLastLineIndex)
      .join("\n")
      .trimEnd();
    const lastLine = lines[resolvedLastLineIndex].trim();

    return [bodyLines, lastLine];
  }, [resultsHeadingRemainingLines]);

  const formattedNarrative = useMemo(() => {
    const lines = (resultsHeadingBodyLines || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const poweredByLine = lines.find((line) =>
      line.toLowerCase().startsWith("powered by"),
    );

    const priorityPoints = lines
      .filter((line) => line.startsWith("•"))
      .map((line) => line.replace(/^•\s*/, "").trim());
    const visiblePriorityPoints =
      priorityPoints.length > PRIORITY_POINTS_VISIBLE_LIMIT
        ? priorityPoints.slice(0, PRIORITY_POINTS_VISIBLE_LIMIT)
        : priorityPoints;
    const additionalPriorityPointsText =
      lines.find((line) => ADDITIONAL_PRIORITY_POINTS_TEXT.startsWith(line)) ||
      "";

    const introLine =
      highlightedResultsHeadingFirstLine ||
      lines.find(
        (line) =>
          !line.startsWith("•") && !line.toLowerCase().startsWith("powered by"),
      ) ||
      "";

    const endingLine =
      resultsHeadingLastLine ||
      lines.find((line) => line.startsWith("→")) ||
      "";

    return {
      introLine,
      poweredByLine,
      priorityPoints: visiblePriorityPoints,
      additionalPriorityPointsText,
      endingLine,
    };
  }, [
    highlightedResultsHeadingFirstLine,
    resultsHeadingBodyLines,
    resultsHeadingLastLine,
  ]);

  return (
    <div className="min-h-full bg-surface animate-fade-in">
      <main className="pb-8">
        <div className="mx-0 w-full max-w-[80rem] px-3 sm:px-6 lg:mx-auto lg:max-w-[85rem] lg:px-0 lg:min-w-[75%]">
          <div className="rounded-[10px] bg-surface-50 border border-glass-border px-0 pb-6">
            <div className="mt-6 mb-6 lg:ml-[2.5rem] lg:mr-10">
              <p className="flex items-center gap-2 text-sm font-medium leading-snug text-gray-200 lg:text-[0.9rem] font-heading">
                {isThinkingHeadingVisible && (
                  <span
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent border-b-transparent"
                    aria-hidden="true"
                  />
                )}
                {typedTopHeading}
              </p>
            </div>

            <div className="mt-4 hidden max-w-full items-center rounded-[30px] border border-glass-border bg-surface-50 px-4 py-2 shadow-glass backdrop-blur-xl sm:flex lg:ml-[2.5rem] lg:mr-10">
              <div className="flex flex-wrap items-center gap-2">
                {searchBarBadges.map((badgeLabel, index) => (
                  <div
                    key={`${badgeLabel}-${index}`}
                    className={searchBarBadgeClassName}
                  >
                    <span className="whitespace-normal break-words">
                      {badgeLabel}
                    </span>
                  </div>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/home")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 text-gray-400 transition-colors hover:bg-surface-300 hover:text-white"
                  aria-label="Clear search and go back"
                >
                  <HiOutlineX size={24} />
                </button>
                <HiOutlineSearch size={34} className="text-accent" />
              </div>
            </div>

            <div className="relative mt-6 lg:ml-[2.5rem] lg:mr-10">
              <div
                ref={dropdownContainerRef}
                className="relative z-30 flex w-full flex-col gap-4 sm:flex-row sm:items-stretch"
              >
                <DropdownBadge
                  label="Continent"
                  options={continentOptions}
                  selectedValue={selectedContinentDropdownValue}
                  isOpen={openDropdown === "continent"}
                  onToggle={() => handleDropdownToggle("continent")}
                  onSelect={handleContinentSelect}
                />

                <DropdownBadge
                  label={selectedGoal}
                  options={goalOptions}
                  selectedValue={selectedGoalOptionDropdownValue}
                  isOpen={openDropdown === "goalOption"}
                  onToggle={() => handleDropdownToggle("goalOption")}
                  onSelect={handleGoalOptionSelect}
                />
              </div>

              <div className="relative mt-8">
                <div className="relative z-10">
                  {shouldShowNarrative && (
                    <>
                      {/* <p className="text-sm font-medium leading-relaxed text-primary-blue lg:text-[0.9rem] font-play">
                        {typedBottomHeading}
                      </p> */}
                      <div className="mt-6 text-sm leading-relaxed text-gray-300 lg:text-[0.9rem] font-heading">
                        <span className="block font-bold">
                          {formattedNarrative.introLine}
                        </span>
                        {formattedNarrative.poweredByLine && (
                          <div className="mt-2">
                            <span>{formattedNarrative.poweredByLine}</span>
                            {(formattedNarrative.priorityPoints.length > 0 ||
                              formattedNarrative.additionalPriorityPointsText) && (
                              <span className="ml-1">
                                {formattedNarrative.priorityPoints.map(
                                  (point, index) => (
                                    <React.Fragment key={`${point}-${index}`}>
                                      <span>{point}</span>
                                      {index <
                                        formattedNarrative.priorityPoints
                                          .length -
                                          1 && <span>{", "}</span>}
                                    </React.Fragment>
                                  ),
                                )}

                                {formattedNarrative.additionalPriorityPointsText && (
                                  <span>
                                    {" "}
                                    {
                                      formattedNarrative.additionalPriorityPointsText
                                    }
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                          {(formattedNarrative.endingLine ||
                            !resultsHeadingBodyLines) && (
                            <span className="block font-medium">
                              {formattedNarrative.endingLine ||
                                highlightedResultsHeadingRemainingLines}
                            </span>
                          )}
                          {shouldShowResultsContent && isLoggedIn && (
                            <div className="flex w-full items-center justify-center gap-3 sm:justify-end lg:w-auto">
                              <span className="text-sm font-medium text-gray-400 font-heading">
                                Visa Options
                              </span>
                              <div className="w-[11rem] shrink-0 sm:w-[13rem]">
                                <DropdownBadge
                                  label="Visa Requirement"
                                  options={visaRequirementOptions}
                                  selectedValue={selectedVisaRequirement}
                                  isOpen={openDropdown === "visaRequirement"}
                                  onToggle={() =>
                                    handleDropdownToggle("visaRequirement")
                                  }
                                  onSelect={handleVisaRequirementSelect}
                                  size="small"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {shouldShowResultsContent ? (
                    <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
                      {visibleDestinations.map((destination, index) => {
                        const shouldShowVisaDuration =
                          isVisaRequirementFilterActive(
                            selectedVisaRequirement,
                          ) && Boolean(visaRuleDurationByCountry);
                        const visaDurationDays = shouldShowVisaDuration
                          ? visaRuleDurationByCountry.get(
                              normalizeCountryKey(destination.country),
                            )
                          : null;
                        const visaDurationLabel =
                          visaDurationDays !== null &&
                          visaDurationDays !== undefined
                            ? `${formatVisaRequirementLabel(
                                getVisaRequirementApiValue(
                                  selectedVisaRequirement,
                                ),
                              )}: ${visaDurationDays} days`
                            : null;

                        const isDestinationLiked = likedDestinations.includes(
                          getDestinationFavoriteKey(destination),
                        );

                        return (
                          <article
                            key={`${destination.city}-${destination.country}`}
                            className={`cursor-pointer transition-all duration-300 ${
                              index < visibleDestinationCount
                                ? "translate-y-0 opacity-100"
                                : "pointer-events-none translate-y-2 opacity-0"
                            }`}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleDestinationClick(destination)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                handleDestinationClick(destination);
                              }
                            }}
                          >
                            <div className="relative overflow-hidden rounded-xl md:rounded-2xl group">
                              <img
                                src={destination.image}
                                alt={`${destination.city}, ${destination.country}`}
                                className="aspect-square w-full rounded-xl object-cover md:rounded-2xl transition-transform duration-500 group-hover:scale-110"
                              />

                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/10" />

                              <div className="pointer-events-none absolute left-3 top-3 text-white text-xl  md:left-4 md:top-4 md:text-2xl">
                                #
                                {destination?.rankLabel
                                  ? destination.rankLabel.replace(
                                      /^Rank\s*/i,
                                      "",
                                    )
                                  : "—"}
                              </div>

                              <button
                                type="button"
                                className={`absolute right-3 top-3 z-30 cursor-pointer touch-manipulation md:right-4 md:top-4 ${
                                  isDestinationLiked
                                    ? ""
                                    : "[&_path]:transition-colors [&_path]:duration-200 [&:hover_path]:fill-[#ff8a8a]"
                                }`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  event.preventDefault();
                                  toggleDestinationLike(destination);
                                }}
                              >
                                {isDestinationLiked ? (
                                  <AiFillHeart className="text-xl text-[#ff5757] md:text-2xl" />
                                ) : (
                                  <AiTwotoneHeart className="text-xl text-[#b6b6b6] md:text-2xl" />
                                )}
                              </button>

                              <div className="pointer-events-none absolute inset-x-2 bottom-3 text-center text-white md:inset-x-4 md:bottom-4">
                                <h3 className="text-lg uppercase font-normal tracking-wide md:text-3xl">
                                  {destination.title}
                                  {/* {destination.displayCity || destination.city} */}
                                </h3>
                                <p className="text-sm font-light md:text-sm">
                                  {destination.displayCountry ||
                                    destination.country}
                                </p>
                              </div>

                              <div className="pointer-events-none absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center p-2 md:p-4">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                  <div className="mb-0 border-b border-white/30 pb-1">
                                    <p className="mb-1 text-center text-[0.55rem] font-medium uppercase tracking-wide text-white/85 sm:text-[0.65rem] md:text-base">
                                      {`${destination.title || destination.displayCity || destination.city} - ${
                                        destination.displayCountry ||
                                        destination.country
                                      }`.toUpperCase()}
                                    </p>

                                    <h4 className="text-center text-[0.7rem] font-semibold uppercase tracking-wide text-white sm:text-[0.8rem] md:text-[0.89rem]">
                                      {selectedGoalOption || "Attribute"}
                                    </h4>
                                  </div>
                                  <div className="mb-1 mt-1 flex items-center justify-between gap-1 py-0 text-[0.65rem] font-semibold text-white sm:text-xs md:mb-2 md:mt-2 md:gap-2 md:text-sm">
                                    <h4 className="text-left">
                                      {`${selectedContinentDisplay || "World"} Rank ${
                                        destination?.rankLabel
                                          ? destination.rankLabel.replace(
                                              /^Rank\s*/i,
                                              "",
                                            )
                                          : "—"
                                      }`}
                                    </h4>

                                    {shouldShowVisaDuration &&
                                      visaDurationLabel && (
                                        <span className="text-right text-[0.72rem] font-medium text-white/90">
                                          {visaDurationLabel}
                                        </span>
                                      )}
                                  </div>

                                  <div className="grid grid-cols-1 gap-1 md:gap-2 text-[0.6rem] sm:text-xs md:text-sm text-white/90">
                                    {getQuickStatsForDestination(
                                      destination,
                                      selectedGoal,
                                      selectedGoalOption,
                                    ).map((stat, statIndex) => (
                                      <div
                                        key={`${destination.city}-${stat.label}-${statIndex}`}
                                        className="rounded-lg px-2 py-[3px] md:py-1 transition-all duration-300"
                                        style={{
                                          backgroundImage: `linear-gradient(
                                          90deg,
                                          ${getScoreBarColorValue(stat.score)} 0%,
                                          ${getScoreBarColorValue(stat.score)} ${Math.max(
                                            0,
                                            Math.min(
                                              100,
                                              getScoreFillPercentage(
                                                stat.score,
                                              ),
                                            ),
                                          )}%,
                                          rgba(255, 255, 255, 0.16) ${Math.max(
                                            0,
                                            Math.min(
                                              100,
                                              getScoreFillPercentage(
                                                stat.score,
                                              ),
                                            ),
                                          )}%,
                                          rgba(255, 255, 255, 0.16) 100%
                                        )`,
                                        }}
                                      >
                                        <span className="font-light text-[0.6rem] sm:text-xs md:text-sm">
                                          {stat.label}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <div className="px-2">
                            <div className="mt-1.5 flex items-start justify-start gap-1 md:mt-2 md:gap-1 ">
                              <div className="min-w-0">
                                <h3 className="truncate text-[0.8rem] font-semibold leading-tight text-black/90 md:text-[1.2rem]">
                                  {`${destination.title || destination.displayCity || destination.city} - `}
                                </h3>
                              </div>

                              <p className="truncate text-[0.8rem] font-semibold leading-tight text-black/90  md:text-[1.2rem]">
                                {destination.displayCountry ||
                                  destination.country}
                              </p>
                            </div>
                            <div>
                              <p className="text-[0.82rem] text-black/60 md:text-[0.9rem]">
                                Click to view options
                              </p>
                            </div>
                          </div> */}
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      {/* <div className="mt-10 rounded-2xl border border-dashed border-glass-border bg-surface-50 px-6 py-10 text-center text-sm text-gray-400">
                      Results will appear here after you select both filters
                      above.
                    </div> */}
                    </>
                  )}

                  {shouldShowResultsContent && !rankedDestinations.length && (
                    <>
                      {isDestinationsLoading ? (
                        <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-glass-border bg-surface-50 px-6 py-10 text-center text-sm text-gray-400">
                          <FaSyncAlt className="text-xl text-accent animate-spin" />
                          <p>Loading destinations...</p>
                        </div>
                      ) : (
                        <div className="mt-10 rounded-2xl border border-dashed border-glass-border bg-surface-50 px-6 py-10 text-center text-sm text-gray-400">
                          No destinations are available for{" "}
                          {selectedContinentDisplay} right now.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiSearchResults;
