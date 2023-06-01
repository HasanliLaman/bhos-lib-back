const mongoose = require("mongoose");

const uploadSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required."],
    },
    pdf: {
      type: String,
      required: [true, "Document in PDF format is required."],
    },
    name: {
      type: String,
      required: [true, "Document name is required."],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Upload category is required."],
    },
  },
  { timestamps: true }
);

uploadSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category userId",
    select: "slug name surname email photo",
  });
  next();
});

uploadSchema.pre("save", function (next) {
  this.populate({
    path: "category userId",
    select: "slug name surname email photo",
  });
  next();
});

const Upload = mongoose.model("upload", uploadSchema);

module.exports = Upload;
