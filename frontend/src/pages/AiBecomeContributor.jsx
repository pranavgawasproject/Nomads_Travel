import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  InputBase,
  MenuItem,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Country } from "country-state-city";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import Container from "../components/Container";
import axios from "../utils/axios";
import useAuth from "../hooks/useAuth";
import { showErrorAlert } from "../utils/alerts";
import { HiCheck } from "react-icons/hi";

const floatingLabelSx = {
  color: "black",
  "&.Mui-focused": { color: "#1976d2" },
  "&.MuiInputLabel-shrink": { color: "#1976d2" },
};

const defaultValues = {
  contributionType: "",
  fullName: "",
  email: "",
  currentCountry: "",
  contactCode: "",
  contactNumber: "",
  message: "",
};

const CONTRIBUTOR_PROMPT =
  "We are constantly looking out for individuals who can support our cause to make RoamIQ the largest Explorer Community & Platform in the world. We know we will not be able to do this alone.";
const CONTRIBUTOR_HEADING = "Become an Explorer Contributor";
const CONTRIBUTOR_TYPING_SEEN_KEY = "roamiq-contributor-typing-seen";
const getFlagIconUrl = (isoCode) =>
  `https://flagcdn.com/24x18/${isoCode.toLowerCase()}.png`;
const CONTRIBUTION_TYPE_OPTIONS = [
  "Add your Business Listing & Services",
  "Become a Overall Destination Partner",
  "Become a Local Experience Partner",
  "Become a Visa & Immigration Partner",
  "Become a Tax & Financial Advisory Partner",
  "Become a Company Setup Services Partner",
  "Become an Explorer Blog & News Writer",
  "Become a Content Contributor",
  "Become a Remote Jobs Posting Partner",
  "Not Sure - Lets Connect & Explore",
];

const tickMenuItemSx = {
  "& .tick-icon": { opacity: 0, color: "#1976d2" },
  "&:hover .tick-icon": { opacity: 1 },
  "&.Mui-selected .tick-icon": { opacity: 1 },
  "&.Mui-selected:hover .tick-icon": { opacity: 1 },
};

