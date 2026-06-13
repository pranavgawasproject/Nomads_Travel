import { TextField, IconButton, InputAdornment } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";
import AiPrimaryButton from "../components/AiPrimaryButton";

export default function AiResetPassword() {
  const { token } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();

  console.log("token", token);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (auth?.user) navigate("/profile", { replace: true });
  }, [auth, navigate]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const { mutate: submitReset, isPending: isResetPending } = useMutation({
    mutationFn: async (data) => {
      const payload = {
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      console.log("reset password", payload);
      const response = await axios.patch(
        `auth/reset-password/${token}`,
        payload,
      );
      return response.data;
    },
    onSuccess: (data) => {
      showSuccessAlert(data?.message || "Password reset successful");
      reset();
      navigate("/login");
    },
    onError: (error) => {
      if (error.response) {
        const { status, data } = error.response;
        let message = "Something went wrong";
        if (status === 400) message = "All fields are required";
        else if (status === 401 && data?.message) message = data.message;
        else if (status === 500)
          message = "Internal server error. Please try again.";
        showErrorAlert(message);
      } else {
        showErrorAlert("Network error. Please check your connection.");
      }
    },
  });

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      showErrorAlert("Passwords do not match");
      return;
    }
    submitReset(data);
  };

  return (
    <div className="animate-fade-in relative flex min-h-[75vh] items-center justify-center px-4 py-8 md:min-h-[80vh]">
      {/* Subtle background gradient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-glow opacity-60 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Glass Card */}
        <div className="glass-card p-8 sm:p-10">
          {/* Icon */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 shadow-glow-sm">
              <svg
                className="h-7 w-7 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="gradient-text mb-2 text-center text-hero font-bold">
            Set New Password
          </h1>

          <p className="mb-8 text-center text-small text-gray-400">
            Enter your new password below. Make sure it&apos;s strong and
            unique.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* New Password */}
            <Controller
              name="password"
              control={control}
              rules={{ required: "New password is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="New Password"
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

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
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

            {/* Password requirements */}
            <div className="rounded-xl border border-glass-border bg-surface-50 p-4">
              <p className="mb-2 text-tiny font-semibold text-gray-300">
                Password Requirements
              </p>
              <ul className="ml-4 list-disc space-y-1 text-tiny text-gray-500">
                <li>Must be at least 8 characters long.</li>
                <li>Should include both uppercase and lowercase letters.</li>
                <li>
                  Must contain at least one number or special character.
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <AiPrimaryButton
              title={"Reset Password"}
              type="submit"
              isLoading={isResetPending}
              disabled={isResetPending}
              className="btn-primary w-full rounded-full font-semibold"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
