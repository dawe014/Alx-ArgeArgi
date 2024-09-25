const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const SellHouse = require("../models/sellHouseModel");
const RentHouse = require("../models/rentHouseModel");
const Land = require("../models/landModel");
const Furniture = require("../models/furnitureModel");
const { log } = require("console");
const { isNumberObject } = require("util/types");

// Sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and send token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// Register a new user
exports.signup = catchAsync(async (req, res, next) => {
  console.log("Hello from signup");
  console.log(req.body);
  const { name, phone, password, passwordConfirm } = req.body;
  // console.log(req.originalUrl);
  // 0. is phone numberis number
  // if (isNumberObject)
  //   if (phone.length != 9) {
  //     // 1) Check if phone number length is 9
  //     return next(new AppError("Please provide  valid phone number!", 400));
  //   }
  // 2) Check if user exists and password is correct
  const user = await User.findOne({ phone });

  if (user) {
    return next(
      new AppError("This phone is already exist. please try another phone", 401)
    );
  }
  if (password != passwordConfirm) {
    return next(new AppError("Please confirm your password", 401));
  }

  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
});

// Login a user
exports.login = catchAsync(async (req, res, next) => {
  console.log("from login autho controller");
  const { phone, password } = req.body;

  // 1) Check if email and password exist
  if (!phone || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ phone }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect phone number or password", 401));
  }

  // 3) If everything is ok, send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  // window.location.href = "/";
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;

  console.log("autho.protect-------");
  console.log(req.body);
  console.log("autho.protect-------");
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  console.log(token);
  if (!token) {
    res.redirect('/login')
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER

      res.locals.user = currentUser;
      if (res.locals.user) {
        return next();
      } else {
        res.locals.user = null;
      }

      return next();
    } catch (err) {
      // console.log(err.response.data.message);
      return next();
    }
  }
  res.locals.user = null;

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.checkUserRole = (req, res, next) => {
  // Assuming you have a `user` object in the request
  // that contains the user's role information
  if (req.user.role !== "admin" && req.user.role !== "seller") {
    // Redirect admin to the request page
    return res.render("seller-request");
  } else {
    // Redirect non-admin, non-seller users to the default page
    return res.render("advertise");
  }
};


exports.SellHousePerm = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const sellHouse = await SellHouse.findById(id);

  if (!sellHouse) {
    return next(new AppError("No house found with that ID", 404));
  }

  // Check if the user is the owner of the house or an admin
  console.log(sellHouse.user.toString());
  console.log(req.user.id);
  if (sellHouse.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  next();
});

exports.RentHousePerm = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const rentHouse = await RentHouse.findById(id);

  if (!rentHouse) {
    return next(new AppError("No renting house found with that ID", 404));
  }

  // Check if the user is the owner of the house or an admin
  console.log(rentHouse.user.toString());
  console.log(req.user.id);
  if (rentHouse.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  next();
});

exports.LandPerm = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const land = await Land.findById(id);

  if (!land) {
    return next(new AppError("No land found with that ID", 404));
  }

  // Check if the user is the owner of the house or an admin
  console.log(land.user.toString());
  console.log(req.user.id);
  if (land.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  next();
});

exports.FurniturePerm = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const furniture = await Furniture.findById(id);

  if (!furniture) {
    return next(new AppError("No furniture found with that ID", 404));
  }

  // Check if the user is the owner of the house or an admin
  console.log(furniture.user.toString());
  console.log(req.user.id);
  if (furniture.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  console.log("update password controller");
  console.log(req.body);

  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});
