const Category = require("../models/category");
const factory = require("../utils/factory");
const cloudinary = require("../utils/cloudinary");
const catchAsync = require("../utils/catchAsync");
const GlobalError = require("../error/GlobalError");

exports.getAllCategories = factory.getAll(Category);
exports.getOneCategory = factory.getOne(Category);

exports.addCategory = catchAsync(async (req, res, next) => {
  const request = { ...req.body };

  if (req.file) {
    const img = await cloudinary.v2.uploader.upload(req.file.path);
    request.image = img.url;
  }

  const doc = await Category.create(request);

  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const request = { ...req.body };

  if (req.file) {
    const img = await cloudinary.v2.uploader.upload(req.file.path);
    request.image = img.url;
  }

  const id = req.params.id;
  const doc = await Category.findByIdAndUpdate(id, request, {
    new: true,
    runValidators: true,
  });

  if (!doc) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.deleteCategory = factory.deleteOne(Category);
