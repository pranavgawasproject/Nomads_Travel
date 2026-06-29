import * as yup from "yup";
import Lead from "../../models/Lead.js";
import mongoose from "mongoose";
import { sendMail, sendAdminFormNotification } from "../../config/mailer.js"; // adjust path if different
import User from "../../models/NomadUser.js";
import NomadUser from "../../models/NomadUser.js";
import VisaSupport from "../../models/VisaSupport.js";
import OverallActivationSupport from "../../models/OverallActivationSupport.js";
import NewCompanySetup from "../../models/NewCompanySetup.js";
import Consultation from "../../models/Consultation.js";
import Workation from "../../models/Workation.js";
import BecomeContributor from "../../models/BecomeContributor.js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { uploadFileToS3 } from "../../config/s3Config.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";

function istNowPieces() {
  const tz = "Asia/Kolkata";
  const now = new Date();
  const submissionDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const submissionTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(now)
    .replace(/\u202F/g, "");
  return { submissionDate, submissionTime };
}

const jobApplicationSchema = yup.object({
  jobPosition: yup.string().trim().required("Job Position is required"),
  name: yup.string().trim().required("Name is required"),
  email: yup.string().trim().email().required("Valid email is required"),
  dob: yup
    .string()
    .trim()
    .nullable()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "DOB must be YYYY-MM-DD")
    .optional(),
  mobile: yup
    .string()
    .trim()
    .required("Mobile Number is required")
    .test(
      "is-valid-phone",
      "Please provide a valid phone number",
      function (value) {
        if (!value) return false;
        try {
          const number = parsePhoneNumberFromString(value);
          if (!number?.isValid()) return false;

          // store the normalized version on the validated data
          this.parent.mobile = number.number;
          return true;
        } catch {
          return false;
        }
      },
    ),
  // .matches(/^[0-9+\-\s()]{8,20}$/, "Invalid mobile number"),
  location: yup.string().trim().required("Location is required"),
  experienceYears: yup
    .number()
    .typeError("Experience (in years) must be a number")
    .min(0)
    .max(60)
    .required("Experience (in years) is required"),
  linkedin: yup.string().trim().url().nullable(),
  currentMonthlySalary: yup
    .number()
    .typeError("Current Monthly Salary must be a number")
    .min(0)
    .nullable(),
  expectedMonthlySalary: yup
    .number()
    .typeError("Expected Monthly Salary must be a number")
    .min(0)
    .nullable(),
  joinInDays: yup.string().trim().required("Join-in days is required"),
  relocateGoa: yup
    .string()
    .trim()
    .oneOf(["Yes", "No"], "Relocate must be 'Yes' or 'No'")
    .required("Relocate to Goa is required"),
  personality: yup.string().trim().required("Tell us about yourself"),
  skills: yup.string().trim().required("Skills are required"),
  whyConsider: yup.string().trim().required("Why should we consider you?"),
  willingToBootstrap: yup.string().trim().required("Willing to bootstrap?"),
  message: yup.string().trim().nullable(),
  remarks: yup.string().trim().nullable(),
  sheetName: yup.string().required("Please provide a sheet name"),
});

