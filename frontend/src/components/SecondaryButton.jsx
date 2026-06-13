import { CircularProgress } from "@mui/material"; // Import MUI Spinner

const SecondaryButton = ({
  title,
  handleSubmit,
  type,
  fontSize,
  externalStyles,
  disabled,
  padding,
  className,
  isLoading, // New prop for showing the spinner
}) => {
  const baseBgColor = disabled || isLoading ? "bg-gray-400" : "bg-primary-blue";
  const hoverBgColor = disabled || isLoading ? "" : "hover:bg-secondary-light"; // Add hover color here

  return (
    <button
      disabled={disabled || isLoading}
      type={type}
      className={`flex rounded-full items-center cursor-pointer justify-center  gap-2
        ${baseBgColor} ${hoverBgColor} text-primary
        ${fontSize ? fontSize : "text-content leading-5"}
        ${externalStyles} ${padding ? padding : "px-6 py-3"} ${className}`}
      onClick={handleSubmit}>
      {isLoading && <CircularProgress size={16} sx={{ color: "#ffffff" }} />}
      <span className="text-center h-4">{title}</span>
    </button>
  );
};

export default SecondaryButton;
