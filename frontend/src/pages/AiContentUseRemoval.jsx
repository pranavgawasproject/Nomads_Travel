import React, { useState } from "react";
import blueUnderline from "../assets/blue_underline.png";
import {
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Box,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";
import axios from "../utils/axios";
import { isValidInternationalPhone } from "../utils/validators";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";

const AiContentUseRemoval = () => {
    // -------------------------
    // 🔹 Form Logic
    // -------------------------
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            fullName: "",
            mobile: "",
            email: "",
            companyName: "",
            designation: "",
            urls: "",
        },
    });

    const { mutate: submitRemovalForm, isPending } = useMutation({
        mutationFn: async (data) => {
            const response = await axios.post("forms/add-new-b2c-form-submission", {
                ...data,
                sheetName: "Content_Removal_Requests",
                source: "roamiq",
            });
            return response.data;
        },
        onSuccess: () => {
            showSuccessAlert("Your request has been submitted successfully!");
            reset();
        },
        onError: (error) => {
            showErrorAlert(
                error?.response?.data?.message || "Failed to submit the request",
            );
        },
    });

    const onSubmit = (data) => submitRemovalForm(data);

    const floatingLabelSx = {
        color: "#94a3b8",
        "&.Mui-focused": { color: "#06b6d4" },
        "&.MuiInputLabel-shrink": { color: "#06b6d4" },
    };

    // -------------------------
    // 🔹 Policy Sections
    // -------------------------
    const sections = [
        {
            title: "Last Updated: 27th October 2025",
            content: (
                <p>
                    This <b>Content Use & Removal Policy</b> outlines how RoamIQ (“the
                    Platform”) respects intellectual property rights, attributes content
                    sources, and handles modification or removal requests.
                </p>
            ),
        },
        {
            title: "1. Purpose of This Policy",
            content: (
                <p>
                    RoamIQ is committed to respecting intellectual property rights and
                    maintaining transparency in how content from third-party sources is
                    displayed or referenced on our website. This policy explains how we
                    use such content, how we attribute sources, and how content owners can
                    request modifications or removal.
                </p>
            ),
        },
        {
            title: "2. Use of Third-Party Content",
            content: (
                <>
                    <p>
                        RoamIQ aggregates and showcases information related to co-living
                        spaces, coworking hubs, serviced apartments, hostels, and other
                        explorer-friendly services from various sources across the internet.
                        This includes:
                    </p>
                    <ul className="pl-5 mt-2 list-disc">
                        <li>Publicly available images or descriptions</li>
                        <li>Business names, logos, or contact details</li>
                        <li>Links to third-party websites</li>
                        <li>
                            Informational data used solely to guide users and help them
                            compare available options
                        </li>
                    </ul>
                    <p className="mt-2">
                        We do not claim ownership of third-party content. All such content
                        remains the intellectual property of its original owners and is used
                        under fair use principles, for informational and non-commercial
                        purposes only.
                    </p>
                </>
            ),
        },
        {
            title: "3. Source Attribution",
            content: (
                <p>
                    If any attribution is missing or incomplete, it is unintentional, and
                    we encourage rightful owners to contact us for immediate correction.
                </p>
            ),
        },
        {
            title: "4. Monetisation and Use Limitations",
            content: (
                <p>
                    RoamIQ does not monetise or sell third-party content. Images, data, or
                    text displayed from other websites are used only to inform users and
                    help them discover global remote work and living opportunities. Any
                    sponsored or paid content is clearly labeled as such.
                </p>
            ),
        },

        // -------------------------
        // 🔹 Section with Embedded Form
        // -------------------------
        {
            title: "5. Request for Removal or Modification",
            content: (
                <>
                    <p>
                        If you are a content owner, business, or representative and believe
                        your image, logo, or data has been:
                    </p>
                    <ul className="pl-5 mt-2 list-disc">
                        <li>Used without proper credit</li>
                        <li>Displayed inaccurately</li>
                        <li>Should not appear on the RoamIQ platform</li>
                    </ul>

                    <p className="mt-3 font-semibold">
                        Please fill out the short form below including:
                    </p>

                    {/* -------------------------
              MUI Form Starts Here
          ------------------------- */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {/* Full Name */}
                        <Controller
                            name="fullName"
                            control={control}
                            rules={{ required: "Full name is required" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Full Name"
                                    variant="standard"
                                    required
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    InputLabelProps={{ sx: floatingLabelSx }}
                                />
                            )}
                        />

                        {/* Mobile Number */}
                        <Controller
                            name="mobile"
                            control={control}
                            rules={{
                                required: "Mobile number is required",
                                validate: isValidInternationalPhone,
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    type="tel"
                                    fullWidth
                                    label="Mobile Number"
                                    variant="standard"
                                    required
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    InputLabelProps={{ sx: floatingLabelSx }}
                                />
                            )}
                        />

                        {/* Email */}
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address",
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Email ID"
                                    variant="standard"
                                    required
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    InputLabelProps={{ sx: floatingLabelSx }}
                                />
                            )}
                        />

                        {/* Organization */}
                        <Controller
                            name="companyName"
                            control={control}
                            rules={{ required: "Organization name is required" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Organization Name"
                                    variant="standard"
                                    required
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    InputLabelProps={{ sx: floatingLabelSx }}
                                />
                            )}
                        />

                        {/* Position */}
                        <Controller
                            name="designation"
                            control={control}
                            rules={{ required: "Position is required" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    select
                                    label="Your Position in Organization"
                                    variant="standard"
                                    required
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    InputLabelProps={{ sx: floatingLabelSx }}
                                >
                                    <MenuItem value="">Select</MenuItem>
                                    <MenuItem value="Founder">Founder</MenuItem>
                                    <MenuItem value="Employee">Employee</MenuItem>
                                    {/* <MenuItem value="Representative">Representative</MenuItem>
                  <MenuItem value="Other">Other</MenuItem> */}
                                </TextField>
                            )}
                        />

                        {/* URLs */}
                        <Controller
                            name="urls"
                            control={control}
                            rules={{
                                required: "Please enter the URL(s) of the content in question",
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    //   multiline
                                    //   minRows={3}
                                    label="The exact URL(s) of the content in question"
                                    variant="standard"
                                    required
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    InputLabelProps={{ sx: floatingLabelSx }}
                                />
                            )}
                        />

                        {/* Submit Button */}
                        <div className="md:col-span-2 text-center my-6">
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    bgcolor: "#94a3b8",
                                    borderRadius: 20,
                                    px: 10,
                                    py: 1,
                                    "&:hover": { bgcolor: "#0891b2" },
                                }}
                            >
                                {isPending && (
                                    <CircularProgress size={16} sx={{ color: "white", mr: 1 }} />
                                )}
                                {isPending ? "Submitting..." : "Submit Request"}
                            </Button>
                        </div>
                    </Box>

                    <p className="mt-6">
                        We will review all requests within <b>3–5 business days</b> and take
                        appropriate action, including removal, attribution correction, or
                        replacement, as necessary.
                    </p>
                    <p className="mt-3">
                        To follow up after form submission, please contact us via email at{" "}
                        <a
                            href="mailto:hello@roamiq.com"
                            className="text-accent underline"
                        >
                            hello@roamiq.com
                        </a>
                        .
                    </p>
                </>
            ),
        },

        {
            title: "6. Policy Updates",
            content: (
                <p>
                    RoamIQ reserves the right to update or modify this policy at any time to
                    align with changes in copyright law, fair use standards, or platform
                    practices. The latest version will always be available on this page.
                </p>
            ),
        },
        {
            title: "7. Contact Us",
            content: (
                <>
                    <p>
                        For any questions or copyright-related concerns, please contact:
                    </p>
                    <div className="flex flex-col mt-2">
                        <span>
                            <a
                                href="mailto:hello@roamiq.com"
                                className="text-accent underline"
                            >
                                hello@roamiq.com
                            </a>
                        </span>
                        <span>
                            <a
                                href="https://yourdomain.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent underline mt-1"
                            >
                                https://yourdomain.com
                            </a>
                        </span>
                    </div>
                </>
            ),
        },
    ];

    return (
        <div className="animate-fade-in flex flex-col gap-10 px-6 md:px-12 lg:px-28 pb-8 md:pb-12 pt-0 text-gray-300">
            {/* Header */}
            <div className="flex flex-col items-center relative font-heading uppercase font-bold text-gray-200 text-2xl md:text-4xl lg:text-5xl leading-tight">
                <div className="relative inline-block text-center">
                    <h3>Content Use & Removal Policy</h3>
                    <img
                        src={blueUnderline}
                        alt=""
                        className="absolute top-full left-1/2 -translate-x-1/2 w-full h-[40%]"
                    />
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
                {sections.map((section, i) => (
                    <div key={i}>
                        <div className="flex flex-col gap-4 font-sans">
                            <h4 className="font-sans text-lg md:text-xl lg:text-2xl font-semibold">
                                {section.title}
                            </h4>
                            <div className="text-content">{section.content}</div>
                        </div>
                        {i < sections.length - 1 && <hr className="border-glass-border" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AiContentUseRemoval;
