const Request = require("../models/request");
const factory = require("../utils/factory");

exports.getAllRequests = factory.getAll(Request);
exports.getOneRequest = factory.getOne(Request);
exports.addRequest = factory.createOne(Request);
exports.updateRequest = factory.updateOne(Request);
exports.deleteRequest = factory.deleteOne(Request);
