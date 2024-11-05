const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email Required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: [6, "Too Short Password"],
      required: [true, "Password Required"],
    },
    passwordChangedAt: Date,
    PasswordResetCode: String,
    PasswordResetCodeExpire: Date,
    PasswordResetVerified: Boolean,
    phone: String,
    profileImage: String,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    addresses: [
      {
        alias: String,
        details: String,
        phone: String,
        city: String,
        postal: String,
      },
    ],
  },
  { timestamps: true }
);

// const setUrl = (doc) => {
//   if (doc.profileImage) {
//     const url = `${process.env.BASE_URL}/users/${doc.profileImage}`;
//     doc.profileImage = url;
//   }
// };

// //for all but not create
// userSchema.post("init", (doc) => {
//   setUrl(doc);
// });
// //for create
// userSchema.post("save", (doc) => {
//   setUrl(doc);
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
