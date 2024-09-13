const express = require("express");
const furnitureController = require("../controllers/furnitureController");
const authController = require("../controllers/authController");

const router = express.Router();
// ALL USER CAN ACCESS THIS ROUTER
router.route("/").get(furnitureController.getAllFurniture);
router.route("/:id").get(furnitureController.getFurniture);

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("admin", "seller"),
    furnitureController.createFurniture
  );

router
  .route("/:id")
  .patch(authController.FurniturePerm, furnitureController.updateFurniture)
  .delete(authController.FurniturePerm, furnitureController.deleteFurniture);

module.exports = router;
