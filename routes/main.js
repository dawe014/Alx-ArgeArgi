const express = require("express");
const router = express.Router();
const viewhome = require("./../controllers/viewController");
const authController = require("./../controllers/authController");
const sellHouse = require("./../controllers/sellHouseController");
const rentHouse = require("./../controllers/rentHouseController");
const Land = require("./../controllers/landController");
const Users = require("./../controllers/userController");
const SellHouse = require("../models/sellHouseModel");

router.use(authController.isLoggedIn);

// Route for the home page
router.get("/", (req, res) => {
  const local = {
    title: "ArgeArgi",
    desc: "Website that connect the seller and buyer to gether",
  };
  res.render("index", { local }); // Render index.ejs in the views folder
});

// Other routes can be added here
router.get("/buyhouse", viewhome.sellHouse);
router.get("/rent-house", viewhome.sellHouse);
router.get("/furnitures", viewhome.sellHouse);
router.get("/lands", viewhome.sellHouse);
router.get("/signup", viewhome.signUp);
router.get("/login", viewhome.login);
router.get("/logout", authController.logout);
router.get("/details/:id", viewhome.viewHouse);
// TO ADVERTITE PROPERTY
router.get("/advertise",authController.protect, authController.checkUserRole, sellHouse.getHouse);


router.get("/me", authController.protect, viewhome.getAccount);

/** FOR ADMIN PAGES */
// router.use(authController.protect)
// router.use(authController.restrictTo("admin"));

router.get(
  "/admin/manage-users",
  authController.protect,
  authController.restrictTo("admin"),
  viewhome.users
);
router.get(
  "/admin/edit-user/:id",
  authController.protect,
  authController.restrictTo("admin"),
  Users.getUser
);
router.get(
  "/admin/manage-rent-home",
  authController.protect,
  authController.restrictTo("admin"),
  viewhome.rentHome
);
router.get(
  "/admin/manage-sell-home",
  authController.protect,
  authController.restrictTo("admin"),
  viewhome.buyHome
);
router.get(
  "/admin/manage-lands",
  authController.protect,
  authController.restrictTo("admin"),
  viewhome.buyLand
);

router.get(
  "/admin/edit-home/:id",
  authController.protect,
  authController.restrictTo("admin"),
  sellHouse.getHouse
);
router.get(
  "/admin/update-home/:id",
  authController.protect,
  authController.restrictTo("admin"),
  sellHouse.updateHouse
);
router.post(
  "/admin/delete-home/:id",
  authController.protect,
  authController.restrictTo("admin"),
  sellHouse.deleteHouse
);

// Renting home details
  router.get(
    "/admin/edit-rent-home/:id",
    authController.protect,
    authController.restrictTo("admin"),
    rentHouse.getRentHouse
  );
  router.get(
    "/admin/update-rent-home/:id",
    authController.protect,
    authController.restrictTo("admin"),
    rentHouse.updateRentHouse
  );
  router.post(
    "/admin/delete-rent-home/:id",
    authController.protect,
    authController.restrictTo("admin"),
    rentHouse.deleteRentHouse
  );

// Land details
  router.get(
    "/admin/edit-land/:id",
    authController.protect,
    authController.restrictTo("admin"),
    Land.getLand
  );
  router.get(
    "/admin/update-land/:id",
    authController.protect,
    authController.restrictTo("admin"),
    Land.updateLand
  );
  router.post(
    "/admin/delete-land/:id",
    authController.protect,
    authController.restrictTo("admin"),
    Land.deleteLand
  );

/*

// Route for buying houses
router.get('/buyhouse', categoryController.getBuyHouse);

// Route for renting houses
router.get('/renthouse', categoryController.getRentHouse);

// Route for land
router.get('/land', categoryController.getLand);

// Route for furniture
router.get('/furniture', categoryController.getFurniture);
*/

module.exports = router;
