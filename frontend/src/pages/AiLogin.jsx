import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AiPrimaryButton from "../components/AiPrimaryButton";
import useAuth from "../hooks/useAuth";
import axios from "../utils/axios";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";

const LOGIN_PROMPT =
  "Login to unlock all features and get the most out of your Explorer experience.";

const LOGIN_HEADING = "Welcome Back";

const toSentenceCase = (value = "") => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return `${trimmedValue.charAt(0).toUpperCase()}${trimmedValue
    .slice(1)
    .toLowerCase()}`;
};

export default function AiLogin() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { redirectGoal } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [typedHeading, setTypedHeading] = useState("");
  const [typedDescription, setTypedDescription] = useState("");
  const [typedMessage, setTypedMessage] = useState("");
  const [typedLoginHeading, setTypedLoginHeading] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const loginContext = useMemo(() => {
    if (!location.state || typeof location.state !== "object") {
      return null;
    }

    const context = location.state.loginContext;

    if (
      !context ||
      typeof context.title !== "string" ||
      typeof context.description !== "string"
    ) {
      return null;
    }

    return {
      title: context.title,
      description: context.description,
    };
  }, [location.state]);

  useEffect(() => {
    setTypedHeading("");
    setTypedDescription("");
    setTypedMessage("");
    setTypedLoginHeading("");
    setIsFormVisible(false);

    let descriptionIndex = 0;
    let messageIndex = 0;
    let loginHeadingIndex = 0;
    let cleanupDescription = () => {};
    let cleanupMessage = () => {};
    let cleanupLoginHeading = () => {};

    const typeLoginHeading = () => {
      const loginHeadingInterval = setInterval(() => {
        loginHeadingIndex += 1;
        setTypedLoginHeading(LOGIN_HEADING.slice(0, loginHeadingIndex));

        if (loginHeadingIndex >= LOGIN_HEADING.length) {
          clearInterval(loginHeadingInterval);
          setIsFormVisible(true);
        }
      }, 7);

      cleanupLoginHeading = () => clearInterval(loginHeadingInterval);
    };

    const typeLoginPrompt = () => {
      const messageInterval = setInterval(() => {
        messageIndex += 1;
        setTypedMessage(LOGIN_PROMPT.slice(0, messageIndex));

        if (messageIndex >= LOGIN_PROMPT.length) {
          clearInterval(messageInterval);
          typeLoginHeading();
        }
      }, 7);

      cleanupMessage = () => clearInterval(messageInterval);
    };

    if (!loginContext) {
      typeLoginPrompt();

      return () => {
        cleanupMessage();
        cleanupLoginHeading();
      };
    }

    setTypedHeading(toSentenceCase(loginContext.title));
    const descriptionInterval = setInterval(() => {
      descriptionIndex += 1;
      setTypedDescription(loginContext.description.slice(0, descriptionIndex));

      if (descriptionIndex >= loginContext.description.length) {
        clearInterval(descriptionInterval);
        typeLoginPrompt();
      }
    }, 7);

    cleanupDescription = () => clearInterval(descriptionInterval);

    return () => {
      cleanupDescription();
      cleanupMessage();
      cleanupLoginHeading();
    };
  }, [loginContext]);

  useEffect(() => {
    if (auth?.user) {
      const redirectPath =
        location.state &&
        typeof location.state === "object" &&
        typeof location.state.redirectTo === "string" &&
        location.state.redirectTo.startsWith("/")
          ? location.state.redirectTo
          : redirectGoal
            ? `/search/${redirectGoal}/results`
            : "/home";

      navigate(redirectPath, { replace: true });
    }
  }, [auth, location.state, navigate, redirectGoal]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resolveRedirectPath = () => {
    if (
      location.state &&
      typeof location.state === "object" &&
      typeof location.state.redirectTo === "string" &&
      location.state.redirectTo.startsWith("/")
    ) {
      return location.state.redirectTo;
    }

    if (redirectGoal) {
      return `/search/${redirectGoal}/results`;
    }

    return "/home";
  };

  const { mutate: submitLogin, isPending: isLoginPending } = useMutation({
    mutationFn: async (data) => {
      const payload = {
        email: data.email,
        password: data.password,
      };

      const response = await axios.post("auth/login", payload);

      setAuth((prevState) => ({
        ...prevState,
        accessToken: response?.data?.accessToken,
        user: response?.data?.user,
      }));

      return response.data;
    },
    onSuccess: (data) => {
      showSuccessAlert(data?.message || "Login successful");
      reset();

      const redirectPath = resolveRedirectPath();
      const [pathname, search = ""] = redirectPath.split("?");
      const nextParams = new URLSearchParams(search);
      nextParams.set("login", "true");

      navigate(
        {
          pathname,
          search: `?${nextParams.toString()}`,
        },
        { replace: true },
      );
    },
    onError: (error) => {
      if (error.response) {
        const { status, data } = error.response;
        let message = "Something went wrong";

        if (status === 400) message = "Email and password are required";
        else if (status === 401 && data?.message) message = data.message;
        else if (status === 500)
          message = "Internal server error. Please try again.";

        showErrorAlert(message);
      } else {
        showErrorAlert("Network error. Please check your connection.");
      }
    },
  });

  const onSubmit = (formData) => {
    submitLogin(formData);
  };

  return (
    <div className="animate-fade-in relative flex min-h-[75vh] flex-col items-center justify-center px-4 py-8 md:min-h-[80vh]">
      {/* Subtle background gradient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-glow opacity-60 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-gradient-radial from-neon-purple/10 to-transparent opacity-40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Glass Card */}
        <div className="glass-card p-8 sm:p-10">
          {/* Logo / Brand */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 shadow-glow-sm">
              <span className="text-xl font-bold text-accent">R</span>
            </div>
            <p className="min-h-[2.5rem] text-center text-small leading-relaxed text-gray-400 sm:text-content">
              {typedMessage}
            </p>
          </div>

          {/* Context heading */}
          {loginContext ? (
            <h1 className="mx-auto mb-4 min-h-[2rem] w-full text-center text-subtitle font-semibold leading-relaxed text-gray-200 sm:min-h-[3rem]">
              {typedHeading}
            </h1>
          ) : null}
          {loginContext ? (
            <p className="mb-4 min-h-[2rem] w-full text-left text-small leading-relaxed text-gray-400 sm:text-content">
              {typedDescription}
            </p>
          ) : null}

          {/* Welcome Back heading */}
          <h1 className="gradient-text mb-8 min-h-[3rem] text-center text-hero font-bold">
            {typedLoginHeading}
          </h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`flex flex-col gap-5 transition-all duration-500 ${
              isFormVisible
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0"
            }`}
          >
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

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link
                to="/ai-forgot-password"
                className="text-tiny text-accent transition-colors hover:text-accent-hover"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <AiPrimaryButton
              title="Login"
              type="submit"
              isLoading={isLoginPending}
              disabled={isLoginPending}
              className="btn-primary w-full rounded-full font-semibold"
            />

            {/* Signup link */}
            <p className="mt-2 text-center text-small text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/ai-signup"
                className="text-accent transition-colors hover:text-accent-hover"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
