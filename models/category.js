const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
    },
    slug: String,
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

categorySchema.post("findOneAndUpdate", async function (doc, next) {
  await doc.save();
  next();
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
