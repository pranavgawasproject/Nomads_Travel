import mongoose from "mongoose";

const stateWiseWeightSchema = new mongoose.Schema(
  {
    continent: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },

    rank: {
      type: Number,
      required: true,
    },

    images: {
      type: Map,
      of: new mongoose.Schema(
        {
          url: { type: String, required: true },
          s3Key: { type: String, required: false },
        },
        { _id: false },
      ),
      default: {},
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value.size <= 5;
        },
        message: "A maximum of 5 images is allowed.",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    labels: {
      labelBestForNomads: { type: String, required: true },
      labelMostAffordable: { type: String, required: true },
      labelSafestCities: { type: String, required: true },
      labelEasyVisa: { type: String, required: true },
      labelStrongNomadCommunity: { type: String, required: true },
      labelHealthcareFriendly: { type: String, required: true },
      labelStartupBusinessOpportunities: { type: String, required: true },
      labelCleanAirEnvironment: { type: String, required: true },
      labelBestWorkInfrastructure: { type: String, required: true },
      labelCheapestPlaces: { type: String, required: true },
      labelBestForRemoteWorkSetup: { type: String, required: true },
      labelBestConnectedCitiesFlights: { type: String, required: true },
      labelStrongNomadCommunityWfa: { type: String, required: true },
      labelFastInternetCities: { type: String, required: true },
      labelBestWorkInfrastructureWfa: { type: String, required: true },
      labelMaximumSavings: { type: String, required: true },
      labelLowTaxation: { type: String, required: true },
      labelPurchasingPower: { type: String, required: true },
      labelFinancialStability: { type: String, required: true },
      labelStartupSetupCost: { type: String, required: true },
      labelBalancedFinancialLifestyle: { type: String, required: true },
      labelSocialPartyLifestyle: { type: String, required: true },
      labelChillWellnessLifestyle: { type: String, required: true },
      labelAdventureExploration: { type: String, required: true },
      labelNomadCommunityNetworking: { type: String, required: true },
      labelCoupleFriendlyLifestyle: { type: String, required: true },
      labelFamilyFriendlyLifestyle: { type: String, required: true },
      labelFemaleFriendlyLifestyle: { type: String, required: true },
      labelFounderNomads: { type: String, required: true },
      labelSoloNomads: { type: String, required: true },
      labelStartupEcosystems: { type: String, required: true },
      labelRemoteJobOpportunities: { type: String, required: true },
      labelFounderNomadsAyc: { type: String, required: true },
      labelTechTalentDensity: { type: String, required: true },
      labelStartupIncubatorsAccelerators: { type: String, required: true },
      labelBalancedCareerGrowth: { type: String, required: true },
      labelVentureCapitalPresence: { type: String, required: true },
      labelConferencesEvents: { type: String, required: true },
    },

    weight: {
      // Core Infra
      workInfrastructure: { type: Number, default: 0, required: true },
      internet: { type: Number, default: 0, required: true },
      costOfLiving: { type: Number, default: 0, required: true },
      safety: { type: Number, default: 0, required: true },
      visaFlexibility: { type: Number, default: 0, required: true },
      visaCost: { type: Number, default: 0, required: true },
      visaRenewalEase: { type: Number, default: 0, required: true },
      medicalInsuranceEase: { type: Number, default: 0, required: true },
      internalCommuting: { type: Number, default: 0, required: true },
      nomadCommunity: { type: Number, default: 0, required: true },
      healthcareCostIndex: { type: Number, default: 0, required: true },
      startupEcosystemScore: { type: Number, default: 0, required: true },
      airQualityIndex: { type: Number, default: 0, required: true },

      // Connectivity
      airportConnectivity: { type: Number, default: 0, required: true },
      directInternationalFlights: { type: Number, default: 0, required: true },

      // Financial
      taxFriendly: { type: Number, default: 0, required: true },
      purchasingPower: { type: Number, default: 0, required: true },
      inflationStability: { type: Number, default: 0, required: true },
      startupSetupCost: { type: Number, default: 0, required: true },

      // Lifestyle
      partyLifestyle: { type: Number, default: 0, required: true },
      nightlife: { type: Number, default: 0, required: true },
      meetupsEvents: { type: Number, default: 0, required: true },
      soloNomad: { type: Number, default: 0, required: true },
      coupleNomads: { type: Number, default: 0, required: true },
      femaleNomads: { type: Number, default: 0, required: true },
      familyNomads: { type: Number, default: 0, required: true },
      founderNomads: { type: Number, default: 0, required: true },
      yoga: { type: Number, default: 0, required: true },
      nature: { type: Number, default: 0, required: true },
      adventure: { type: Number, default: 0, required: true },

      // Career / Startup
      ventureCapital: { type: Number, default: 0, required: true },
      localGovernmentSupport: { type: Number, default: 0, required: true },
      ventureCapitalInvestments: { type: Number, default: 0, required: true },
      governmentStartupEvents: { type: Number, default: 0, required: true },
      incubators: { type: Number, default: 0, required: true },
      techTalentDensity: { type: Number, default: 0, required: true },
      conferences: { type: Number, default: 0, required: true },
      remoteJobs: { type: Number, default: 0, required: true },

      // others
      qualityOfLife: { type: Number, default: 0, required: true },
      lifestyleEntertainment: { type: Number, default: 0, required: true },
      climateEnvironment: { type: Number, default: 0, required: true },
      accessibility: { type: Number, default: 0, required: true },
    },
  },
  { timestamps: true },
);

export default mongoose.model("StateWiseWeight", stateWiseWeightSchema);
