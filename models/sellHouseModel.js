  const mongoose = require("mongoose");
const User = require("./userModel");

const sellHouseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A home must have a title"],
    trim: true,
    minlength: [5, "A title must have at least 5 characters"],
    maxlength: [40, "A title must have less than 40 characters"],
  },
  price: {
    type: Number,
    required: [true, "A home must have a price"],
    min: [0, "Price must be above 0"],
  },
  description: {
    type: String,
    trim: true,
  },
  area: {
    type: Number,
    required: [true, "A home must have a covered area"],
    min: [0, "Area must be above 0"],
  },
  coverImage: {
    type: String,
    required: [true, "A home must have a cover image"],
  },
  images: {
    type: [String],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "A home must have at least one image",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
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
  location: {
    type: String,
    default:"Nekemte - 07",
    trim: true,
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
    default:"Oromia",
    trim: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A home must have an owner"],
  },
  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available",
  },
});

const SellHouse = mongoose.model("SellHouse", sellHouseSchema);
module.exports = SellHouse;
