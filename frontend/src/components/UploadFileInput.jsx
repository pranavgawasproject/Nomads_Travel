import React, { useRef, useState, useEffect } from "react";
import { TextField, IconButton, Avatar, Box } from "@mui/material";
import { LuImageUp } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import MuiModal from "./MuiModal";

const UploadFileInput = ({
  value,
  onChange,
  disabled = false,
  label = "Upload File",
  allowedExtensions = ["jpg", "jpeg", "png", "pdf", "webp"],
  previewType = "auto",
  id,
}) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const getExtension = (fileName = "") =>
    fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "";

  const isImage = (ext) =>
    ["jpg", "jpeg", "png", "webp", "gif", "bmp"].includes(ext);

  const isPDF = (ext) => ext === "pdf";

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = getExtension(file.name);
      if (!allowedExtensions.includes(ext)) {
        alert(`Only ${allowedExtensions.join(", ")} files are allowed.`);
        return;
      }

      onChange(file);
    }
  };

  const handleClear = () => {
    onChange(null);
    setPreviewUrl(null);
  };

  const acceptAttr = allowedExtensions.map((ext) => `.${ext}`).join(",");

  const renderPreview = () => {
    if (!value || !previewUrl) return null;

    const ext = getExtension(value.name || "");
    const type =
      previewType === "auto"
        ? isImage(ext)
          ? "image"
          : isPDF(ext)
          ? "pdf"
          : "none"
        : previewType;

    if (type === "image") {
      return (
        <Avatar
          src={previewUrl}
          alt="Preview"
          sx={{ width: "100%", height: 200, borderRadius: 2, mt: 1 }}
          variant="square"
        />
      );
    }

    if (type === "pdf") {
      return (
        <iframe
          src={previewUrl}
          title="PDF Preview"
          style={{
            width: "100%",
            height: "300px",
            borderRadius: "8px",
            marginTop: "8px",
          }}
        />
      );
    }

    return (
      <div className="text-gray-500 text-sm mt-1">Preview not available</div>
    );
  };

  return (
    <Box className="flex flex-col gap-2">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptAttr}
        disabled={disabled}
        hidden
        id={id ?? "file-upload"}
        onChange={handleFileChange}
      />

      {/* Display TextField Trigger */}
      <TextField
        size="small"
        variant="outlined"
        fullWidth
        label={label}
        disabled={disabled}
        value={value?.name || ""}
        placeholder="Choose a file..."
        InputProps={{
          readOnly: true,
          endAdornment: (
            <IconButton
              component="label"
              htmlFor={id ?? "file-upload"}
              color="primary">
              <LuImageUp />
            </IconButton>
          ),
        }}
      />

      {/* Inline Preview */}
      {renderPreview()}

      {/* Delete */}
      {value && previewUrl && (
        <div className="flex justify-end">
          <IconButton color="error" onClick={handleClear}>
            <MdDelete />
          </IconButton>
        </div>
      )}
    </Box>
  );
};

export default UploadFileInput;
