import mongoose from "mongoose";

const visaRuleSchema = new mongoose.Schema(
  {
    passport: { type: String, required: true, trim: true },
    normalizedPassport: { type: String, trim: true, default: "" },
    destination: { type: String, required: true, trim: true },
    normalizedDestination: { type: String, trim: true, default: "" },
    requirement: { type: String, trim: true, default: "" },
    durationDays: { type: Number, default: null },
  },
  { timestamps: true },
);

visaRuleSchema.index({ passport: 1, destination: 1 }, { unique: true });
visaRuleSchema.index({ normalizedPassport: 1, normalizedDestination: 1 });
visaRuleSchema.index({ normalizedPassport: 1, requirement: 1 });
visaRuleSchema.index({ passport: 1, requirement: 1 });
visaRuleSchema.index({ destination: 1 });

const VisaRule = mongoose.model("VisaRule", visaRuleSchema);

export default VisaRule;
