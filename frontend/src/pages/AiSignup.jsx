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

const SIGNUP_HEADING = "Signup";
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
    let cleanupHeading = () => { };

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
      // setTypedMessage(SIGNUP_PROMPT.slice(0, messageIndex));

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
    <div className="flex items-center justify-center px-4 md:h-[60vh] lg:h-[80vh] border-gray-300 rounded-lg">
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        {/* <p className="mx-auto min-h-[3rem] w-full text-left font-play text-[0.95rem] leading-relaxed text-gray-800 sm:min-h-[3.5rem] sm:text-[1rem]">
          {typedMessage}
        </p> */}

        <h1 className="text-hero min-h-[3rem] text-center font-play">
          {typedSignupHeading}
        </h1>

        <form
          onSubmit={handleSubmit(handleSignup)}
          className={`w-full grid grid-cols-1 md:grid-cols-2 gap-6 ${isFormVisible ? "visible" : "invisible"
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
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
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

          <div className="col-span-1 md:col-span-2 flex justify-center items-center mt-2 py-2 w-full">
            <AiPrimaryButton
              type="submit"
              isLoading={isPending}
              title="Signup"
              disabled={isPending}
              className="bg-primary-blue flex text-white font-[500] capitalize hover:bg-primary-light w-full sm:w-[7rem] px-6"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <p className="text-center">
              Already have an account?&nbsp;
              <span className="underline">
                <Link to="/ai-login">Login</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
