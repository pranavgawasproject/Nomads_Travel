import * as yup from "yup";
import BecomeContributor from "../models/BecomeContributor.js";

const becomeContributorSchema = yup.object({
  contributionType: yup.string().required("Contribution type is required"),
  fullName: yup.string().required("Full name is required"),
  currentCountry: yup.string().required("Current country is required"),
  linkedinProfile: yup.string().required("Linkedin profile is required"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email")
    .required("Email is required"),
  contactCode: yup.string().required("Contact code is required"),
  contactNumber: yup.string().required("Contact number is required"),
  message: yup.string().trim().default(""),
});

export const createBecomeContributor = async (req, res, next) => {
  try {
    const payload = await becomeContributorSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const becomeContributor = await BecomeContributor.create(payload);

    return res.status(201).json({
      message: "Become contributor request submitted successfully",
      data: becomeContributor,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.errors[0] });
    }

    return next(error);
  }
};

export const getBecomeContributorRequests = async (req, res, next) => {
  try {
    const requests = await BecomeContributor.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Become contributor requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
};
