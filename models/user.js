const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minLength: 3,
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
        /^[a-zA-Z0-9._%+-]+@bhos.edu.az$/,
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
      match: [
        /(?:010|012|050|051|055|070|077|099)[0-9]{7}$/,
        "Phone number format is not correct.",
      ],
    },
    IDNumber: {
      required: [true, "Phone is required."],
      type: String,
      match: [
        /^(?:\AZE|AA|AZ|AR)[0-9]{8}$/,
        "ID Number format is not correct.",
      ],
    },
    workplace: {
      type: String,
      default: "Baku Higher Oil School",
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&])[A-Za-z\d.@$!%*?&]{5,15}$/,
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
    resetToken: {
      type: String,
      select: false,
    },
    resetTokenExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
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
