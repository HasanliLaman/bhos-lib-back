const Book = require("../models/book");
const factory = require("../utils/factory");

exports.getAllBooks = factory.getAll(Book);
exports.getOneBook = factory.getOne(Book);
exports.addBook = factory.createOne(Book);
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);
