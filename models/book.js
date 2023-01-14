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
    categories: {},
    description: {},
    ISBN: {},
    cover: {},
    quantity: {},
    pdf: {},
  },
  { timestamps: true }
);

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
