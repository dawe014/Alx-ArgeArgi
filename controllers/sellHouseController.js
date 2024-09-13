const SellHouse = require("../models/sellHouseModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/sellHouse");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `home-${req.user.id}-${Date.now()}.${ext}`);
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
exports.uploadHomePhoto = upload.single("image");

console.log("from upload sell house controller");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
// Create a new house listing
exports.createHouse = catchAsync(async (req, res, next) => {
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
  const newHouse = await SellHouse.create({
    ...req.body,
    coverImage: coverImageName[0],
    images: additionalImageNames, // Assuming 'images' field for additional images
  });
  res.status(201).json({
    status: "success",
    data: {
      house: newHouse,
    },
  });
});

// Get all house listings
exports.getAllHouses = catchAsync(async (req, res, next) => {
  console.log("daweko log");

  const houses = await SellHouse.find();

  res.status(200).json({
    status: "success",
    results: houses.length,
    data: {
      houses,
    },
  });
});

// Get a single house listing by ID
exports.getHouse = catchAsync(async (req, res, next) => {
  const home = await SellHouse.findById(req.params.id);

  if (!home) {
    return next(new AppError("No house found with that ID", 404));
  }

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     house,
  //   },
  // });
  res.render("edit-home", { home });
});

// Update a house listing by ID
exports.updateHouse = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const house = await SellHouse.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!house) {
    return next(new AppError("No house found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      house,
    },
  });
});

// Delete a house listing by ID
exports.deleteHouse = catchAsync(async (req, res, next) => {
  const house = await SellHouse.findByIdAndDelete(req.params.id);

  if (!house) {
    return next(new AppError("No house found with that ID", 404));
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
  const home = await SellHouse.findById(id);

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
  console.log("dawe add sell house image controller", req.file);
  const { id } = req.params;
  // const { imageUrl } = `${req.protocol}://${req.get("host")}/uploads/${
  //   req.file.filename
  // }`;
    const imageUrl = filterObj(req.body);

    if (req.file) imageUrl.image = req.file.filename;

  console.log("this is from controller", id, imageUrl);
  const home = await SellHouse.findById(id);

  if (!home) {
    return next(new AppError("No house found with that ID", 404));
  }
  home.images = home.images.filter((image) => image !== imageUrl.image);
  home.images.push(imageUrl.image);
  // console.log("sell",home.images)
  const data = await home.save();
  console.log("sell",home.images)

  
  res.status(200).json({
    status: "success",
    data: {
      imageUrl
    },
  });
});
