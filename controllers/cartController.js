const Cart = require("../models/cart");
const factory = require("../utils/factory");
const GlobalFilter = require("../utils/GlobalFilter.js");
const GlobalError = require("../error/GlobalError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCarts = catchAsync(async (req, res, next) => {
  if (
    req.user._id.toString() !== req.params.userId &&
    req.user.role !== "admin"
  )
    return next(new GlobalError("Access denied.", 401));

  let query;
  if (req.params.userId)
    query = new GlobalFilter(
      Cart.find({ userId: req.params.userId }),
      req.query
    );
  else query = new GlobalFilter(Cart.find(), req.query);

  query.filter().sort().fields().paginate();
  const carts = await query.query;

  res.status(200).json({
    status: "success",
    length: carts.length,
    data: {
      carts,
    },
  });
});

exports.getOneCart = factory.getOne(Cart);
exports.updateCart = factory.updateOne(Cart);
exports.createCart = factory.createOne(Cart);
exports.deleteCart = factory.deleteOne(Cart);

// Add to cart
// User sends book request
// Book labeled as "Waiting" on the cart
// Admin accepts the request
// Book labeled as "In Use"
// User sends return request
// Book labeled as "Waiting"
// Admin accepts the request
// Book labeled as "Retured"

// Requests can be 2 types: use and return
// Request: userID, bookID, type, status
