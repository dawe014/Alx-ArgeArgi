const mongoose = require("mongoose");
const User = require("./userModel");
const slugify = require("slugify");

const furnitureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A furniture must have a name"],
    trim: true,
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "A furniture must have a price"],
  },
  condition: {
    type: String,
    enum: ["new", "used"],
    required: [true, "A furniture must have a condition"],
  },
  location: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: [true, "A furniture must have a cover image."],
  },
  images: [String],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  availability: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Furniture must belong to a seller"],
  },
  categories: [
    {
      type: String,
      enum: [
        "for-home",
        "for-office",
        "living-room",
        "bedroom",
        "kitchen",
        "sofa",
        "chair",
      ],
    },
  ],
  address: {
    type: String,
    required: [true, "A furniture must have an address"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "A furniture must have a city"],
    trim: true,
  },
  state: {
    type: String,
    required: [true, "A furniture must have a state"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available",
  },
  tags: [String],
});

furnitureSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  this.updatedAt = Date.now();
  next();
});

const Furniture = mongoose.model("Furniture", furnitureSchema);
module.exports = Furniture;
