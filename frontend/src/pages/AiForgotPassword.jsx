import { TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";
import axios from "../utils/axios";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";
import AiPrimaryButton from "./../components/AiPrimaryButton";

export default function AiForgotPassword() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { email: "" },
  });

  // inside your component
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
    <div className="flex items-center justify-center flex-col gap-14 h-[55vh] md:h-[60vh] lg:h-[75vh] border-gray-300 rounded-lg p-8">
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h1 className="text-hero text-center">Forgot Password</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center gap-6"
        >
          {/* Email Input */}
          <div className="w-full sm:w-1/2">
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
          <div className="w-full sm:w-auto flex justify-center items-center mt-2 py-2">
            <AiPrimaryButton
              title="Send"
              type="submit"
              isLoading={isPending}
              disabled={isPending}
              className="bg-primary-blue flex text-white font-[500] capitalize hover:bg-primary-light w-full sm:w-[7rem] px-6"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
