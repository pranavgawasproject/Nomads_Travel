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
import { DatePicker } from "@mui/x-date-pickers";
import { Country } from "country-state-city";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
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
  color: "black",
  "&.Mui-focused": { color: "#1976d2" },
  "&.MuiInputLabel-shrink": { color: "#1976d2" },
};

const supportOptions = [
  "Private / Co-Working Setup for Registration",
  "Virtual Office Setup for Registration",
  "Fresh New Company Setup",
  "Subsidiary / Foreign Company Setup",
  "Branch / Liaison Office Setup",
  "LLP / Partnership Firm Registration",
  "Redomiciliation / Company Migration",
  "Setting up Holding Company Structure",
  "Sole Proprietorship Registration",
  "Offshore Company Setup",
  "Not Sure - Need Customised Support",
];

const defaultValues = {
  supportRequired: "",
  fullName: "",
  currentCompanyCountry: "",
  newCompanyCountry: "",
  newCompanyState: "",
  contactCode: "",
  contactNumber: "",
  email: "",
  comments: "",
};

const NEW_COMPANY_PROMPT =
  "Planning to build your business abroad? Share your details and we will support your setup journey.";
const NEW_COMPANY_HEADING = "New Company Setup";
const NEW_COMPANY_TYPING_SEEN_KEY = "roamiq-new-company-typing-seen";
const getFlagIconUrl = (isoCode) =>
  `https://flagcdn.com/24x18/${isoCode.toLowerCase()}.png`;
const normalizePrefillValue = (value) => value?.trim().toLowerCase() || "";

const tickMenuItemSx = {
  "& .tick-icon": { opacity: 0, color: "#1976d2" },
  "&:hover .tick-icon": { opacity: 1 },
  "&.Mui-selected .tick-icon": { opacity: 1 },
  "&.Mui-selected:hover .tick-icon": { opacity: 1 },
};

const formatCountryWithState = (country, state) => {
  const trimmedCountry = country?.trim() || "";
  const trimmedState = state?.trim() || "";

  if (!trimmedState) return trimmedCountry;

  return `${trimmedCountry} - ${trimmedState}`;
};

