const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// TODO : Validate ID and Phone

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minLength: 3,
      trim: true,
    },
    surname: {
      type: String,
      required: [true, "Surname is required."],
      minLength: 3,
      trim: true,
    },
    paternalName: {
      type: String,
      required: [true, "Paternal name is required."],
      minLength: 3,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: [true, "Birth date is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      validate: [validator.isEmail, "Please provide correct email."],
      match: [
        /^[a-zA-Z0-9._%+-]+@+\.bhos.edu.az$/,
        "You can only register with BHOS email.",
      ],
      unique: true,
      lowercase: true,
    },
    address: {
      required: [true, "Address is required."],
      type: String,
    },
    phone: {
      required: [true, "Phone is required."],
      type: String,
      // validator:
    },
    IDNumber: {
      required: [true, "Phone is required."],
      type: String,
      // validator
    },
    workplace: {
      type: String,
      default: "Baku Higher Oil School",
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,15}$/,
        "Password must include minimum 5 and maximum 15 characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
      ],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm password is required."],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and Confirm Password should match.",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    photo: {
      type: String,
      required: [true, "User photo is required."],
    },
    resetToken: String,
    resetTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.wasNew = this.isNew;
  if (!this.isModified("password")) return next();
  const newPassword = await bcrypt.hash(this.password, 12);
  this.password = newPassword;
  this.confirmPassword = undefined;
  next();
});

// userSchema.post("save", async function (doc, next) {
//   if (!this.wasNew) return next();

//   await Cart.create({
//     products: [],
//     user: doc._id,
//   });
//   next();
// });

userSchema.methods.comparePassword = async (providedPassword, userPassword) => {
  return await bcrypt.compare(providedPassword, userPassword);
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(15).toString("hex");
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetToken = hashedResetToken;
  this.resetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
