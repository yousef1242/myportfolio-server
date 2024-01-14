const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sitelink: {
      type: String,
      required: true,
    },
    repolink: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Projects = mongoose.model("Project", projectSchema);

module.exports = {
  Projects,
};
