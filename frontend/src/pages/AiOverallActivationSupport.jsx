import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Country } from "country-state-city";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Container from "../components/Container";
import useAuth from "../hooks/useAuth";
import axios from "../utils/axios";
import {
  getCountryNameFromSelectedDestination,
  readSelectedDestination,
} from "../utils/selectedDestinationSession";
import { showErrorAlert } from "../utils/alerts";
import { HiCheck } from "react-icons/hi";

import { aiDestinationCards } from "../constants/aiDestinationCards";

const floatingLabelSx = {
  color: "#94a3b8",
  "&.Mui-focused": { color: "#06b6d4" },
  "&.MuiInputLabel-shrink": { color: "#06b6d4" },
};

const activationSupportOptions = [
  "Private Family Stay Setup Assistance",
  "Shared / Co-Living Setup Assistance",
  "Private Office Setup Assistance",
  "Co-Working Setup Assistance",
  "Overall New Location Setup Assistance",
  "Not Sure - Need Customised Support",
];

const defaultValues = {
  supportRequired: "",
  fullName: "",
  nationalityOnPassport: "",
  travelCountry: "",
  travelState: "",
  contactCode: "",
  contactNumber: "",
  email: "",
  comments: "",
};

const formatTravelCountry = (country, state) => {
  const trimmedCountry = country?.trim() || "";
  const trimmedState = state?.trim() || "";

  if (!trimmedState) return trimmedCountry;

  return `${trimmedCountry} - ${trimmedState}`;
};

const OVERALL_ACTIVATION_PROMPT =
  "Tell us what kind of on-ground activation help you need, and our team will guide you end-to-end.";
const OVERALL_ACTIVATION_HEADING = "Overall Activation Support";
const OVERALL_ACTIVATION_TYPING_SEEN_KEY =
  "roamiq-overall-activation-typing-seen";
const getFlagIconUrl = (isoCode) =>
  `https://flagcdn.com/24x18/${isoCode.toLowerCase()}.png`;
const normalizePrefillValue = (value) => value?.trim().toLowerCase() || "";

const tickMenuItemSx = {
  "& .tick-icon": { opacity: 0, color: "#06b6d4" },
  "&:hover .tick-icon": { opacity: 1 },
  "&.Mui-selected .tick-icon": { opacity: 1 },
  "&.Mui-selected:hover .tick-icon": { opacity: 1 },
};

