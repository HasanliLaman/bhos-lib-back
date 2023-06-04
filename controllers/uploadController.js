const Upload = require("../models/upload");
const factory = require("../utils/factory");
const GlobalFilter = require("../utils/GlobalFilter.js");
const GlobalError = require("../error/GlobalError");
const catchAsync = require("../utils/catchAsync");

exports.getAllUploads = catchAsync(async (req, res, next) => {
  let query;
  if (req.params.userId)
    query = new GlobalFilter(
      Upload.find({ userId: req.params.userId }),
      req.query
    );
  else query = new GlobalFilter(Upload.find(), req.query);

  query.filter().sort().fields().paginate();
  const doc = await query.query;

  res.header("Access-Control-Expose-Headers", `x-total-count`);
  res.header("x-total-count", `${doc.length}`);

  res.status(200).json({
    status: "success",
    length: doc.length,
    data: {
      doc,
    },
  });
});

exports.addUpload = catchAsync(async (req, res, next) => {
  if (
    req.user._id.toString() !== req.params.userId &&
    req.user.role !== "admin"
  )
    return next(new GlobalError("Access denied.", 401));

  req.body.userId = req.user._id;
  const doc = await Upload.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.updateUpload = catchAsync(async (req, res, next) => {
  if (
    req.user._id.toString() !== req.params.userId &&
    req.user.role !== "admin"
  )
    return next(new GlobalError("Access denied.", 401));

  const id = req.params.id;
  const doc = await Upload.findByIdAndUpdate(id, req.body, {
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

exports.deleteUpload = catchAsync(async (req, res, next) => {
  if (
    req.user._id.toString() !== req.params.userId &&
    req.user.role !== "admin"
  )
    return next(new GlobalError("Access denied.", 401));

  const id = req.params.id;
  const doc = await Upload.findByIdAndDelete(id);

  if (!doc) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
  });
});

exports.getOneUpload = factory.getOne(Upload);
