import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Country } from "country-state-city";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios";
import Container from "../components/Container";
import { aiDestinationCards } from "../constants/aiDestinationCards";
import useNomadLoginState from "../hooks/useNomadLoginState";
import useAuth from "../hooks/useAuth";
import {
  getCountryNameFromSelectedDestination,
  readSelectedDestination,
} from "../utils/selectedDestinationSession";
import { showErrorAlert } from "../utils/alerts";
import { HiCheck } from "react-icons/hi";

const floatingLabelSx = {
  color: "#94a3b8",
  "&.Mui-focused": { color: "#06b6d4" },
  "&.MuiInputLabel-shrink": { color: "#06b6d4" },
};

const defaultValues = {
  visaType: "",
  fullName: "",
  nationality: "",
  travellingCountry: "",
  travellingState: "",
  email: "",
  contactCode: "",
  contactNumber: "",
  comments: "",
};

const VISA_TYPE_OPTIONS = [
  "Explore / Travel",
  "Work Remotely",
  "Get a Job Abroad",
  "Study Abroad",
  "Start or Expand a Business",
  "Relocate / Settle Long-Term",
  "Move with Family",
  "Not Sure - Need Recommendation",
];

const VISA_SUPPORT_PROMPT =
  "Tell us about your travel plans and we will help you navigate the visa process with confidence.";
const VISA_SUPPORT_HEADING = "Visa Support";
const VISA_SUPPORT_TYPING_SEEN_KEY = "roamiq-visa-support-typing-seen";
const getFlagIconUrl = (isoCode) =>
  `https://flagcdn.com/24x18/${isoCode.toLowerCase()}.png`;
const normalizePrefillValue = (value) => value?.trim().toLowerCase() || "";

const tickMenuItemSx = {
  "& .tick-icon": { opacity: 0, color: "#06b6d4" },
  "&:hover .tick-icon": { opacity: 1 },
  "&.Mui-selected .tick-icon": { opacity: 1 },
  "&.Mui-selected:hover .tick-icon": { opacity: 1 },
};

const formatTravellingCountry = (country, state) => {
  const trimmedCountry = country?.trim() || "";
  const trimmedState = state?.trim() || "";

  if (!trimmedState) return trimmedCountry;

  return `${trimmedCountry} - ${trimmedState}`;
};

