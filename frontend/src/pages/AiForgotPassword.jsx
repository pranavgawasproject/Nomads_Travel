import { TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";
import AiPrimaryButton from "./../components/AiPrimaryButton";
import { FiArrowLeft } from "react-icons/fi";

export default function AiForgotPassword() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (auth?.user) navigate("/profile", { replace: true });
  }, [auth, navigate]);

  const { mutate: sendEmail, isPending } = useMutation({
    mutationFn: async (data) => {
      console.log("forgot password", data);
      const response = await axios.post("auth/ai-forgot-password", data);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccessAlert(
        data?.message || "Password reset link sent to your email",
      );
      reset();
    },
    onError: (error) => {
      showErrorAlert(
        error.response?.data?.message ||
          "Failed to send email. Please try again.",
      );
    },
  });

  const onSubmit = (data) => sendEmail(data);

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
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="gradient-text mb-2 text-center text-hero font-bold">
            Reset Password
          </h1>

          <p className="mb-8 text-center text-small text-gray-400">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-6"
          >
            {/* Email Input */}
            <div className="w-full">
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
            </div>

            {/* Submit Button */}
            <div className="w-full">
              <AiPrimaryButton
                title="Send Reset Link"
                type="submit"
                isLoading={isPending}
                disabled={isPending}
                className="btn-primary w-full rounded-full font-semibold"
              />
            </div>
          </form>

          {/* Back to login */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/ai-login"
              className="btn-ghost inline-flex items-center gap-2 text-small"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
