const mongoose = require("mongoose");
const User = require("./userModel");

const landSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "A land must have a name"],
    trim: true,
    minlength: [5, "a title must have at least 5 characters"],
    maxlength: [40, "a title must have less than 40 characters"],
  },
  price: {
    type: Number,
    required: [true, "A home must have price"],
  },
  description: {
    type: String,
    trim: true,
  },
  area: {
    type: Number,
    required: [true, "A home must have cover area"],
  },
  coverImage: {
    type: String,
    required: [true, "A home must have cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  location: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A home must have the owner"],
  },
  kebele: {
    type: String,
    required: [true, "A home must have an kebele"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "A home must have a city"],
    trim: true,
  },
  state: {
    type: String,
    required: [true, "A home must have a state"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available",
  },
});

const Land = mongoose.model("Land", landSchema);
module.exports = Land;
