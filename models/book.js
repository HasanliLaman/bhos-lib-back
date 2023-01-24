const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required."],
    },
    author: {
      type: String,
      required: [true, "Book author is required."],
    },
    categories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "category",
        },
      ],
      required: [true, "Book category array is required."],
      validate: {
        validator: function (val) {
          return val.length <= 3;
        },
        message: "You can add up to 3 categories.",
      },
    },
    description: {
      type: String,
      required: [true, "Book description is required."],
    },
    ISBN: {
      type: String,
      required: [true, "Book ISBN is required."],
      unique: true,
    },
    cover: {
      type: String,
      required: [true, "Book cover image is required."],
    },
    quantity: {
      type: Number,
      required: [true, "Book quantity is required."],
    },
    pdf: {
      type: String,
    },
  },
  { timestamps: true }
);

bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: "categories",
    select: "slug name",
  });
  next();
});

bookSchema.pre("save", function (next) {
  this.populate({
    path: "categories",
    select: "slug name",
  });
  next();
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
