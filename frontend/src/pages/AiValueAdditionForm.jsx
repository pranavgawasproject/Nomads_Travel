import React, { useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import Container from "../components/Container";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios";
import { isValidInternationalPhone } from "../utils/validators";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";
import { Country } from "country-state-city";

const floatingLabelSx = {
  color: "black",
  "&.Mui-focused": { color: "#1976d2" },
  "&.MuiInputLabel-shrink": { color: "#1976d2" },
};

const AiValueAdditionForm = ({
  title,
  selectLabel,
  selectFieldName,
  options,
  sheetName,
  extraFields = [],
  includeNationality = true,
}) => {
  const defaultValues = {
    fullName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    contactNumber: "",
    comments: "",
    [selectFieldName]: "",
  };

  if (includeNationality) {
    defaultValues.nationality = "";
  }

  extraFields.forEach(({ name }) => {
    defaultValues[name] = "";
  });

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues,
  });
  const countries = useMemo(() => Country.getAllCountries(), []);
  const selectedResidence = watch("currentResidence");

  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("forms/add-new-b2c-form-submission", {
        ...data,
        sheetName,
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccessAlert("Form submitted successfully");
      reset(defaultValues);
    },
    onError: (error) => {
      showErrorAlert(error?.response?.data?.message || "Failed to submit form");
    },
  });

  const handleCurrentResidenceChange = (countryName, onChange) => {
    const selectedCountry = countries.find(
      (country) => country.name === countryName,
    );
    const phonePrefix = selectedCountry?.phonecode
      ? `+${selectedCountry.phonecode}`
      : "";

    onChange(countryName);
    setValue("contactNumber", phonePrefix, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className="bg-white text-black font-sans">
      <Container padding={false}>
        <section className="min-h-[85vh] flex items-center justify-center py-8">
          <div className="w-full max-w-5xl md:px-20 lg:px-40">
            <Box
              component="form"
              onSubmit={handleSubmit((data) => submitForm(data))}
              className="bg-gray-50/50 p-6 md:p-10 rounded-2xl border border-gray-100 shadow-sm"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold uppercase mb-8 text-center">
                {title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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

                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Gender"
                      variant="standard"
                      required
                      select
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    >
                      <MenuItem value="" disabled>
                        Select Gender
                      </MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name="dateOfBirth"
                  control={control}
                  rules={{ required: "Date of birth is required" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Date of Birth"
                      variant="standard"
                      required
                      type="date"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ shrink: true, sx: floatingLabelSx }}
                    />
                  )}
                />

                {includeNationality && (
                  <Controller
                    name="nationality"
                    control={control}
                    rules={{ required: "Nationality is required" }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nationality"
                        variant="standard"
                        required
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputLabelProps={{ sx: floatingLabelSx }}
                      />
                    )}
                  />
                )}

                {extraFields.map(
                  ({ name, label, type = "text", required = false }) => (
                    <Controller
                      key={name}
                      name={name}
                      control={control}
                      rules={
                        required
                          ? { required: `${label} is required` }
                          : undefined
                      }
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={label}
                          variant="standard"
                          type={type === "country" ? undefined : type}
                          select={type === "country"}
                          required={required}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          value={field.value || ""}
                          onChange={(event) => {
                            if (name === "currentResidence") {
                              handleCurrentResidenceChange(
                                event.target.value,
                                field.onChange,
                              );
                              return;
                            }
                            field.onChange(event.target.value);
                          }}
                          InputLabelProps={{
                            ...(type === "date" ? { shrink: true } : {}),
                            sx: floatingLabelSx,
                          }}
                        >
                          {type === "country" && (
                            <>
                              <MenuItem value="" disabled>
                                SELECT COUNTRY
                              </MenuItem>
                              {countries.map((country) => (
                                <MenuItem
                                  key={country.isoCode}
                                  value={country.name}
                                >
                                  {country.name}
                                </MenuItem>
                              ))}
                            </>
                          )}
                        </TextField>
                      )}
                    />
                  ),
                )}

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
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    />
                  )}
                />

                <Controller
                  name="contactNumber"
                  control={control}
                  rules={{
                    required: "Contact number is required",
                    validate: isValidInternationalPhone,
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contact Number"
                      variant="standard"
                      placeholder={
                        selectedResidence
                          ? "Country code is prefilled based on residence"
                          : ""
                      }
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    />
                  )}
                />

                <Controller
                  name={selectFieldName}
                  control={control}
                  rules={{ required: `${selectLabel} is required` }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={selectLabel}
                      variant="standard"
                      required
                      select
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    >
                      <MenuItem value="" disabled>
                        Select an option
                      </MenuItem>
                      {options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
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
                        minRows={4}
                        label="Comments"
                        variant="standard"
                        InputLabelProps={{ sx: floatingLabelSx }}
                      />
                    )}
                  />
                </div>

                <div className="pt-6 md:col-span-2 text-center">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isPending}
                    sx={{
                      bgcolor: "black",
                      borderRadius: 20,
                      px: { xs: 6, md: 14 },
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: "600",
                      "&:hover": { bgcolor: "#333" },
                      width: { xs: "100%", md: "auto" },
                    }}
                  >
                    {isPending && (
                      <CircularProgress
                        size={16}
                        sx={{ color: "white", mr: 1 }}
                      />
                    )}
                    {isPending ? "SUBMITTING..." : "SUBMIT"}
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

export default AiValueAdditionForm;
