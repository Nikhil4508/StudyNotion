const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create subsection handler
exports.createSubSection = async (req, res) => {
  try {
    //fetch data
    const { sectionId, title, description, courseId } = req.body;

    //extract file/video
    const video = req.files.videoFile;

    //validation of data
    if (!sectionId || !title || !description || !video || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME,
    );

    //create sub-section
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    //update section with this subsection objectId
    const updateSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      { new: true },
    ).populate("subSection");

    const updatedCourse = await require("../models/Course").findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "Subsection created successfully",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error ,please try again",
      error: error.message,
    });
  }
};

//updateSubsection handler
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description, courseId } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }

    if (req.files && req.files.videoFile !== undefined) {
      const video = req.files.videoFile;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME,
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    const updatedCourse = await require("../models/Course").findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};

//deleteSubsection handler
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId, courseId } = req.body;
    const sId = subSectionId || req.params.subSectionId;
    const secId = sectionId || req.params.sectionId;
    const cId = courseId || req.params.courseId;

    if(!sId || !secId || !cId) {
      return res.status(400).json({
        success: false,
        message: "Missing subSectionId, sectionId or courseId",
      });
    }

    await Section.findByIdAndUpdate(
      { _id: secId },
      {
        $pull: {
          subSection: sId,
        },
      },
    );
    const subSection = await SubSection.findByIdAndDelete({ _id: sId });

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    const updatedCourse = await require("../models/Course").findById(cId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error deleting subsection:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
      error: error.message,
    });
  }
};
