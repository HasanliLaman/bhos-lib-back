const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const catchAsync = require("../utils/catchAsync");
const GlobalError = require("../error/GlobalError");
const sendMail = require("../utils/email");
const cloudinary = require("../utils/cloudinary");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const userDetails = {
    name: req.body.name,
    surname: req.body.surname,
    paternalName: req.body.paternalName,
    birthDate: req.body.birthDate,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    IDNumber: req.body.IDNumber,
    workplace: req.body.workplace,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    photo: "no",
  };

  if (req.file) {
    const img = await cloudinary.v2.uploader.upload(req.file.path);
    userDetails.photo = img.url;
  }

  const user = await User.create(userDetails);
  user.password = undefined;
  user.active = undefined;

  const token = createToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: { user },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.password || !req.body.email)
    return next(new GlobalError("Please provide email and password.", 400));

  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user || !(await user.comparePassword(req.body.password, user.password)))
    return next(new GlobalError("Email or password is not correct.", 401));

  const token = createToken(user._id);
  user.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: { user },
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email)
    return next(new GlobalError("Please provide an email.", 400));

  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new GlobalError("User does not exists.", 401));

  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  const mailOptions = {
    email: user.email,
    subject: "Reset Password",
    message: `Click to the link: https://tello.az/${resetToken}`,
  };

  await sendMail(mailOptions);

  res.status(200).json({
    status: "success",
    message: "Token has been sent to the mail.",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetToken: hashedResetToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return next(new GlobalError("Token is invalid or expired.", 400));

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(new GlobalError("Your current password is wrong.", 401));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});
