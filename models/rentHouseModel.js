const mongoose = require("mongoose");
const User = require("./userModel");

const rentHouseSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "A home must have a title"],
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
  coverImage: {
    type: String,
    required: [true, "A home must have cover image"],
  },
  images: {
    type: [String],
    validate: {
      validator: function (v) {
        return Array.isArray(v);
      },
      message: "A home must have at least one image",
    },
  },
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
  bedRooms: {
    type: Number,
    required: [true, "A home must have at least 1 bedroom"],
    min: [1, "A home must have at least 1 bedroom"],
  },
  bathRooms: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "A home must have at least 0 bathrooms"],
  },
  state: {
    type: String,
    required: [true, "A home must have a state"],
    default: "Oromia",
    trim: true,
  },
  status: {
    type: String,
    enum: ["available", "rented"],
    default: "available",
  },
  category: {
    type: String,
    required: [true, "A home must have a category"],
    default: "one-room",
  },
});

const RentHouse = mongoose.model("RentHouse", rentHouseSchema);
module.exports = RentHouse;
