const expressAsyncHandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary");
const { Projects } = require("../models/projects");

/**-------------------------------------
 *  @dec create project
 * @route /api/v2/projects/create
 * @method POST
 * @access private (admin only)
 -------------------------------------*/
const createProjectController = expressAsyncHandler(async (req, res) => {
  const file = req.file;

  // if file not exist
  if (!file) {
    return res.status(400).json({ ok: false, message: "No file provided!" });
  }

  // if file exist add it in cloudinary
  const cloudinaryResult = await cloudinary.uploader.upload(file.path, {
    resource_type: "image",
    folder: "my-portfolio", // folder name in cloudinary
    format: "jpg", // convert file to jpg
    transformation: {
      width: 1200,
      height: 800,
      quality: "auto:best",
    },
  });
  if (!cloudinaryResult) {
    return res
      .status(400)
      .json({ ok: false, message: "Somthing went wrong in cloudinary!" });
  }

  // new project
  const newProject = new Projects({
    ...req.body,
    image: {
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
    },
  });

  // save project
  const saveProject = await newProject.save();
  return res
    .status(200)
    .json({ ok: true, message: "Project has been created", saveProject });
});

/**-------------------------------------
 *  @dec fetch projects
 * @route /api/v2/projects
 * @method POST
 * @access private (anyone)
 -------------------------------------*/
const getAllProjectsController = expressAsyncHandler(async (req, res) => {
  const projects = await Projects.find({}).select("-__v");
  res.status(200).json({ ok: true, projects });
});

/**-------------------------------------
 *  @dec delete project
 * @route /api/v2/projects/delete/:projectId
 * @method POST
 * @access private (admin only)
 -------------------------------------*/
const deleteProjectController = expressAsyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    return res
      .status(400)
      .json({ ok: false, message: "Project id doesn't exist!" });
  }
  const project = await Projects.findById(projectId).select("-__v");
  if (!project) {
    return res
      .status(400)
      .json({ ok: false, message: "Project doesn't exist!" });
  }
  if (project?.image?.publicId !== null) {
    const imageDeleteDone = await cloudinary.uploader.destroy(
      project?.image?.publicId
    );
    // if image not delete
    if (!imageDeleteDone) {
      return res
        .status(400)
        .json({ ok: false, message: "Image doesn't delete!" });
    }
    // if image delete
    await Projects.findByIdAndDelete(projectId);
    res.status(200).json({ ok: true, message: "Project has been deleted!" });
  }
});

module.exports = {
  createProjectController,
  getAllProjectsController,
  deleteProjectController,
};
