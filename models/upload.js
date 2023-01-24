const mongoose = require("mongoose");

const uploadSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User id is required."],
    },
    pdf: {
      type: String,
      required: [true, "Document in PDF format is required."],
    },
    name: {
      type: String,
      required: [true, "Document name is required."],
    },
    categories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "category",
        },
      ],
      required: [true, "Upload category array is required."],
      validate: {
        validator: function (val) {
          return val.length <= 3;
        },
        message: "You can add up to 3 categories.",
      },
    },
  },
  { timestamps: true }
);

uploadSchema.pre(/^find/, function (next) {
  this.populate({
    path: "categories user",
    select: "slug name surname email photo",
  });
  next();
});

uploadSchema.pre("save", function (next) {
  this.populate({
    path: "categories user",
    select: "slug name surname email photo",
  });
  next();
});

const Upload = mongoose.model("upload", uploadSchema);

module.exports = Upload;
