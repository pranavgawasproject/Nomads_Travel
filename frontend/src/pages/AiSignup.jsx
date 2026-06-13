import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Country } from "country-state-city";
import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios";
import AiPrimaryButton from "../components/AiPrimaryButton";
import { isValidInternationalPhone } from "../utils/validators";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";

const SIGNUP_PROMPT =
  "Create your account to personalize your journey and unlock the full Explorer experience.";

const SIGNUP_HEADING = "Create Account";
const getFlagIconUrl = (isoCode) =>
  `https://flagcdn.com/24x18/${isoCode.toLowerCase()}.png`;

export default function AiSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [typedSignupHeading, setTypedSignupHeading] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      countryOfResidence: "India",
      password: "",
      confirmPassword: "",
      mobile: "+91",
    },
  });

  const selectedCountryName = watch("countryOfResidence");

  const countries = useMemo(() => Country.getAllCountries(), []);
  const selectedCountry = useMemo(
    () =>
      countries.find((country) => country.name === selectedCountryName) ||
      countries.find((country) => country.isoCode === "IN"),
    [countries, selectedCountryName],
  );

  const { mutate: submitRegistration, isPending } = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        sheetName: "Sign_up",
      };

      const response = await axios.post(
        "/forms/add-new-b2c-form-submission",
        payload,
      );

      return response.data;
    },
    onSuccess: () => {
      showSuccessAlert(
        "Signup successful! Please check your email for confirmation.",
      );
      reset();
      navigate("/ai-login");
    },
    onError: (error) => {
      showErrorAlert(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSignup = (data) => submitRegistration(data);

  useEffect(() => {
    setTypedMessage("");
    setTypedSignupHeading("");
    setIsFormVisible(false);

    let messageIndex = 0;
    let signupHeadingIndex = 0;
    let cleanupHeading = () => {};

    const typeSignupHeading = () => {
      const headingInterval = setInterval(() => {
        signupHeadingIndex += 1;
        setTypedSignupHeading(SIGNUP_HEADING.slice(0, signupHeadingIndex));

        if (signupHeadingIndex >= SIGNUP_HEADING.length) {
          clearInterval(headingInterval);
          setIsFormVisible(true);
        }
      }, 7);

      cleanupHeading = () => clearInterval(headingInterval);
    };

    const messageInterval = setInterval(() => {
      messageIndex += 1;

      if (messageIndex >= SIGNUP_PROMPT.length) {
        clearInterval(messageInterval);
        typeSignupHeading();
      }
    }, 0);

    return () => {
      clearInterval(messageInterval);
      cleanupHeading();
    };
  }, []);

  const handleCountryChange = (countryName, onChange) => {
    const country = countries.find((item) => item.name === countryName);
    const phonePrefix = country?.phonecode ? `+${country.phonecode}` : "";

    onChange(countryName);
    setValue("mobile", phonePrefix, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className="animate-fade-in relative flex min-h-[75vh] items-center justify-center px-4 py-8 md:min-h-[80vh]">
      {/* Subtle background gradient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-glow opacity-60 blur-3xl" />
        <div className="absolute left-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-gradient-radial from-neon-purple/10 to-transparent opacity-40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Glass Card */}
        <div className="glass-card p-8 sm:p-10">
          {/* Logo / Brand */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 shadow-glow-sm">
              <span className="text-xl font-bold text-accent">R</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="gradient-text mb-2 min-h-[3rem] text-center text-hero font-bold">
            {typedSignupHeading}
          </h1>

          <p className="mb-8 text-center text-small text-gray-400">
            {typedMessage}
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleSignup)}
            className={`grid grid-cols-1 gap-5 transition-all duration-500 md:grid-cols-2 ${
              isFormVisible
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0"
            }`}
          >
            <Controller
              name="fullName"
              control={control}
              rules={{ required: "Full name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  required
                  variant="standard"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  variant="standard"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="countryOfResidence"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Current Country Of Residence"
                  fullWidth
                  variant="standard"
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
                    handleCountryChange(event.target.value, field.onChange)
                  }
                >
                  {countries.map((country) => (
                    <MenuItem key={country.isoCode} value={country.name}>
                      <Box
                        component="img"
                        src={getFlagIconUrl(country.isoCode)}
                        alt={`${country.name} flag`}
                        sx={{ width: 20, height: 15, mr: 1, flexShrink: 0 }}
                        loading="lazy"
                      />
                      <span>{country.name}</span>
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="mobile"
              control={control}
              rules={{
                required: "Mobile number is required",
                validate: isValidInternationalPhone,
              }}
              render={({ field, fieldState }) => (
                <MuiTelInput
                  {...field}
                  label="Mobile"
                  fullWidth
                  defaultCountry={selectedCountry?.isoCode || "IN"}
                  forceCallingCode
                  required
                  variant="standard"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  required
                  variant="standard"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{ required: "Confirm password is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  required
                  variant="standard"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Submit Button */}
            <div className="col-span-1 flex justify-center md:col-span-2">
              <AiPrimaryButton
                type="submit"
                isLoading={isPending}
                title="Create Account"
                disabled={isPending}
                className="btn-primary w-full rounded-full font-semibold sm:w-auto sm:px-10"
              />
            </div>

            {/* Login link */}
            <div className="col-span-1 md:col-span-2">
              <p className="text-center text-small text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/ai-login"
                  className="text-accent transition-colors hover:text-accent-hover"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
