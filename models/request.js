const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({}, { timestamps: true });

const Request = mongoose.model("request", requestSchema);

module.exports = Request;
