import * as yup from "yup";
import Workation from "../models/Workation.js";

const workationSchema = yup.object({
  noOfPeople: yup.string().required("Number of people is required"),
  fullName: yup.string().required("Full name is required"),
  companyName: yup.string().required("Company name is required"),
  companyWebsite: yup.string().required("Company website is required"),
  currentCountry: yup.string().required("Current country is required"),
  workationCountry: yup.string().required("Workation country is required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().required("End date is required"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email")
    .required("Email is required"),
  contactCode: yup.string().required("Contact code is required"),
  contactNumber: yup.string().required("Contact number is required"),
  comments: yup.string().trim().default(""),
});

export const createWorkation = async (req, res, next) => {
  try {
    const payload = await workationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const workation = await Workation.create(payload);

    return res.status(201).json({
      message: "Workation request submitted successfully",
      data: workation,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.errors[0] });
    }

    return next(error);
  }
};

export const getWorkationRequests = async (req, res, next) => {
  try {
    const requests = await Workation.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Workation requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
};
