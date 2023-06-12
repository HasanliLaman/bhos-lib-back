const Cart = require("../models/cart");
const factory = require("../utils/factory");
const GlobalFilter = require("../utils/GlobalFilter.js");
const GlobalError = require("../error/GlobalError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCarts = factory.getAll(Cart);
exports.getOneCart = factory.getOne(Cart);
exports.updateCart = factory.updateOne(Cart);
exports.createCart = factory.createOne(Cart);
exports.deleteCart = factory.deleteOne(Cart);

exports.getMyCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const doc = await Cart.findOne({ userId });

  if (!doc) return next(new GlobalError("Invalid ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});
