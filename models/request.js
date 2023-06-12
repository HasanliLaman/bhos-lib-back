const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required."],
    },
    type: {
      type: String,
      enum: ["issue", "return"],
      required: [true, "Request status is required."],
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: [true, "Book ID is required."],
    },
  },
  { timestamps: true }
);

requestSchema.pre(/^find/, function (next) {
  this.populate({
    path: "bookId userId",
  });
  next();
});

requestSchema.pre("save", function (next) {
  this.populate({
    path: "bookId userId",
  });
  next();
});

const Request = mongoose.model("request", requestSchema);

module.exports = Request;
