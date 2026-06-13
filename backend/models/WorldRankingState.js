import mongoose from "mongoose";

const worldRankingWeightsSchema = new mongoose.Schema(
  {
    workInfrastructure: { type: Number, default: 0.2 },
    internet: { type: Number, default: 0.15 },
    costOfLiving: { type: Number, default: 0.2 },
    safety: { type: Number, default: 0.1 },
    visaFlexibility: { type: Number, default: 0.1 },
    nomadCommunity: { type: Number, default: 0.15 },
    healthcareCostIndex: { type: Number, default: 0.05 },
    startupEcosystemScore: { type: Number, default: 0.03 },
    airQualityIndex: { type: Number, default: 0.02 },
  },
  { _id: false },
);

const worldRankingStateSchema = new mongoose.Schema(
  {
    rank: { type: Number, required: true },
    continent: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    scores: {
      workInfrastructure: { type: Number, required: true },
      internet: { type: Number, required: true },
      costOfLiving: { type: Number, required: true },
      safety: { type: Number, required: true },
      visaFlexibility: { type: Number, required: true },
      nomadCommunity: { type: Number, required: true },
      healthcareCostIndex: { type: Number, required: true },
      startupEcosystemScore: { type: Number, required: true },
      airQualityIndex: { type: Number, required: true },
    },
    overallScore: { type: Number, required: true },
    weights: { type: worldRankingWeightsSchema, default: () => ({}) },
  },
  { timestamps: true },
);

worldRankingStateSchema.index({ country: 1, destination: 1 }, { unique: true });
worldRankingStateSchema.index({ continent: 1 });
worldRankingStateSchema.index({ rank: 1 });

const WorldRankingState = mongoose.model(
  "WorldRankingState",
  worldRankingStateSchema,
);

export default WorldRankingState;