const AiVisaSupport = () => {
  const [typedMessage, setTypedMessage] = useState("");
  const [typedVisaHeading, setTypedVisaHeading] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useAuth();
  const isLoggedIn = Boolean(auth?.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues,
  });
  const messagePrefix = isLoggedIn
    ? (auth?.user?.fullName?.split(" ")[0] || "User") + ", "
    : "User, ";
  const visaSupportPrompt = `${messagePrefix}${VISA_SUPPORT_PROMPT}`;
  const countries = useMemo(() => Country.getAllCountries(), []);
  const destinationOptions = useMemo(
    () =>
      aiDestinationCards.map((destination) => ({
        state: destination.city,
        country: destination.country,
        continent: destination.continent,
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
  const selectedNationality = watch("nationality");
  const selectedTravellingCountry = watch("travellingCountry");
  const selectedTravellingState = watch("travellingState");
  const selectedNationalityCountry = useMemo(
    () =>
      countries.find((country) => country.name === selectedNationality) || null,
    [countries, selectedNationality],
  );

  const navigateToThankYou = (choice, travellingCountry, travellingState) => {
    const selectedDestination = destinationOptions.find(
      (option) =>
        (travellingState ? option.state === travellingState : false) ||
        option.state === travellingCountry ||
        option.country.toLowerCase() === travellingCountry?.toLowerCase(),
    );

    // Fallback search: if no direct state match, check if any destination has this as its country to get continent
    const countryFallback = !selectedDestination
      ? aiDestinationCards.find(
          (dest) =>
            dest.country.toLowerCase() === travellingCountry?.toLowerCase(),
        )
      : null;

    const destinationState = selectedDestination?.state?.toLowerCase() || "";
    const destinationCountry =
      selectedDestination?.country?.toLowerCase() ||
      travellingCountry?.toLowerCase() ||
      "";
    const destinationContinent =
      selectedDestination?.continent?.toLowerCase() ||
      countryFallback?.continent?.toLowerCase() ||
      "";

    navigate(
      `/visa-support/thank-you?choice=${choice}&state=${encodeURIComponent(destinationState)}&country=${encodeURIComponent(destinationCountry)}&continent=${encodeURIComponent(destinationContinent)}&destination=${encodeURIComponent(travellingCountry || "")}`,
    );
  };

  const { mutate: submitVisaSupport } = useMutation({
    mutationFn: async (formValues) => {
      const payload = {
        visaType: formValues.visaType,
        fullName: formValues.fullName,
        nationality: formValues.nationality,
        travellingCountry: formatTravellingCountry(
          formValues.travellingCountry,
          formValues.travellingState,
        ),
        email: formValues.email,
        contactCode: formValues.contactCode,
        contactNumber: formValues.contactNumber,
        comments: formValues.comments,
        sheetName: "AI_Visa_Support",
      };

      const response = await axios.post(
        "forms/add-new-b2c-form-submission",
        payload,
      );
      return response.data;
    },
    onSuccess: async (_, formValues) => {
      await Swal.fire({
        title: "Request Submitted!",
        text: "Please suggest and select below options.",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Need Custom Solution",
        cancelButtonText: "Browse Options Yourself",
        reverseButtons: true,
        cancelButtonColor: "#000000",
        confirmButtonColor: "#06b6d4",
        customClass: {
          confirmButton: "swal2-button--pill",
          cancelButton: "swal2-button--pill",
        },
      });
      navigateToThankYou(
        "get-back-to-me",
        formValues.travellingCountry || "",
        formValues.travellingState || "",
      );
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
    submitVisaSupport(formValues);
  };

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
        setValue("nationality", userCountry);
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

    if (!destinationCountry || selectedTravellingCountry) return;

    const hasDestination = destinationCountries.some(
      (countryName) => countryName === destinationCountry,
    );
    if (!hasDestination) return;

    setValue("travellingCountry", destinationCountry, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [
    countries,
    destinationCountries,
    location.search,
    selectedTravellingCountry,
    setValue,
  ]);

  useEffect(() => {
    if (!selectedTravellingCountry || selectedTravellingState) return;

    const queryParams = new URLSearchParams(location.search);
    const queryState = normalizePrefillValue(queryParams.get("state"));
    const sessionState = readSelectedDestination()?.city || "";
    const preferredState = queryState || sessionState;

    if (!preferredState) return;

    const matchedDestination = destinationOptions.find(
      (option) =>
        option.country === selectedTravellingCountry &&
        normalizePrefillValue(option.state) === preferredState,
    );

    if (!matchedDestination) return;

    setValue("travellingState", matchedDestination.state, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [
    destinationOptions,
    location.search,
    selectedTravellingCountry,
    selectedTravellingState,
    setValue,
  ]);

  useEffect(() => {
    const hasSeenTypingEffect =
      typeof window !== "undefined" &&
      window.localStorage.getItem(VISA_SUPPORT_TYPING_SEEN_KEY) === "true";

    if (hasSeenTypingEffect) {
      setTypedMessage(visaSupportPrompt);
      setTypedVisaHeading(VISA_SUPPORT_HEADING);
      setIsFormVisible(true);
      return;
    }
    setTypedMessage("");
    setTypedVisaHeading("");
    setIsFormVisible(false);

    let messageIndex = 0;
    let visaHeadingIndex = 0;
    let cleanupHeading = () => {};

    const typeVisaHeading = () => {
      const headingInterval = setInterval(() => {
        visaHeadingIndex += 1;
        setTypedVisaHeading(VISA_SUPPORT_HEADING.slice(0, visaHeadingIndex));

        if (visaHeadingIndex >= VISA_SUPPORT_HEADING.length) {
          clearInterval(headingInterval);
          setIsFormVisible(true);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(VISA_SUPPORT_TYPING_SEEN_KEY, "true");
          }
        }
      }, 1);

      cleanupHeading = () => clearInterval(headingInterval);
    };

    const messageInterval = setInterval(() => {
      messageIndex += 1;
      setTypedMessage(visaSupportPrompt.slice(0, messageIndex));

      if (messageIndex >= visaSupportPrompt.length) {
        clearInterval(messageInterval);
        typeVisaHeading();
      }
    }, 1);

    return () => {
      clearInterval(messageInterval);
      cleanupHeading();
    };
  }, [visaSupportPrompt]);

  const namePortion = typedMessage.slice(0, messagePrefix.length);
  const messagePortion = typedMessage.slice(messagePrefix.length);

  return (
    <div className="bg-surface text-gray-200 font-sans animate-fade-in">
      <Container padding={false}>
        <section className="min-h-[85vh] flex items-center justify-center py-2">
          <div className="w-full max-w-5xl md:px-20 lg:px-20 flex flex-col gap-1">
            <p className="mx-auto min-h-[3rem] w-full text-left font-heading text-[0.95rem] leading-relaxed text-gray-200 sm:min-h-[3.5rem] sm:text-[1rem]">
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
              {typedVisaHeading}
            </h1>

            <Box
              component="form"
              onSubmit={handleSubmit(handleFormSubmit)}
              className={`glass-card p-0 md:p-0 rounded-2xl ${
                isFormVisible ? "visible" : "invisible"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <Controller
                  name="visaType"
                  control={control}
                  rules={{ required: "Visa type is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="VISA Type"
                      variant="standard"
                      select
                      InputLabelProps={{ sx: floatingLabelSx }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    >
                      <MenuItem value="" sx={{ fontWeight: 700 }}>
                        SELECT VISA TYPE
                      </MenuItem>
                      {VISA_TYPE_OPTIONS.map((option) => (
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
                  name="nationality"
                  control={control}
                  rules={{ required: "Nationality is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nationality on Passport"
                      variant="standard"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      select
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
                    name="travellingCountry"
                    control={control}
                    rules={{ required: "Travelling country is required" }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Travelling Country"
                        variant="standard"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        select
                        InputLabelProps={{ sx: floatingLabelSx }}
                        onChange={(event) => field.onChange(event.target.value)}
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
                    name="travellingState"
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
                        disabled={!selectedTravellingCountry}
                        InputLabelProps={{ sx: floatingLabelSx }}
                      >
                        <MenuItem value="" sx={{ fontWeight: 700 }}>
                          {selectedTravellingCountry
                            ? "SELECT CITY / STATE"
                            : "SELECT COUNTRY FIRST"}
                        </MenuItem>
                        {destinationOptions
                          .filter(
                            (option) =>
                              option.country === selectedTravellingCountry,
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
                      validate: (value) =>
                        selectedNationalityCountry?.isoCode !== "IN" ||
                        value.length <= 10 ||
                        "Indian phone numbers cannot exceed 10 digits",
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Contact Number"
                        variant="standard"
                        type="tel"
                        InputLabelProps={{ sx: floatingLabelSx }}
                        inputProps={{
                          inputMode: "numeric",
                          maxLength:
                            selectedNationalityCountry?.isoCode === "IN"
                              ? 10
                              : 15,
                        }}
                        sx={{ flex: 1 }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Box>

                <Controller
                  name="email"
                  control={control}
                  rules={{ required: "Email is required" }}
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

export default AiVisaSupport;
