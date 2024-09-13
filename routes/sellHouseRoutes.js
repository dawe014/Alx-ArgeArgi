const express = require("express");
const sellHouseController = require("../controllers/sellHouseController");
const authController = require("../controllers/authController");
// const { checkOwnershipOrAdmin } = require("../middlewares/authMiddleware");
const multer = require("multer");

const storage = multer.memoryStorage(); // or diskStorage for saving files on disk
const upload = multer({ storage: storage });

const router = express.Router();

// ANY USER CAN SEE THE SELL HOME

router.route("/").get(authController.protect, sellHouseController.getAllHouses);

router.route("/details:id").get(sellHouseController.getHouse);
// Protect all routes after this middleware
router.use(authController.protect);

router.route("/").post(
  authController.restrictTo("admin", "seller"),
  sellHouseController.uploadPhotos,
  sellHouseController.createHouse
);

router
  .route("/:id")
  .patch(authController.SellHousePerm, sellHouseController.updateHouse)
  .delete(authController.SellHousePerm, sellHouseController.deleteHouse);
router
  .route("/:id/image")
  .delete(authController.SellHousePerm, sellHouseController.deleteImage);

router
  .route("/:id/addimage")
  .post(
    authController.SellHousePerm,
    sellHouseController.uploadHomePhoto,
    sellHouseController.addImage
  );

module.exports = router;
