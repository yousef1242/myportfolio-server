const router = require("express").Router();
const {
  createProjectController,
  getAllProjectsController,
  deleteProjectController,
} = require("../controllers/projectController");
const multer = require("../utils/multer");

// create project
router.post("/create", multer.single("image"), createProjectController);

// fetch projects
router.get("/", getAllProjectsController);

// delete project
router.delete("/delete/:projectId", deleteProjectController);

module.exports = router;