const enquirySchema = yup.object({
  companyName: yup.string().trim().required("Please provide the company name"),
  companyType: yup.string().trim().required("Please provide the company type"),
  fullName: yup
    .string()
    .trim()
    .min(1, "Please provide a valid name")
    .required("Please provide your full name"),
  personelCount: yup
    .number()
    .typeError("Personnel count must be a number")
    .integer("Personnel count must be an integer")
    .min(1, "Personnel count must be at least 1")
    .required("Please provide the personnel count"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email address")
    .required("Please provide your email"),
  phone: yup
    .string()
    .trim()
    .test(
      "is-valid-phone",
      "Please provide a valid phone number",
      function (value) {
        if (!value) return false;
        try {
          const number = parsePhoneNumberFromString(value);
          if (!number?.isValid()) return false;

          // store the normalized version on the validated data
          this.parent.phone = number.number;
          return true;
        } catch {
          return false;
        }
      },
    )
    // .matches(/^\+?[0-9]{7,15}$/, "Please provide a valid phone number")
    .required("Please provide your phone number"),
  startDate: yup
    .date()
    .typeError("Please provide a valid start date")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Start date cannot be in the past",
    )
    .required("Please provide the start date"),
  endDate: yup
    .date()
    .typeError("Please provide a valid end date")
    .min(yup.ref("startDate"), "End date cannot be before the start date")
    .required("Please provide the end date"),
  source: yup
    .string()
    .trim()
    .oneOf(["nomad", "website"], "Source must be either 'nomad' or 'website'")
    .required("Please provide the source"),
  productType: yup
    .string()
    .trim()
    .min(1, "Please provide a valid the product type")
    .required("Please provide the product type"),
  country: yup.string().trim().nullable(),
  state: yup.string().trim().nullable(),
  sheetName: yup.string().required("Please provide a sheet name"),
});

const pocSchema = yup.object().shape({
  pocName: yup
    .string()
    .min(1, "Please provide a valid name")
    .required("Please provide the POC name"),
  pocCompany: yup.string().required("Please provide the POC company name"),
  pocDesignation: yup.string().required("Please provide the POC designation"),
  fullName: yup.string().required("Please provide your full name"),
  mobile: yup
    .string()
    .trim()
    .test(
      "is-valid-phone",
      "Please provide a valid phone number",
      function (value) {
        if (!value) return false;
        try {
          const number = parsePhoneNumberFromString(value);
          if (!number?.isValid()) return false;

          // store the normalized version on the validated data
          this.parent.mobile = number.number;
          return true;
        } catch {
          return false;
        }
      },
    )
    // .matches(/^\+?[0-9]{7,15}$/, "Please provide a valid mobile number")
    .required("Please provide the mobile"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email address")
    .required("Please provide your email"),
  sheetName: yup.string().required("Please provide a sheet name"),
});

const connectWithUsSchema = yup.object().shape({
  name: yup
    .string()
    .min(1, "Please provide your valid full name.")
    .required("Please provide your full name."),
  email: yup
    .string()
    .email("Please provide a valid email.")
    .required("Please provide your email."),
  mobile: yup
    .string()
    .trim()
    .required("Please provide the mobile")
    .test(
      "is-valid-phone",
      "Please provide a valid phone number",
      function (value) {
        if (!value) return false;
        try {
          const number = parsePhoneNumberFromString(value);
          if (!number?.isValid()) return false;

          // store the normalized version on the validated data
          this.parent.mobile = number.number;
          return true;
        } catch {
          return false;
        }
      },
    ),
  typeOfPartnerShip: yup
    .string()
    .required("Please provide the type of partnership."),
  message: yup.string().required("Please provide a brief messsage."),
  sheetName: yup.string().required("Please provide a sheet name"),
});

const nomadsSignupSchema = yup
  .object()
  .shape({
    fullName: yup.string().trim().required("Full name is required"),
    countryOfResidence: yup.string().trim().optional(),
    country: yup.string().trim().optional(),
    email: yup
      .string()
      .email("Please provide a valid email")
      .required("Please provide your email"),
    password: yup.string().optional(),
    mobile: yup
      .string()
      .trim()
      .required("Please provide the mobile")
      .test(
        "is-valid-phone",
        "Please provide a valid phone number",
        function (value) {
          if (!value) return false;
          try {
            const number = parsePhoneNumberFromString(value);
            if (!number?.isValid()) return false;

            // store the normalized version on the validated data
            this.parent.mobile = number.number;
            return true;
          } catch {
            return false;
          }
        },
      ),
    sheetName: yup.string().required("Please provide a sheet name"),
  })
  .test(
    "name-present",
    "Please provide your full name or first and last name",
    (value) => {
      const hasFullName = Boolean(value?.fullName?.trim());
      const hasFirstAndLast = Boolean(value?.fullName?.trim());

      return hasFullName || hasFirstAndLast;
    },
  );

const contentRemovalRequestsSchema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .min(1, "Please provide a valid full name")
    .required("Please provide your full name"),
  mobile: yup
    .string()
    .trim()
    .test(
      "is-valid-phone",
      "Please provide a valid phone number",
      function (value) {
        if (!value) return false;
        try {
          const number = parsePhoneNumberFromString(value);
          if (!number?.isValid()) return false;

          // store the normalized version on the validated data
          this.parent.mobile = number.number;
          return true;
        } catch {
          return false;
        }
      },
    )
    // .matches(/^\+?[0-9]{7,15}$/, "Please provide a valid mobile number")
    .required("Please provide the mobile number"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email address")
    .required("Please provide your email address"),
  companyName: yup.string().trim().required("Please provide the company name"),
  designation: yup.string().trim().required("Please provide your designation"),
  urls: yup
    .string()
    .trim()
    .required("Please provide the URLs or links for content removal"),
  source: yup
    .string()
    .trim()
    .oneOf(["nomad", "host"], "Source must be either 'nomad' or 'host'")
    .required("Please provide the Source"),
  sheetName: yup.string().required("Please provide a sheet name"),
});

