const Furniture = require("../models/furnitureModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Create a new furniture listing
exports.createFurniture = catchAsync(async (req, res, next) => {
  const newFurniture = await Furniture.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      furniture: newFurniture,
    },
  });
});

// Get all furniture listings
exports.getAllFurniture = catchAsync(async (req, res, next) => {
  const furniture = await Furniture.find();

  res.status(200).json({
    status: "success",
    results: furniture.length,
    data: {
      furniture,
    },
  });
});

// Get a single furniture listing by ID
exports.getFurniture = catchAsync(async (req, res, next) => {
  const furniture = await Furniture.findById(req.params.id).populate("user");

  if (!furniture) {
    return next(new AppError("No furniture found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      furniture,
    },
  });
});

// Update a furniture listing by ID
exports.updateFurniture = catchAsync(async (req, res, next) => {
  const furniture = await Furniture.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!furniture) {
    return next(new AppError("No furniture found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      furniture,
    },
  });
});

// Delete a furniture listing by ID
exports.deleteFurniture = catchAsync(async (req, res, next) => {
  const furniture = await Furniture.findByIdAndDelete(req.params.id);

  if (!furniture) {
    return next(new AppError("No furniture found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
