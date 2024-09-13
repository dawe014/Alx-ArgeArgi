const catchAsync = require("../utils/catchAsync");
const SellHouse = require("../models/sellHouseModel");
const Lands = require("../models/landModel");
const Rents = require("../models/rentHouseModel");
const Users = require("../models/userModel");
const { RentHousePerm } = require("./authController");

exports.sellHouse = catchAsync(async (req, res) => {
  // 1 get home data from the collection

  const homes = await SellHouse.find();
  // 2 build template
  // 3 Render that template using tour data from 1
  const local = {
    title: "ArgeArgi",
    desc: "Website that connect the seller and buyer to gether",
  };
  res.status(200).render('buyhouse', {
    local, homes
  });
})

exports.viewHouse = catchAsync(async (req, res) => {
  // 1 get home data from the collection

  const home = await SellHouse.findById(req.params.id);
  // 2 build template
  // 3 Render that template using tour data from 1
  const local = {
    title: `${home.name}`,
    desc: "Website that connect the seller and buyer to gether",
  };
  res.status(200).render(`details`, {
    local, home
  });
})
exports.signUp = (req, res) => {
    const local = {
      title: "Sign up for ArgeArgi",
      desc: "Create your account",
    };
    res.status(200).render("signup", {
      local,
      
    });
  }
exports.login = (req, res) => {
    const local = {
      title: "Login to ArgeArgi",
      desc: "Log in to your account",
    };
    res.status(200).render("login", {
      local,
      
    });
  }

exports.getAccount = (req, res) => {
    const local = {
      title: "My account",
      desc: "your account setting",
    };
    res.status(200).render("account", {
     local,
    });
};
  
exports.users = catchAsync(async(req, res) => {
    // 1 get home data from the collection

  const users = await Users.find();
  // 2 build template
  // 3 Render that template using tour data from 1
  const local = {
    title: "Users",
    desc: "Manage Users",
  };
    res.status(200).render("manage-users", {
     local,users
    });
  });
exports.buyHome = catchAsync(async(req, res) => {
    // 1 get home data from the collection

  const homes = await SellHouse.find();
  // 2 build template
  // 3 Render that template using tour data from 1

    res.status(200).render("manage-sell-home", {
      homes,
    });
  });
exports.rentHome = catchAsync(async(req, res) => {
    // 1 get home data from the collection

  const homes = await Rents.find();
  // 2 build template
  // 3 Render that template using tour data from 1

    res.status(200).render("manage-rent-home", {
      homes,
    });
  });
exports.buyLand = catchAsync(async(req, res) => {
    // 1 get home data from the collection

  const land = await Lands.find();
  // 2 build template
  // 3 Render that template using tour data from 1

    res.status(200).render("manage-lands", {
     land
    });
  });