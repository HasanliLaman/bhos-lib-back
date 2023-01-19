const User = require("../models/user");
const factory = require("../utils/factory");

exports.getAllUsers = factory.getAll(User);
exports.getOneUser = factory.getOne(User);
exports.addUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
