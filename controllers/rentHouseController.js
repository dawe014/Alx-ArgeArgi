const RentHouse = require("../models/rentHouseModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/rentHouse");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `rent-home-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image")) {
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

exports.uploadHomePhoto = upload.single("image");
console.log("from upload sell house controller");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};


// Create a new rent house listing
exports.createRentHouse = catchAsync(async (req, res, next) => {
  // Extract the cover image name from req.files
  // Usage in your controller
  console.log("From create Home controller ", req.body);
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
  const newRentHouse = await RentHouse.create({
    ...req.body,
    coverImage: coverImageName[0],
    images: additionalImageNames, // Assuming 'images' field for additional images
  });
  res.status(201).json({
    status: "success",
    data: {
      rentHouse: newRentHouse,
    },
  });
});

// Get all rent house listings
exports.getAllRentHouses = catchAsync(async (req, res, next) => {
  const rentHouses = await RentHouse.find();

  res.status(200).json({
    status: "success",
    results: rentHouses.length,
    data: {
      rentHouses,
    },
  });
});

// Get a single rent house listing by ID
exports.getRentHouse = catchAsync(async (req, res, next) => {
  const home = await RentHouse.findById(req.params.id).populate("user");

  if (!home) {
    return next(new AppError("No rent house found with that ID", 404));
  }

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     home,
  //   },
  // });
  res.render("edit-rent-home", { home });
});

// Update a rent house listing by ID
exports.updateRentHouse = catchAsync(async (req, res, next) => {
  const rentHouse = await RentHouse.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!rentHouse) {
    return next(new AppError("No rent house found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      rentHouse,
    },
  });
});

// Delete a rent house listing by ID
exports.deleteRentHouse = catchAsync(async (req, res, next) => {
  const rentHouse = await RentHouse.findByIdAndDelete(req.params.id);

  if (!rentHouse) {
    return next(new AppError("No rent house found with that ID", 404));
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
  const home = await RentHouse.findById(id);

  if (!home) {
    return next(new AppError("No house found with that ID", 404));
  }
  home.images = home.images.filter((image) => image !== imageUrl);
  await home.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.addImage = catchAsync(async (req, res, next) => {
  console.log("dawe add rent image controller for rent house", req.file);
  const { id } = req.params;
  // const { imageUrl } = `${req.protocol}://${req.get("host")}/uploads/${
  //   req.file.filename
  // }`;
  const imageUrl = filterObj(req.body);

  if (req.file) imageUrl.image = req.file.filename;

  console.log("this is from controller", id, imageUrl);
  const home = await RentHouse.findById(id);

  if (!home) {
    return next(new AppError("No house found with that ID", 404));
  }
  home.images = home.images.filter((image) => image !== imageUrl.image);
  home.images.push(imageUrl.image);
  console.log("rent", home.images);
  const data = await home.save();
  console.log("last", home.images);

  res.status(200).json({
    status: "success",
    data: {
      imageUrl,
    },
  });
});
