const Book = require("../models/book");
const factory = require("../utils/factory");
const cloudinary = require("../utils/cloudinary");
const catchAsync = require("../utils/catchAsync");
const GlobalError = require("../error/GlobalError");

exports.getAllBooks = factory.getAll(Book);
exports.getOneBook = factory.getOne(Book);

exports.addBook = catchAsync(async (req, res, next) => {
  const request = { ...req.body };

  if (req.file) {
    const img = await cloudinary.v2.uploader.upload(req.file.path);
    request.cover = img.url;
  }

  const doc = await Book.create(request);

  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const request = { ...req.body };

  if (req.file) {
    const img = await cloudinary.v2.uploader.upload(req.file.path);
    request.cover = img.url;
  }

  const id = req.params.id;
  const doc = await Book.findByIdAndUpdate(id, request, {
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

exports.deleteBook = factory.deleteOne(Book);
