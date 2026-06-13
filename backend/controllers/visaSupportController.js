import * as yup from "yup";
import VisaSupport from "../models/VisaSupport.js";

const visaSupportSchema = yup.object({
  visaType: yup.string().trim().required("Visa type is required"),
  fullName: yup.string().trim().required("Full name is required"),
  nationality: yup.string().trim().required("Nationality is required"),
  travellingCountry: yup
    .string()
    .trim()
    .required("Travelling country is required"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email")
    .required("Email is required"),
  contactCode: yup.string().trim().required("Contact code is required"),
  contactNumber: yup.string().trim().required("Contact number is required"),
  comments: yup.string().trim().default(""),
});

export const createVisaSupport = async (req, res, next) => {
  try {
    const payload = await visaSupportSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const visaSupport = await VisaSupport.create(payload);

    return res.status(201).json({
      message: "Visa support request submitted successfully",
      data: visaSupport,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.errors[0] });
    }

    return next(error);
  }
};

export const getVisaSupportRequests = async (req, res, next) => {
  try {
    const requests = await VisaSupport.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Visa support requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
};