const AiOverallActivationSupport = () => {
  const [typedMessage, setTypedMessage] = useState("");
  const [typedPageHeading, setTypedPageHeading] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useAuth();
  const isLoggedIn = Boolean(auth?.user);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const location = useLocation();
  const countries = useMemo(() => Country.getAllCountries(), []);
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues,
  });
  const messagePrefix = isLoggedIn
    ? (auth?.user?.fullName?.split(" ")[0] || "User") + ", "
    : "User, ";
  const overallActivationPrompt = `${messagePrefix}${OVERALL_ACTIVATION_PROMPT}`;
  const destinationOptions = useMemo(
    () =>
      aiDestinationCards.map((destination) => ({
        state: destination.city,
        country: destination.country,
      })),
    [],
  );
  const destinationCountries = useMemo(
    () =>
      Array.from(
        new Set(destinationOptions.map((option) => option.country)),
      ).sort(),
    [destinationOptions],
  );
  const selectedNationality = watch("nationalityOnPassport");
  const selectedTravelCountry = watch("travelCountry");
  const selectedTravelState = watch("travelState");
  const selectedNationalityCountry = useMemo(
    () =>
      countries.find((country) => country.name === selectedNationality) || null,
    [countries, selectedNationality],
  );

  const { mutate: submitOverallActivationSupport } = useMutation({
    mutationFn: async (formValues) => {
      const response = await axios.post("forms/add-new-b2c-form-submission", {
        ...formValues,
        travelCountry: formatTravelCountry(
          formValues.travelCountry,
          formValues.travelState,
        ),
        sheetName: "AI_Overall_Activation_Support",
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
        confirmButtonColor: "#06b6d4",
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
    submitOverallActivationSupport(formValues);
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
        setValue("nationalityOnPassport", userCountry);
      }
    }
  }, [isLoggedIn, auth, setValue]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryCountry = normalizePrefillValue(queryParams.get("country"));
    const prefilledCountryFromQuery = destinationCountries.find(
      (countryName) => normalizePrefillValue(countryName) === queryCountry,
    );
    const destinationCountry =
      prefilledCountryFromQuery ||
      getCountryNameFromSelectedDestination(countries);

    if (!destinationCountry || selectedTravelCountry) return;

    const hasDestination = destinationCountries.some(
      (countryName) => countryName === destinationCountry,
    );
    if (!hasDestination) return;

    setValue("travelCountry", destinationCountry, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [
    countries,
    destinationCountries,
    location.search,
    selectedTravelCountry,
    setValue,
  ]);

  useEffect(() => {
    if (!selectedTravelCountry || selectedTravelState) return;

    const queryParams = new URLSearchParams(location.search);
    const queryState = normalizePrefillValue(queryParams.get("state"));
    const sessionState = readSelectedDestination()?.city || "";
    const preferredState = queryState || sessionState;

    if (!preferredState) return;

    const matchedDestination = destinationOptions.find(
      (option) =>
        option.country === selectedTravelCountry &&
        normalizePrefillValue(option.state) === preferredState,
    );
    if (!matchedDestination) return;

    setValue("travelState", matchedDestination.state, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [
    destinationOptions,
    location.search,
    selectedTravelCountry,
    selectedTravelState,
    setValue,
  ]);

  const handleNationalityChange = (countryName, onChange) => {
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
    const hasSeenTypingEffect =
      typeof window !== "undefined" &&
      window.localStorage.getItem(OVERALL_ACTIVATION_TYPING_SEEN_KEY) ===
        "true";

    if (hasSeenTypingEffect) {
      setTypedMessage(overallActivationPrompt);
      setTypedPageHeading(OVERALL_ACTIVATION_HEADING);
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
        setTypedPageHeading(overallActivationPrompt.slice(0, headingIndex));

        if (headingIndex >= OVERALL_ACTIVATION_HEADING.length) {
          clearInterval(headingInterval);
          setIsFormVisible(true);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(
              OVERALL_ACTIVATION_TYPING_SEEN_KEY,
              "true",
            );
          }
        }
      }, 1);

      cleanupHeading = () => clearInterval(headingInterval);
    };

    const messageInterval = setInterval(() => {
      messageIndex += 1;
      setTypedMessage(overallActivationPrompt.slice(0, messageIndex));

      if (messageIndex >= overallActivationPrompt.length) {
        clearInterval(messageInterval);
        typeHeading();
      }
    }, 1);

    return () => {
      clearInterval(messageInterval);
      cleanupHeading();
    };
  }, [overallActivationPrompt]);

  const namePortion = typedMessage.slice(0, messagePrefix.length);
  const messagePortion = typedMessage.slice(messagePrefix.length);

  return (
    <div className="bg-surface text-gray-200 font-sans animate-fade-in">
      <Container padding={false}>
        <section className="min-h-[85vh] flex items-center justify-center py-2">
          <div className="w-full max-w-5xl md:px-20 lg:px-20">
            <div className="mx-auto mb-0 flex w-full max-w-4xl flex-col items-center gap-2 px-0">
              <p className="min-h-[3rem] w-full text-left font-heading text-[0.95rem] leading-relaxed text-gray-200 sm:min-h-[3.5rem] sm:text-[1rem]">
                {messagePrefix ? (
                  <>
                    <span className="text-accent">{namePortion}</span>
                    {messagePortion}
                  </>
                ) : (
                  typedMessage
                )}
              </p>
              <h1 className="text-hero min-h-[3rem] text-center font-heading">
                {typedPageHeading}
              </h1>
            </div>
            <Box
              component="form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className={`glass-card p-0 md:p-0 rounded-2xl ${
                isFormVisible ? "visible" : "invisible"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
                <Controller
                  name="supportRequired"
                  control={control}
                  rules={{ required: "Support required is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Support Required"
                      variant="standard"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    >
                      <MenuItem value="" sx={{ fontWeight: 700 }}>
                        Select Support
                      </MenuItem>
                      {activationSupportOptions.map((option) => (
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
                  name="nationalityOnPassport"
                  control={control}
                  rules={{ required: "Nationality on passport is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Nationality on Passport"
                      variant="standard"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                      SelectProps={{
                        renderValue: (value) => {
                          const selectedCountry = countries.find(
                            (country) => country.name === value,
                          );

                          if (!selectedCountry) {
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
                                src={getFlagIconUrl(selectedCountry.isoCode)}
                                alt={`${selectedCountry.name} flag`}
                                width={20}
                                height={15}
                                loading="lazy"
                              />
                              <span>{selectedCountry.name}</span>
                            </Box>
                          );
                        },
                      }}
                      onChange={(event) =>
                        handleNationalityChange(
                          event.target.value,
                          field.onChange,
                        )
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

                <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                  <Controller
                    name="travelCountry"
                    control={control}
                    rules={{ required: "Travelling Country is required" }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        select
                        label="Travelling Country"
                        variant="standard"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputLabelProps={{ sx: floatingLabelSx }}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                          setValue("travelState", "", {
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }}
                      >
                        <MenuItem value="" sx={{ fontWeight: 700 }}>
                          SELECT COUNTRY
                        </MenuItem>
                        {destinationCountries.map((countryName) => {
                          const country = countries.find(
                            (c) => c.name === countryName,
                          );
                          if (!country) return null;
                          return (
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
                                    sx={{
                                      width: 20,
                                      height: 15,
                                      flexShrink: 0,
                                    }}
                                    loading="lazy"
                                  />
                                  <span>{country.name}</span>
                                </Box>
                              </Box>
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    )}
                  />

                  <Controller
                    name="travelState"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Travelling City / State"
                        variant="standard"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        select
                        disabled={!selectedTravelCountry}
                        InputLabelProps={{ sx: floatingLabelSx }}
                      >
                        <MenuItem value="" sx={{ fontWeight: 700 }}>
                          {selectedTravelCountry
                            ? "SELECT CITY / STATE"
                            : "SELECT COUNTRY FIRST"}
                        </MenuItem>
                        {destinationOptions
                          .filter(
                            (option) =>
                              option.country === selectedTravelCountry,
                          )
                          .map((destinationOption) => (
                            <MenuItem
                              key={`${destinationOption.state}-${destinationOption.country}`}
                              value={destinationOption.state}
                              sx={tickMenuItemSx}
                            >
                              <Box className="flex w-full items-center gap-2">
                                <HiCheck className="tick-icon" size={16} />
                                <span>{destinationOption.state}</span>
                              </Box>
                            </MenuItem>
                          ))}
                      </TextField>
                    )}
                  />
                </Box>

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
                          startAdornment:
                            selectedNationalityCountry?.isoCode ? (
                              <InputAdornment position="start">
                                <Box
                                  component="img"
                                  src={getFlagIconUrl(
                                    selectedNationalityCountry.isoCode,
                                  )}
                                  alt={`${selectedNationalityCountry.name} flag`}
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
                      label="Email Address"
                      variant="standard"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    />
                  )}
                />

                <div className="md:col-span-2">
                  <Controller
                    name="comments"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        minRows={3}
                        label="Additional Comments"
                        variant="standard"
                        InputLabelProps={{ sx: floatingLabelSx }}
                      />
                    )}
                  />
                </div>

                <div className="pt-2 md:col-span-2 text-center">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: "#94a3b8",
                      borderRadius: 20,
                      px: { xs: 6, md: 14 },
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "600",
                      textTransform: "none",
                      "&:hover": { bgcolor: "#0891b2" },
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

export default AiOverallActivationSupport;
