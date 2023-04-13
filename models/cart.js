const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required."],
      unique: true,
    },
    books: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "book",
          required: [true, "Book ID is required."],
        },
        status: {
          type: String,
          enum: ["Returned", "In Use", "Requested"],
          required: [true, "Book status is required"],
        },
      },
    ],
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "books.bookId userId",
    select: "name surname email title author ISBN cover",
  });
  next();
});

cartSchema.pre("save", function (next) {
  this.populate({
    path: "books.bookId userId",
    select: "name surname email title author ISBN cover",
  });
  next();
});

const Request = mongoose.model("cart", cartSchema);

module.exports = Request;
