const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const ApiError = require("../utils/apiError");

exports.multerOptions = (width, height, folder) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      resource_type: "image",
      transformation: { width, height, quality: 90, fetch_format: "webp" },
    },
  });
  const filter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only image files are allowed", 400), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: filter });
  return upload;
};
