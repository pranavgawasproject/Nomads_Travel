import { CircularProgress } from "@mui/material"; // Import MUI Spinner

const GetStartedButton = ({
  title = "Get Started",
  handleSubmit,
  type,
  fontSize,
  externalStyles,
  disabled,
  padding,
  className,
  isLoading, // New prop for showing the spinner
}) => {
  console.log("isLoading", isLoading);
  const baseBgColor = disabled || isLoading ? "bg-gray-400" : "bg-black";
  const resolvedPadding = padding || "px-10 py-3";
  const resolvedFontSize = fontSize || "text-base";
  const resolvedClassName = className || "";
  const resolvedExternalStyles = externalStyles || "";

  return (
    <button
      disabled={disabled || isLoading}
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full ${baseBgColor} ${resolvedPadding} ${resolvedFontSize} text-white ${resolvedClassName} ${resolvedExternalStyles}`}
      onClick={handleSubmit}
    >
      {isLoading && <CircularProgress size={16} sx={{ color: "#ffffff" }} />}
      <span className="text-center">{title}</span>
    </button>
  );
};

export default GetStartedButton;
