import * as yup from "yup";
import NewCompanySetup from "../models/NewCompanySetup.js";

const newCompanySetupSchema = yup.object({
  supportRequired: yup.string().required("Support required is required"),
  fullName: yup.string().required("Full name is required"),
  currentCompanyCountry: yup
    .string()
    .required("Current company country is required"),
  newCompanyCountry: yup.string().required("New company country is required"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email")
    .required("Email is required"),
  contactCode: yup.string().required("Contact code is required"),
  contactNumber: yup.string().required("Contact number is required"),
  comments: yup.string().trim().default(""),
});

export const createNewCompanySetup = async (req, res, next) => {
  try {
    const payload = await newCompanySetupSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const newCompanySetup = await NewCompanySetup.create(payload);

    return res.status(201).json({
      message: "New company setup request submitted successfully",
      data: newCompanySetup,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.errors[0] });
    }

    return next(error);
  }
};

export const getNewCompanySetupRequests = async (req, res, next) => {
  try {
    const requests = await NewCompanySetup.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "New company setup requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
};
