const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
