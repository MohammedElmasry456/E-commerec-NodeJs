const asyncHandler = require("express-async-handler");
const cloudinary = require("./cloudinary");
const ApiError = require("./apiError");

exports.deleteImage = async (document, req) => {
  if (document.image) await deleteProcess(document.image);
  else if (document.profileImage) await deleteProcess(document.profileImage);
  else if (document.imageCover) {
    const hasReqBody = req && req.body;
    if (hasReqBody && !req.body.images && req.body.imageCover) {
      await deleteProcess(document.imageCover);
    } else if (hasReqBody && !req.body.imageCover && req.body.images) {
      await Promise.all(document.images.map(async (i) => deleteProcess(i)));
    } else {
      await deleteProcess(document.imageCover);
      await Promise.all(document.images.map(async (i) => deleteProcess(i)));
    }
  }
};

const deleteProcess = asyncHandler(async (image) => {
  const publicId = image.split("/").slice(-3).join("/").split(".")[0];
  const result = await cloudinary.uploader.destroy(publicId);
  if (!result) {
    return new ApiError(`not image for this id ${publicId}`, 404);
  }
  console.log("Deletion Result:", result);
});
