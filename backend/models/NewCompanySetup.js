import mongoose from "mongoose";

const newCompanySetupSchema = new mongoose.Schema(
    {
        supportRequired: { type: String, trim: true, default: "" },
        fullName: { type: String, trim: true, required: true },
        currentCompanyCountry: { type: String, trim: true, default: "" },
        newCompanyCountry: { type: String, trim: true, default: "" },
        email: { type: String, trim: true, lowercase: true, required: true },
        contactCode: { type: String, trim: true, default: "" },
        contactNumber: { type: String, trim: true, required: true },
        comments: { type: String, trim: true, default: "" },
    },
    { timestamps: true },
);

export default mongoose.model("NewCompanySetup", newCompanySetupSchema);