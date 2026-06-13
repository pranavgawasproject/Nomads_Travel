import React, { useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Country } from "country-state-city";
import Container from "../components/Container";
import axios from "../utils/axios";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";
import { isValidInternationalPhone } from "../utils/validators";

const floatingLabelSx = {
  color: "black",
  "&.Mui-focused": { color: "#1976d2" },
  "&.MuiInputLabel-shrink": { color: "#1976d2" },
};

const defaultSupportOptions = [
  "Visa & Immigration",
  "Relocation Assistance",
  "Accommodation Support",
  "Compliance & Documentation",
  "Local Setup Guidance",
  "Other",
];

const AiServiceSupportForm = ({
  title,
  countryLabel,
  countryFieldName,
  supportFieldName,
  sheetName,
  supportOptions = defaultSupportOptions,
}) => {
  const defaultValues = {
    fullName: "",
    email: "",
    nationalityOnPassport: "",
    [countryFieldName]: "",
    contactNumber: "",
    [supportFieldName]: [],
    comments: "",
  };

  const countries = useMemo(() => Country.getAllCountries(), []);

  const { control, handleSubmit, reset } = useForm({ defaultValues });

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
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    >
                      <MenuItem value="" disabled>
                        SELECT COUNTRY
                      </MenuItem>
                      {countries.map((country) => (
                        <MenuItem key={country.isoCode} value={country.name}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  name={countryFieldName}
                  control={control}
                  rules={{ required: `${countryLabel} is required` }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label={countryLabel}
                      variant="standard"
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    >
                      <MenuItem value="" disabled>
                        SELECT COUNTRY
                      </MenuItem>
                      {countries.map((country) => (
                        <MenuItem key={country.isoCode} value={country.name}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </TextField>
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
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                    />
                  )}
                />

                <Controller
                  name={supportFieldName}
                  control={control}
                  rules={{
                    validate: (value) =>
                      value?.length > 0 ||
                      "At least one support item is required",
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      fullWidth
                      select
                      label="Support Required"
                      variant="standard"
                      required
                      value={field.value || []}
                      onChange={(event) => field.onChange(event.target.value)}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ sx: floatingLabelSx }}
                      SelectProps={{
                        multiple: true,
                        renderValue: (selected) => selected.join(", "),
                      }}
                    >
                      {supportOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          <Checkbox
                            checked={(field.value || []).includes(option)}
                          />
                          <ListItemText primary={option} />
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
                        label="Additional Comments"
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

export default AiServiceSupportForm;