const AiBecomeContributor = () => {
  const [typedMessage, setTypedMessage] = useState("");
  const [typedPageHeading, setTypedPageHeading] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useAuth();
  const isLoggedIn = Boolean(auth?.user);
  const countries = useMemo(() => Country.getAllCountries(), []);
  const { handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues,
  });
  const selectedCountry = watch("currentCountry");
  const selectedCountryData = useMemo(
    () => countries.find((country) => country.name === selectedCountry) || null,
    [countries, selectedCountry],
  );
  const messagePrefix = isLoggedIn
    ? (auth?.user?.fullName?.split(" ")[0] || "User") + ", "
    : "User, ";
  const contributorPrompt = `${messagePrefix}${CONTRIBUTOR_PROMPT}`;

  const { mutate: submitContributor } = useMutation({
    mutationFn: async (formValues) => {
      const response = await axios.post("forms/add-new-b2c-form-submission", {
        ...formValues,
        sheetName: "AI_Become_Contributor",
      });
      return response.data;
    },
    onSuccess: async (data) => {
      if (data?.warning) {
        showErrorAlert(data.warning);
        return;
      }
      await Swal.fire({
        title: "Request Submitted!",
        text: "Your form has been submitted. We will get back to you shortly.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0BA9EF",
        customClass: {
          confirmButton: "swal2-button--pill",
        },
      });
      reset(defaultValues);
    },
    onError: (error) => {
      showErrorAlert(
        error?.response?.data?.message ||
          "Something went wrong while submitting your request.",
      );
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleFormSubmit = (formValues) => {
    setIsSubmitting(true);
    submitContributor(formValues);
  };

  const handleCountryChange = (countryName, onChange) => {
    const country = countries.find((item) => item.name === countryName);
    const phonePrefix = country?.phonecode ? `+${country.phonecode}` : "";

    onChange(countryName);
    setValue("contactCode", phonePrefix, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("contactNumber", "", {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    if (isLoggedIn && auth?.user) {
      const {
        fullName,
        email,
        contactCode,
        contactNumber,
        country,
        countryOfResidence,
      } = auth.user;
      setValue("fullName", fullName || "");
      setValue("email", email || "");
      setValue("contactCode", contactCode || "");
      setValue("contactNumber", contactNumber || "");
      const userCountry = country || countryOfResidence;
      if (userCountry) {
        setValue("currentCountry", userCountry);
      }
    }
  }, [isLoggedIn, auth, setValue]);

  useEffect(() => {
    const hasSeenTypingEffect =
      typeof window !== "undefined" &&
      window.localStorage.getItem(CONTRIBUTOR_TYPING_SEEN_KEY) === "true";

    if (hasSeenTypingEffect) {
      setTypedMessage(contributorPrompt);
      setTypedPageHeading(CONTRIBUTOR_HEADING);
      setIsFormVisible(true);
      return;
    }
    setTypedMessage("");
    setTypedPageHeading("");
    setIsFormVisible(false);

    let messageIndex = 0;
    let headingIndex = 0;
    let cleanupHeading = () => {};

    const typeHeading = () => {
      const headingInterval = setInterval(() => {
        headingIndex += 1;
        setTypedPageHeading(CONTRIBUTOR_HEADING.slice(0, headingIndex));

        if (headingIndex >= CONTRIBUTOR_HEADING.length) {
          clearInterval(headingInterval);
          setIsFormVisible(true);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(CONTRIBUTOR_TYPING_SEEN_KEY, "true");
          }
        }
      }, 1);

      cleanupHeading = () => clearInterval(headingInterval);
    };

    const messageInterval = setInterval(() => {
      messageIndex += 1;
      setTypedMessage(contributorPrompt.slice(0, messageIndex));

      if (messageIndex >= contributorPrompt.length) {
        clearInterval(messageInterval);
        typeHeading();
      }
    }, 1);

    return () => {
      clearInterval(messageInterval);
      cleanupHeading();
    };
  }, []);

  return (
    <div className="bg-white text-black font-sans">
      <Container padding={false}>
        <section className="min-h-[85vh] flex items-center justify-center py-0">
          <div className="w-full max-w-5xl md:px-20 lg:px-20">
            <div className="mx-auto mb-0 flex w-full max-w-4xl flex-col items-center gap-8 px-0">
              <p className="min-h-[3rem] w-full text-left font-play text-[0.95rem] leading-relaxed text-gray-800 sm:min-h-[3.5rem] sm:text-[1rem]">
                {typedMessage}
              </p>
              <h1 className="text-hero min-h-[3rem] text-center font-play">
                {typedPageHeading}
              </h1>
            </div>
            <Box
              component="form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className={`bg-white p-0 md:p-0 rounded-2xl ${
                isFormVisible ? "visible" : "invisible"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <Controller
                  name="contributionType"
                  control={control}
                  rules={{ required: "Contribution Type is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Contribution Towards RoamIQ"
                      variant="standard"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                      onChange={(event) => field.onChange(event.target.value)}
                    >
                      {CONTRIBUTION_TYPE_OPTIONS.map((option) => (
                        <MenuItem
                          key={option}
                          value={option}
                          sx={tickMenuItemSx}
                        >
                          <Box className="flex w-full items-center gap-2">
                            <HiCheck className="tick-icon" size={16} />
                            <span>{option}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
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
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    />
                  )}
                />

                <Controller
                  name="currentCountry"
                  control={control}
                  rules={{ required: "Current Country is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Current Country"
                      variant="standard"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                      SelectProps={{
                        renderValue: (value) => {
                          const selectedOption = countries.find(
                            (country) => country.name === value,
                          );

                          if (!selectedOption) {
                            return value;
                          }

                          return (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <img
                                src={getFlagIconUrl(selectedOption.isoCode)}
                                alt={`${selectedOption.name} flag`}
                                width={20}
                                height={15}
                                loading="lazy"
                              />
                              <span>{selectedOption.name}</span>
                            </Box>
                          );
                        },
                      }}
                      onChange={(event) =>
                        handleCountryChange(event.target.value, field.onChange)
                      }
                    >
                      <MenuItem value="" sx={{ fontWeight: 700 }}>
                        SELECT COUNTRY
                      </MenuItem>
                      {countries.map((country) => (
                        <MenuItem
                          key={country.isoCode}
                          value={country.name}
                          sx={tickMenuItemSx}
                        >
                          <Box className="flex w-full items-center gap-2">
                            <HiCheck className="tick-icon" size={16} />
                            <Box className="flex items-center gap-1">
                              <Box
                                component="img"
                                src={getFlagIconUrl(country.isoCode)}
                                alt={`${country.name} flag`}
                                sx={{ width: 20, height: 15, flexShrink: 0 }}
                                loading="lazy"
                              />
                              <span>{country.name}</span>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  name="linkedinProfile"
                  control={control}
                  rules={{ required: "Linkedin profile is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Linkedin Profile"
                      variant="standard"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    />
                  )}
                />

                <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                  <Controller
                    name="contactCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Code"
                        variant="standard"
                        InputLabelProps={{ sx: floatingLabelSx }}
                        InputProps={{
                          startAdornment: selectedCountryData?.isoCode ? (
                            <InputAdornment position="start">
                              <Box
                                component="img"
                                src={getFlagIconUrl(
                                  selectedCountryData.isoCode,
                                )}
                                alt={`${selectedCountryData.name} flag`}
                                sx={{ width: 20, height: 15, flexShrink: 0 }}
                                loading="lazy"
                              />
                            </InputAdornment>
                          ) : null,
                        }}
                        inputProps={{ readOnly: true }}
                        sx={{ width: "20%" }}
                      />
                    )}
                  />
                  <Box
                    sx={{
                      width: "1px",
                      height: "100%",
                      backgroundColor: "#ccc",
                    }}
                  />
                  <Controller
                    name="contactNumber"
                    control={control}
                    rules={{
                      required: "Contact number is required",
                      pattern: {
                        value: /^[0-9]{7,15}$/,
                        message: "Please enter a valid phone number",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Contact Number"
                        variant="standard"
                        type="tel"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputLabelProps={{ sx: floatingLabelSx }}
                        sx={{ flex: 1 }}
                      />
                    )}
                  />
                </Box>

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
                      label="Email"
                      variant="standard"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    />
                  )}
                />

                <div className="md:col-span-2">
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        minRows={3}
                        label="Message"
                        variant="standard"
                        InputLabelProps={{
                          sx: floatingLabelSx,
                        }}
                      />
                    )}
                  />
                </div>

                <div className="pt-0 md:col-span-2 text-center">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: "black",
                      borderRadius: 20,
                      px: { xs: 6, md: 14 },
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "600",
                      textTransform: "none",
                      "&:hover": { bgcolor: "#333" },
                      width: { xs: "100%", md: "auto" },
                    }}
                  >
                    {isSubmitting && (
                      <CircularProgress
                        size={16}
                        sx={{ color: "white", mr: 1 }}
                      />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </Box>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default AiBecomeContributor;
