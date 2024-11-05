const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Brand Required"],
      unique: [true, "Brand Must Be Unique"],
      minlength: [3, "Too Short Brand Name"],
      maxlength: [32, "Too Long Brand Name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

// const setUrl = (doc) => {
//   if (doc.image) {
//     const url = `${process.env.BASE_URL}/brands/${doc.image}`;
//     doc.image = url;
//   }
// };

// //for all but not create
// brandSchema.post("init", (doc) => {
//   setUrl(doc);
// });
// //for create
// brandSchema.post("save", (doc) => {
//   setUrl(doc);
// });

const brandModel = mongoose.model("brand", brandSchema);
module.exports = brandModel;