const aiVisaSupportSchema = yup.object({
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
    .email("Please provide a valid email address")
    .required("Please provide your email address"),
  contactCode: yup.string().trim().required("Contact code is required"),
  contactNumber: yup.string().trim().required("Contact number is required"),
  comments: yup.string().trim().nullable(),
  sheetName: yup.string().required("Please provide a sheet name"),
});

const aiOverallActivationSupportSchema = yup.object({
  supportRequired: yup.string().trim().required("Support required is required"),
  fullName: yup.string().trim().required("Full name is required"),
  nationalityOnPassport: yup
    .string()
    .trim()
    .required("Nationality on passport is required"),
  travelCountry: yup.string().trim().required("Travel country is required"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email address")
    .required("Please provide your email address"),
  contactCode: yup.string().trim().required("Contact code is required"),
  contactNumber: yup.string().trim().required("Contact number is required"),
  comments: yup.string().trim().nullable(),
  sheetName: yup.string().required("Please provide a sheet name"),
});

const aiNewCompanySetupSchema = yup.object({
  supportRequired: yup.string().trim().required("Support required is required"),
  fullName: yup.string().trim().required("Full name is required"),
  currentCompanyCountry: yup
    .string()
    .trim()
    .required("Current company country is required"),
  newCompanyCountry: yup
    .string()
    .trim()
    .required("New company country is required"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email address")
    .required("Please provide your email address"),
  contactCode: yup.string().trim().required("Contact code is required"),
  contactNumber: yup.string().trim().required("Contact number is required"),
  comments: yup.string().trim().nullable(),
  sheetName: yup.string().required("Please provide a sheet name"),
});

const aiConsultationSchema = yup.object({
  supportRequired: yup.string().trim().required("Support required is required"),
  fullName: yup.string().trim().required("Full name is required"),
  currentCountry: yup.string().trim().required("Current country is required"),
  consultationCountry: yup
    .string()
    .trim()
    .required("Consultation country is required"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email address")
    .required("Please provide your email address"),
  contactCode: yup.string().trim().required("Contact code is required"),
  contactNumber: yup.string().trim().required("Contact number is required"),
  comments: yup.string().trim().nullable(),
  sheetName: yup.string().required("Please provide a sheet name"),
});

const aiWorkationSchema = yup.object({
  noOfPeople: yup.string().trim().required("Number of people is required"),
  fullName: yup.string().trim().required("Full name is required"),
  companyName: yup.string().trim().required("Company name is required"),
  companyWebsite: yup.string().trim().required("Company website is required"),
  currentCountry: yup.string().trim().required("Current country is required"),
  workationCountry: yup
    .string()
    .trim()
    .required("Workation country is required"),
  startDate: yup.string().trim().required("Start date is required"),
  endDate: yup.string().trim().required("End date is required"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email address")
    .required("Please provide your email address"),
  contactCode: yup.string().trim().required("Contact code is required"),
  contactNumber: yup.string().trim().required("Contact number is required"),
  comments: yup.string().trim().nullable(),
  sheetName: yup.string().required("Please provide a sheet name"),
});

const aiBecomeContributorSchema = yup.object({
  contributionType: yup
    .string()
    .trim()
    .required("Contribution type is required"),
  fullName: yup.string().trim().required("Full name is required"),
  currentCountry: yup.string().trim().required("Current country is required"),
  linkedinProfile: yup.string().trim().required("Linkedin profile is required"),
  email: yup
    .string()
    .trim()
    .email("Please provide a valid email address")
    .required("Please provide your email address"),
  contactCode: yup.string().trim().required("Contact code is required"),
  contactNumber: yup.string().trim().required("Contact number is required"),
  message: yup.string().trim().nullable(),
  sheetName: yup.string().required("Please provide a sheet name"),
});

function toISODateOnly(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const addB2CformSubmission = async (req, res, next) => {
  try {
    const { B2C_APPS_SCRIPT_URL } = process.env;
    if (!B2C_APPS_SCRIPT_URL) {
      throw new Error("B2C_APPS_SCRIPT_URL is not configured");
    }

    const { sheetName } = req.body;
    const isJobApp = sheetName === "Job_Application";

    if (isJobApp) {
      const payload = await jobApplicationSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      const { submissionDate, submissionTime } = istNowPieces();

      if (!req.file) {
        return res.status(400).json({
          message: "Please upload your resume before submitting.",
        });
      }

      const data = await uploadFileToS3(
        `job-applications/${payload.jobPosition}/${
          payload.name
        }_${randomUUID()}/${req.file.originalname}`,
        req.file,
      );
      const resumeLink = data.url;

      // Post to Google Apps Script
      const apsBody = {
        formName: "jobApplication",
        ...payload,
        submissionDate,
        submissionTime,
        resumeLink,
      };

      const resp = await fetch(B2C_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apsBody),
      });

      const result = await resp.text();
      try {
        const json = JSON.parse(result);
        if (json.status !== "success")
          throw new Error(json.message || "Failed to save job application");

        await sendMail({
          to: payload.email,
          subject: `Application Received for ${payload.jobPosition}`,
          text: `Hi ${payload.name}, your application for ${payload.jobPosition} has been received.`,
          html: `
            <h2>Application Received</h2>
            <p>Hi ${payload.name},</p>
            <p>Thank you for applying for the position of <b>${payload.jobPosition}</b>.</p>
            <p>Our HR team will review your profile and get back to you soon.</p>
             <p>Cheers,<br/>The RoamIQ Team</p>
          `,
        });

        await sendAdminFormNotification({
          subject: "New job application submitted",
          formName: sheetName,
          data: apsBody,
        });

        return res.status(201).json({
          status: "success",
          message: "Job application submitted successfully",
          submissionDate,
          submissionTime,
        });
      } catch {
        throw new Error(result || "Upstream script error");
      }
    }

    const {
      companyName,
      companyId,
      company,
      companyType,
      country,
      state,
      fullName,
      personelCount,
      phone,
      email,
      source,
      productType,
      startDate,
      endDate,
      name,
    } = req.body;
    // Configuration for each sheet type
    const sheetConfig = {
      All_Enquiry: {
        schema: enquirySchema,
        map: (d) => ({
          companyName: d.companyName,
          verticalType: d.companyType,
          country: d.country || "",
          state: d.state || "",
          fullName: d.fullName,
          noOfPeople: d.personelCount,
          mobileNumber: d.phone,
          email: d.email,
          startDate: toISODateOnly(d.startDate),
          endDate: toISODateOnly(d.endDate),
          source: d.source,
          productType: d.productType,
          sheetName: d.sheetName,
        }),
        successMsg: "Your enquiry has been sent.",
        emailTemplate: (data) => ({
          to: data.email,
          subject: "Your enquiry has been received",
          text: `Hi ${data.fullName}, your enquiry has been sent to the company successfully.`,
          html: `
        <h2>Thank you for your enquiry</h2>
        <p>Hi ${data.fullName},</p>
        <p>Your enquiry for <b>${data.companyName}</b> has been successfully submitted. Our team will reach out shortly.</p>
        <p>Cheers,<br/>The RoamIQ Team</p>
      `,
        }),
      },
      All_POC_Contact: {
        schema: pocSchema,
        map: (d) => ({
          pocName: d.pocName,
          pocCompany: d.pocCompany,
          pocDesignation: d.pocDesignation,
          fullName: d.fullName,
          mobile: d.mobile,
          email: d.email,
          sheetName: d.sheetName,
        }),
        successMsg: "Message sent successfully",
        emailTemplate: (data) => ({
          to: data.email,
          subject: "Your POC request has been sent",
          text: `Hi ${data.fullName}, your POC contact request has been shared.`,
          html: `
        <h2>POC Contacted</h2>
        <p>Hi ${data.fullName},</p>
        <p>Your request to connect with <b>${data.pocName}</b> (${data.pocDesignation} at ${data.pocCompany}) has been submitted successfully.</p>
        <p>They will reach out to you soon.</p>
        <p>Cheers,<br/>The RoamIQ Team</p>
      `,
        }),
      },
      Connect_with_us: {
        schema: connectWithUsSchema,
        map: (d) => ({
          name: d.name,
          email: d.email,
          mobile: d.mobile,
          typeOfPartnerShip: d.typeOfPartnerShip,
          message: d.message,
          sheetName: d.sheetName,
        }),
        successMsg: "A new contact enquiry added successfully.",
        emailTemplate: (d) => ({
          to: d.email,
          subject: "We Received Your Message",
          html: `
        <h2>Thank You For Connecting</h2>
        <p>Hi ${d.name},</p>
        <p>We’ve received your message regarding <b>${d.typeOfPartnerShip}</b>.</p>
        <p>Our team will respond shortly.</p>
        <p>Cheers,<br/>The RoamIQ Team</p>
      `,
        }),
      },
      Sign_up: {
        schema: nomadsSignupSchema,
        map: (d) => {
          const parsedMobile = parsePhoneNumberFromString(d.mobile || "");
          const contactCode = parsedMobile?.countryCallingCode
            ? `+${parsedMobile.countryCallingCode}`
            : "";
          const contactNumber = parsedMobile?.nationalNumber || "";
          const normalizedFullName =
            d.fullName?.trim() ||
            `${d.firstName || ""} ${d.lastName || ""}`.trim();
          return {
            fullName: normalizedFullName,
            countryOfResidence:
              d.countryOfResidence?.trim() || d.country?.trim() || "",
            country: d.countryOfResidence?.trim() || d.country?.trim() || "",
            email: d.email?.trim(),
            password: d.password,
            contactCode: contactCode,
            contactNumber: contactNumber,
            sheetName: d.sheetName,
            submittedAt: new Date(),
          };
        },
        successMsg: "Sign-up saved successfully.",
        emailTemplate: (data) => ({
          to: data.email,
          subject: "Welcome to RoamIQ",
          text: `Hi ${data.fullName}, welcome to RoamIQ! Your signup was successful.`,
          html: `
      <h2>Welcome to RoamIQ!</h2>
      <p>Hi ${data.fullName},</p>
      <p>Thank you for signing up with <b>RoamIQ</b>.</p>
      <p>We’re excited to have you onboard! Our team will review your profile and connect with you shortly to complete the onboarding process.</p>
      <p>Cheers,<br/>The RoamIQ Team</p>
    `,
        }),
      },
      Content_Removal_Requests: {
        schema: contentRemovalRequestsSchema,
        map: (d) => ({
          fullName: d.fullName,
          mobile: d.mobile,
          email: d.email,
          companyName: d.companyName,
          designation: d.designation,
          urls: d.urls,
          source: d.source,
          sheetName: d.sheetName,
          submittedAt: new Date(),
        }),
        successMsg:
          "Your content removal request has been submitted successfully.",
        emailTemplate: (data) => ({
          to: data.email,
          subject: "Content Removal Request Received",
          text: `Hi ${data.fullName}, we’ve received your content removal request for ${data.companyName}. Our moderation team will review it shortly.`,
          html: `
      <h2>Content Removal Request Received</h2>
      <p>Hi ${data.fullName},</p>
      <p>We’ve received your content removal request for <b>${data.companyName}</b>.</p>
      <p>Our team will review the provided URLs and take the necessary action.</p>
      <p>We’ll get back to you via email if we need additional details.</p>
      <p>Cheers,<br/>The RoamIQ Team</p>
   `,
        }),
      },
      AI_Visa_Support: {
        schema: aiVisaSupportSchema,
        map: (d) => ({
          visaType: d.visaType,
          fullName: d.fullName,
          nationality: d.nationality,
          travellingCountry: d.travellingCountry,
          email: d.email,
          contactCode: d.contactCode,
          contactNumber: d.contactNumber,
          comments: d.comments || "",
          sheetName: d.sheetName,
          submittedAt: new Date(),
        }),
        successMsg:
          "Your visa support request has been submitted successfully.",
        emailTemplate: (data) => ({
          to: data.email,
          subject: "Visa Support Request Received",
          text: `Hi ${data.fullName}, we have received your visa support request for ${data.travellingCountry}.`,
          html: `
      <h2>Visa Support Request Received</h2>
      <p>Hi ${data.fullName},</p>
      <p>Thank you for your request for <b>${data.travellingCountry}</b>.</p>
      <p>Our team has received your details and will get back to you shortly with the next steps.</p>
      <p>Cheers,<br/>The RoamIQ Team</p>
          `,
        }),
      },
      AI_Overall_Activation_Support: {
        schema: aiOverallActivationSupportSchema,
        map: (d) => ({
          supportRequired: d.supportRequired,
          fullName: d.fullName,
          nationalityOnPassport: d.nationalityOnPassport,
          travelCountry: d.travelCountry,
          email: d.email,
          contactCode: d.contactCode,
          contactNumber: d.contactNumber,
          comments: d.comments || "",
          sheetName: d.sheetName,
          submittedAt: new Date(),
        }),
        successMsg:
          "Your overall activation support request has been submitted successfully.",
        emailTemplate: (data) => ({
          to: data.email,
          subject: "Overall Activation Support Request Received",
          text: `Hi ${data.fullName}, we have received your activation support request for ${data.travelCountry}.`,
          html: `
      <h2>Overall Activation Support Request Received</h2>
      <p>Hi ${data.fullName},</p>
      <p>Thank you for your request for <b>${data.travelCountry}</b>.</p>
      <p>Our team has received your details and will get back to you shortly.</p>
      <p>Cheers,<br/>The RoamIQ Team</p>
    `,
        }),
      },
      AI_New_Company_Setup: {
        schema: aiNewCompanySetupSchema,
        map: (d) => ({
          supportRequired: d.supportRequired,
          fullName: d.fullName,
          currentCompanyCountry: d.currentCompanyCountry,
          newCompanyCountry: d.newCompanyCountry,
          email: d.email,
          contactCode: d.contactCode,
          contactNumber: d.contactNumber,
          comments: d.comments || "",
          sheetName: d.sheetName,
          submittedAt: new Date(),
        }),
        successMsg:
          "Your new company setup request has been submitted successfully.",
        emailTemplate: (data) => ({
          to: data.email,
          subject: "New Company Setup Request Received",
          text: `Hi ${data.fullName}, we have received your new company setup request for ${data.newCompanyCountry}.`,
          html: `
      <h2>New Company Setup Request Received</h2>
      <p>Hi ${data.fullName},</p>
      <p>Thank you for your request to setup in <b>${data.newCompanyCountry}</b>.</p>
      <p>Our team has received your details and will get back to you shortly.</p>
      <p>Cheers,<br/>The RoamIQ Team</p>
    `,
        }),
      },
      AI_Consultation: {
        schema: aiConsultationSchema,
        map: (d) => ({
          supportRequired: d.supportRequired,
          fullName: d.fullName,
          currentCountry: d.currentCountry,
          consultationCountry: d.consultationCountry,
          email: d.email,
          contactCode: d.contactCode,
          contactNumber: d.contactNumber,
          comments: d.comments || "",
          sheetName: d.sheetName,
          submittedAt: new Date(),
        }),
        successMsg:
          "Your consultation request has been submitted successfully.",
        emailTemplate: (data) => ({
          to: data.email,
          subject: "Consultation Request Received",
          text: `Hi ${data.fullName}, we have received your consultation request for ${data.consultationCountry}.`,
          html: `
      <h2>Consultation Request Received</h2>
      <p>Hi ${data.fullName},</p>
      <p>Thank you for your consultation request for <b>${data.consultationCountry}</b>.</p>
      <p>Our team has received your details and will get back to you shortly.</p>
      <p>Cheers,<br/>The RoamIQ Team</p>
    `,
        }),
      },
      AI_Workation: {
        schema: aiWorkationSchema,
        map: (d) => ({
          noOfPeople: d.noOfPeople,
          fullName: d.fullName,
          companyName: d.companyName,
          companyWebsite: d.companyWebsite,
          currentCountry: d.currentCountry,
          workationCountry: d.workationCountry,
          startDate: d.startDate,
          endDate: d.endDate,
          email: d.email,
          contactCode: d.contactCode,
          contactNumber: d.contactNumber,
          comments: d.comments || "",
          sheetName: d.sheetName,
          submittedAt: new Date(),
        }),
        successMsg: "Your workation request has been submitted successfully.",
        emailTemplate: (data) => ({
          to: data.email,
          subject: "Workation Request Received",
          text: `Hi ${data.fullName}, we have received your workation request for ${data.workationCountry}.`,
          html: `
      <h2>Workation Request Received</h2>
      <p>Hi ${data.fullName},</p>
      <p>Thank you for your workation request for <b>${data.workationCountry}</b>.</p>
      <p>Our team has received your details and will get back to you shortly.</p>
      <p>Cheers,<br/>The RoamIQ Team</p>
    `,
        }),
      },
      AI_Become_Contributor: {
        schema: aiBecomeContributorSchema,
        map: (d) => ({
          contributionType: d.contributionType,
          fullName: d.fullName,
          currentCountry: d.currentCountry,
          linkedinProfile: d.linkedinProfile,
          email: d.email,
          contactCode: d.contactCode,
          contactNumber: d.contactNumber,
          message: d.message || "",
          sheetName: d.sheetName,
          submittedAt: new Date(),
        }),
        successMsg: "Your contributor request has been submitted successfully.",
        emailTemplate: (data) => ({
          to: data.email,
          subject: "Contributor Request Received",
          text: `Hi ${data.fullName}, we have received your contributor request.`,
          html: `
      <h2>Contributor Request Received</h2>
      <p>Hi ${data.fullName},</p>
      <p>Thank you for your interest in contributing to RoamIQ.</p>
      <p>Our team has received your details and will get back to you shortly.</p>
      <p>Cheers,<br/>The RoamIQ Team</p>
    `,
        }),
      },
    };

    const config = sheetConfig[sheetName];
    if (!config) {
      throw new Error(`Unsupported sheet name: ${sheetName}`);
    }

    // Validate request
    const validatedData = await config.schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Build payload
    const payload = config.map(validatedData);

    if (sheetName === "All_Enquiry") {
      if (company && !mongoose.Types.ObjectId.isValid(company)) {
        return res.status(400).json({ message: "Invalid company id provided" });
      }

      const leads = new Lead({ ...payload, company, companyId });

      await leads.save();
    }

    if (sheetName === "Sign_up") {
      const existingUser = await NomadUser.findOne({
        email: req.body.email?.trim().toLowerCase(),
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const { email, mobile, password, confirmPassword } = req.body;

      if (!email || !password || !mobile || !confirmPassword) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (password.length < 6) {
        return res
          .status(409)
          .json({ message: "Password must be 6 characters long" });
      }

      if (confirmPassword !== password) {
        return res.status(400).json({ message: "Please match the password" });
      }

      const signupEntry = new NomadUser(payload);

      await signupEntry.save();
    }

    if (sheetName === "AI_Visa_Support") {
      await VisaSupport.create({
        visaType: payload.visaType,
        fullName: payload.fullName,
        nationality: payload.nationality,
        travellingCountry: payload.travellingCountry,
        email: payload.email,
        contactCode: payload.contactCode,
        contactNumber: payload.contactNumber,
        comments: payload.comments,
      });
    }

    if (sheetName === "AI_Overall_Activation_Support") {
      await OverallActivationSupport.create(payload);
    }

    if (sheetName === "AI_New_Company_Setup") {
      await NewCompanySetup.create(payload);
    }

    if (sheetName === "AI_Consultation") {
      await Consultation.create(payload);
    }

    if (sheetName === "AI_Workation") {
      await Workation.create(payload);
    }

    if (sheetName === "AI_Become_Contributor") {
      await BecomeContributor.create(payload);
    }

    let sheetsWarning = null;

    // Send to Google Apps Script
    const response = await fetch(B2C_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.status !== "success") {
      const upstreamMessage =
        result.message || "Failed to save data to Google Sheets";
      const normalizedMessage =
        typeof upstreamMessage === "string"
          ? upstreamMessage.toLowerCase()
          : "";
      const isSheetConfigIssue =
        normalizedMessage === "invalid sheetname" ||
        normalizedMessage === "sheet not found";

      const ALLOWED_AI_SHEETS_WITH_OPTIONAL_APPS_SCRIPT_CONFIG = new Set([
        "AI_Visa_Support",
        "AI_Overall_Activation_Support",
        "AI_New_Company_Setup",
        "AI_Consultation",
        "AI_Workation",
        "AI_Become_Contributor",
      ]);

      if (
        ALLOWED_AI_SHEETS_WITH_OPTIONAL_APPS_SCRIPT_CONFIG.has(sheetName) &&
        isSheetConfigIssue
      ) {
        sheetsWarning = `Google Sheets sync skipped for "${payload.sheetName}". Please add this sheetName in Apps Script sheetConfigs and create the sheet tab.`;
      } else if (normalizedMessage === "invalid sheetname") {
        throw new Error(
          `Google Sheets sync failed: sheetName "${payload.sheetName}" is not configured in Apps Script sheetConfigs.`,
        );
      } else {
        throw new Error(upstreamMessage);
      }
    }

    // send email if template exists
    if (config.emailTemplate) {
      const emailContent = config.emailTemplate(payload);

      await sendMail({
        to: emailContent.to,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    }

    await sendAdminFormNotification({
      subject: "New form submission received",
      formName: sheetName,
      data: payload,
    });

    res.status(201).json({
      status: "success",
      message: config.successMsg,
      data: payload,
      ...(sheetsWarning ? { warning: sheetsWarning } : {}),
    });
  } catch (err) {
    console.error("❌ Error in addB2CformSubmission:", err.message);
    console.error(err.stack);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.errors[0], // only the first message
      });
    }
    next(err);
  }
};
