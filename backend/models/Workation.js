import mongoose from "mongoose";

const workationSchema = new mongoose.Schema(
    {
        noOfPeople: { type: String, trim: true, default: "" },
        fullName: { type: String, trim: true, required: true },
        companyName: { type: String, trim: true, default: "" },
        companyWebsite: { type: String, trim: true, default: "" },
        currentCountry: { type: String, trim: true, default: "" },
        workationCountry: { type: String, trim: true, default: "" },
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
        email: { type: String, trim: true, lowercase: true, required: true },
        contactCode: { type: String, trim: true, default: "" },
        contactNumber: { type: String, trim: true, required: true },
        comments: { type: String, trim: true, default: "" },
    },
    { timestamps: true },
);

export default mongoose.model("Workation", workationSchema);