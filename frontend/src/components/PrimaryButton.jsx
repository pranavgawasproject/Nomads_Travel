import { CircularProgress } from "@mui/material"; // Import MUI Spinner

const PrimaryButton = ({
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
  const baseBgColor = disabled || isLoading ? "bg-gray-400" : "bg-[#FF5757]";
  const hoverBgColor = disabled || isLoading ? "" : "hover:bg-red-600"; // Add hover color here

  return (
    <button
      disabled={disabled || isLoading}
      type={type}
      className={`${className} flex rounded-full items-center cursor-pointer justify-center gap-2
        ${baseBgColor} ${hoverBgColor} text-secondary
        ${fontSize ? fontSize : "text-content leading-5"}
        ${externalStyles} ${padding ? padding : "px-6 py-3"} `}
      onClick={handleSubmit}
    >
      {isLoading && <CircularProgress size={16} sx={{ color: "#ffffff" }} />}
      <span className={`${uppercase ? "uppercase" : ""} text-center`}>
        {title}
      </span>
    </button>
  );
};

export default PrimaryButton;
