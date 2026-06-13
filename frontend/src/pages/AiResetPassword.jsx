import { TextField, IconButton, InputAdornment } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios"; // ✅ use same axios config
// import toast from "react-hot-toast";
import PrimaryButton from "../components/PrimaryButton";
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

  // inside your component
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
    <div className="flex items-center justify-center flex-col gap-14 h-[55vh] md:h-[60vh] lg:h-[75vh] border-gray-300 rounded-lg p-8">
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h1 className="text-hero text-center">Reset Password</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
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

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center items-center mt-2 py-2">
            <AiPrimaryButton
              title={"Reset"}
              type="submit"
              isLoading={isResetPending}
              disabled={isResetPending}
              className="bg-primary-blue flex text-white font-[500] capitalize hover:bg-primary-light w-[7rem] px-6"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
