import mongoose from "mongoose";

const visaSupportSchema = new mongoose.Schema(
    {
        visaType: { type: String, trim: true, default: "" },
        fullName: { type: String, trim: true, required: true },
        nationality: { type: String, trim: true, default: "" },
        travellingCountry: { type: String, trim: true, default: "" },
        email: { type: String, trim: true, lowercase: true, required: true },
        contactCode: { type: String, trim: true, default: "" },
        contactNumber: { type: String, trim: true, required: true },
        comments: { type: String, trim: true, default: "" },
    },
    { timestamps: true },
);

export default mongoose.model("VisaSupport", visaSupportSchema);