const AiNewCompanySetup = () => {
  const [typedMessage, setTypedMessage] = useState("");
  const [typedPageHeading, setTypedPageHeading] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { auth } = useAuth();
  const isLoggedIn = Boolean(auth?.user);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const location = useLocation();
  const countries = useMemo(() => Country.getAllCountries(), []);
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
  const { handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues,
  });
  const selectedCountry = watch("currentCompanyCountry");
  const newCompanyCountry = watch("newCompanyCountry");
  const newCompanyState = watch("newCompanyState");
  const selectedCountryData = useMemo(
    () => countries.find((country) => country.name === selectedCountry) || null,
    [countries, selectedCountry],
  );
  const messagePrefix = isLoggedIn
    ? (auth?.user?.fullName?.split(" ")[0] || "User") + ", "
    : "User, ";
  const newCompanyPrompt = `${messagePrefix}${NEW_COMPANY_PROMPT}`;

  const { mutate: submitNewCompanySetup } = useMutation({
    mutationFn: async (formValues) => {
      const payload = {
        ...formValues,
        newCompanyCountry: formatCountryWithState(
          formValues.newCompanyCountry,
          formValues.newCompanyState,
        ),
        sheetName: "AI_New_Company_Setup",
      };
      const response = await axios.post(
        "forms/add-new-b2c-form-submission",
        payload,
      );
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
    submitNewCompanySetup(formValues);
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
        setValue("currentCompanyCountry", userCountry);
      }
    }
  }, [isLoggedIn, auth, setValue]);

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
    const queryParams = new URLSearchParams(location.search);
    const queryCountry = normalizePrefillValue(queryParams.get("country"));
    const prefilledCountryFromQuery = destinationCountries.find(
      (countryName) => normalizePrefillValue(countryName) === queryCountry,
    );
    const destinationCountry =
      prefilledCountryFromQuery ||
      getCountryNameFromSelectedDestination(countries);

    if (!destinationCountry || newCompanyCountry) return;

    const hasDestination = destinationCountries.some(
      (countryName) => countryName === destinationCountry,
    );
    if (!hasDestination) return;

    setValue("newCompanyCountry", destinationCountry, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [
    countries,
    destinationCountries,
    location.search,
    newCompanyCountry,
    setValue,
  ]);

  useEffect(() => {
    if (!newCompanyCountry || newCompanyState) return;

    const queryParams = new URLSearchParams(location.search);
    const queryState = normalizePrefillValue(queryParams.get("state"));
    const sessionState = readSelectedDestination()?.city || "";
    const preferredState = queryState || sessionState;

    if (!preferredState) return;

    const matchedDestination = destinationOptions.find(
      (option) =>
        option.country === newCompanyCountry &&
        normalizePrefillValue(option.state) === preferredState,
    );
    if (!matchedDestination) return;

    setValue("newCompanyState", matchedDestination.state, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [
    destinationOptions,
    location.search,
    newCompanyCountry,
    newCompanyState,
    setValue,
  ]);

  useEffect(() => {
    const hasSeenTypingEffect =
      typeof window !== "undefined" &&
      window.localStorage.getItem(NEW_COMPANY_TYPING_SEEN_KEY) === "true";

    if (hasSeenTypingEffect) {
      setTypedMessage(newCompanyPrompt);
      setTypedPageHeading(NEW_COMPANY_HEADING);
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
        setTypedPageHeading(newCompanyPrompt.slice(0, headingIndex));

        if (headingIndex >= newCompanyPrompt.length) {
          clearInterval(headingInterval);
          setIsFormVisible(true);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(NEW_COMPANY_TYPING_SEEN_KEY, "true");
          }
        }
      }, 1);

      cleanupHeading = () => clearInterval(headingInterval);
    };

    const messageInterval = setInterval(() => {
      messageIndex += 1;
      setTypedMessage(newCompanyPrompt.slice(0, messageIndex));

      if (messageIndex >= newCompanyPrompt.length) {
        clearInterval(messageInterval);
        typeHeading();
      }
    }, 1);

    return () => {
      clearInterval(messageInterval);
      cleanupHeading();
    };
  }, [newCompanyPrompt]);

  const namePortion = typedMessage.slice(0, messagePrefix.length);
  const messagePortion = typedMessage.slice(messagePrefix.length);

  return (
    <div className="bg-white text-black font-sans">
      <Container padding={false}>
        <section className="min-h-[85vh] flex items-center justify-center py-2">
          <div className="w-full max-w-5xl md:px-20 lg:px-20">
            <div className="mx-auto mb-0 flex w-full max-w-4xl flex-col items-center gap-2 px-0">
              <p className="min-h-[3rem] w-full text-left font-play text-[0.95rem] leading-relaxed text-gray-800 sm:min-h-[3.5rem] sm:text-[1rem]">
                {messagePrefix ? (
                  <>
                    <span className="text-blue-600">{namePortion}</span>
                    {messagePortion}
                  </>
                ) : (
                  typedMessage
                )}
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
                      {supportOptions.map((option) => (
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
                  name="currentCompanyCountry"
                  control={control}
                  rules={{ required: "Current Company Country is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Current Company Country"
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

                <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                  <Controller
                    name="newCompanyCountry"
                    control={control}
                    rules={{ required: "New Company Country is required" }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        select
                        label="New Company Country"
                        variant="standard"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputLabelProps={{ sx: floatingLabelSx }}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                          setValue("newCompanyState", "", {
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
                            (item) => item.name === countryName,
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
                    name="newCompanyState"
                    control={control}
                    render={({ field, fieldState }) => {
                      const states = destinationOptions.filter(
                        (option) => option.country === newCompanyCountry,
                      );

                      return (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          label="New Company City / State"
                          variant="standard"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          disabled={!newCompanyCountry}
                          InputLabelProps={{ sx: floatingLabelSx }}
                        >
                          <MenuItem value="" sx={{ fontWeight: 700 }}>
                            {newCompanyCountry
                              ? "SELECT CITY / STATE"
                              : "SELECT COUNTRY FIRST"}
                          </MenuItem>
                          {states.map((stateOption) => (
                            <MenuItem
                              key={`${stateOption.state}-${stateOption.country}`}
                              value={stateOption.state}
                              sx={tickMenuItemSx}
                            >
                              <Box className="flex w-full items-center gap-2">
                                <HiCheck className="tick-icon" size={16} />
                                <span>{stateOption.state}</span>
                              </Box>
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    }}
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

export default AiNewCompanySetup;
