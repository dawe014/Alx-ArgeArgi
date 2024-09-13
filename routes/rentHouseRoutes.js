const express = require("express");
const rentHouseController = require("../controllers/rentHouseController");
const authController = require("../controllers/authController");

const router = express.Router();
// ANY YOUSER CAN PERFORM
router.route("/").get(rentHouseController.getAllRentHouses);
router.route("/:id").get(rentHouseController.getRentHouse);
// Protect all routes after this middleware
router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("admin", "seller"),
    rentHouseController.uploadPhotos,
    rentHouseController.createRentHouse,
  );

router
  .route("/:id")
  .patch(authController.RentHousePerm, rentHouseController.updateRentHouse)
  .delete(authController.RentHousePerm, rentHouseController.deleteRentHouse);


  router
    .route("/:id/image")
    .delete(authController.RentHousePerm, rentHouseController.deleteImage);

  router
    .route("/:id/addimage")
    .post(
      authController.RentHousePerm,
      rentHouseController.uploadHomePhoto,
      rentHouseController.addImage
    );
module.exports = router;
