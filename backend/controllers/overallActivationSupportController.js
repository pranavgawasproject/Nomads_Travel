import * as yup from "yup";
import OverallActivationSupport from "../models/OverallActivationSupport.js";

const overallActivationSupportSchema = yup.object({
  supportRequired: yup.string().required("Support required is required"),
  fullName: yup.string().required("Full name is required"),
  nationalityOnPassport: yup
    .string()
    .required("Nationality on passport is required"),
  travelCountry: yup.string().required("Travel country is required"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email")
    .required("Email is required"),
  contactCode: yup.string().required("Contact code is required"),
  contactNumber: yup.string().required("Contact number is required"),
  comments: yup.string().trim().default(""),
});

export const createOverallActivationSupport = async (req, res, next) => {
  try {
    const payload = await overallActivationSupportSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const overallActivationSupport =
      await OverallActivationSupport.create(payload);

    return res.status(201).json({
      message: "Overall activation support request submitted successfully",
      data: overallActivationSupport,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.errors[0] });
    }

    return next(error);
  }
};

export const getOverallActivationSupportRequests = async (req, res, next) => {
  try {
    const requests = await OverallActivationSupport.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Overall activation support requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
};
