import { CircularProgress } from "@mui/material"; // Import MUI Spinner

const AiPrimaryButton = ({
  title,
  handleSubmit,
  type,
  fontSize,
  externalStyles,
  disabled,
  padding,
  className,
  uppercase = false,
  isLoading, // New prop for showing the spinner
}) => {
  const baseBgColor = disabled || isLoading ? "bg-gray-400" : "bg-primary-blue";
  const hoverBgColor = disabled || isLoading ? "" : "hover:bg-black"; // Add hover color here

  return (
    <button
      disabled={disabled || isLoading}
      type={type}
      className={`${className} flex rounded-full items-center cursor-pointer justify-center gap-2
        ${baseBgColor} ${hoverBgColor} text-secondary
        ${fontSize ? fontSize : "text-sm leading-5"}
        ${externalStyles} ${padding ? padding : "px-4 py-2"} `}
      onClick={handleSubmit}
    >
      {isLoading && <CircularProgress size={16} sx={{ color: "#ffffff" }} />}
      <span className={`${uppercase ? "uppercase" : ""} text-center`}>
        {title}
      </span>
    </button>
  );
};

export default AiPrimaryButton;
