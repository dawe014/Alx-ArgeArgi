const Land = require("../models/landModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/land");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `land-${req.user.id}-${Date.now()}.${ext}`);
  },
});
// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPhotos = upload.fields([
  { name: "coverImage" },
  { name: "images" },
]);
exports.uploadLandPhoto = upload.single("image");

console.log("from upload land  controller");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
// Create a new land listing
exports.createLand = catchAsync(async (req, res, next) => {
  // Extract the cover image name from req.files
  // Usage in your controller
  console.log("From create land controller ", req.body);
  const coverImage = filterObj(req.files, "coverImage").coverImage;
  const additionalImages = filterObj(req.files, "images").images; // Get all additional images

  console.log("file image", req.files);
  console.log("cover image", coverImage);
  console.log("additional image", additionalImages);
  // Prepare image names
  const coverImageName = coverImage.map((file) => file.filename);
  const additionalImageNames = Array.isArray(additionalImages)
    ? additionalImages.map((file) => file.filename)
    : [additionalImages.filename]; // Handle single image case

  // const additionalImageNames = coverImageName
  console.log("images", coverImageName[0], additionalImageNames);
  // Create the new rent house entry, merging req.body with the image names
  const newLand = await Land.create({
    ...req.body,
    coverImage: coverImageName[0],
    images: additionalImageNames, // Assuming 'images' field for additional images
  });
  res.status(201).json({
    status: "success",
    data: {
      land: newLand,
    },
  });
});

// Get all land listings
exports.getAllLand = catchAsync(async (req, res, next) => {
  const land = await Land.find();

  res.status(200).json({
    status: "success",
    results: land.length,
    data: {
      land,
    },
  });
});

// Get a single land listing by ID
exports.getLand = catchAsync(async (req, res, next) => {
  const land = await Land.findById(req.params.id).populate("user");

  if (!land) {
    return next(new AppError("No land found with that ID", 404));
  }
  res.render("edit-land", { land });

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     land,
  //   },
  // });
});

// Update a land listing by ID
exports.updateLand = catchAsync(async (req, res, next) => {
  const land = await Land.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!land) {
    return next(new AppError("No land found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      land,
    },
  });
});

// Delete a land listing by ID
exports.deleteLand = catchAsync(async (req, res, next) => {
  const land = await Land.findByIdAndDelete(req.params.id);

  if (!land) {
    return next(new AppError("No land found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.deleteImage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { imageUrl } = req.body;
  console.log("this is from controller", id, imageUrl);
  const land = await Land.findById(id);

  if (!land) {
    return next(new AppError("No house found with that ID", 404));
  }
  land.images = land.images.filter((image) => image !== imageUrl);
  await land.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.addImage = catchAsync(async (req, res, next) => {
  console.log("dawe add sell house image controller", req.file);
  const { id } = req.params;
  // const { imageUrl } = `${req.protocol}://${req.get("host")}/uploads/${
  //   req.file.filename
  // }`;
  const imageUrl = filterObj(req.body);

  if (req.file) imageUrl.image = req.file.filename;

  console.log("this is from controller", id, imageUrl);
  const land = await Land.findById(id);

  if (!land) {
    return next(new AppError("No house found with that ID", 404));
  }
  land.images = land.images.filter((image) => image !== imageUrl.image);
  land.images.push(imageUrl.image);
  // console.log("sell",land.images)
  const data = await land.save();
  console.log("sell", land.images);

  res.status(200).json({
    status: "success",
    data: {
      imageUrl,
    },
  });
});
