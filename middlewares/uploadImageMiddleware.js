const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const storage = multer.memoryStorage();
  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Image Only", 400), false);
    }
  };
  const upload = multer({ storage: storage, fileFilter: fileFilter });
  return upload;
};

exports.uploadSingleImage = (field) => multerOptions().single(field);

exports.uploadMixImages = (fields) => multerOptions().fields(fields);
