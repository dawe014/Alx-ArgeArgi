const express = require("express");
const landController = require("../controllers/landController");
const authController = require("../controllers/authController");

const router = express.Router();
// ALL USER CAN ACCESS THIS ROUTER
router.route("/").get(landController.getAllLand);
router.route("/:id").get(landController.getLand);

// Protect all routes after this middleware
router.use(authController.protect);

router.route("/").post(
  authController.restrictTo("admin", "seller"),
  landController.uploadPhotos,
  landController.createLand
);

router
  .route("/:id")
  .patch(authController.LandPerm, landController.updateLand)
  .delete(authController.LandPerm, landController.deleteLand);
router
  .route("/:id/image")
  .delete(authController.LandPerm, landController.deleteImage);

router
  .route("/:id/addimage")
  .post(
    authController.LandPerm,
    landController.uploadLandPhoto,
    landController.addImage
  );
module.exports = router;
