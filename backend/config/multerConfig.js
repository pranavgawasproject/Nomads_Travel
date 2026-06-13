import multer from "multer";

const storage = multer.memoryStorage();

//Multer config for most type of files
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "text/csv" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Only .jpeg, .png, .webp, .csv and .pdf files are allowed"),
        false
      );
    }
  },
});

//Multer config for website file uploads
const uploadImages = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp"
    ) {
      return cb(null, true);
    }
    cb(new Error("Only .jpeg, .png, .webp files are allowed"), false);
  },
});

export { uploadImages };
export default upload;
