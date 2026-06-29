const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, courseId } = req.body;

    //validation of data
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    //create section
    const newSection = await Section.create({ sectionName });

    //update course with section onjectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true },
    )
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
      message: "section created successfully",
      data: updatedCourseDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "unable to create section ,please try again",
      error: error.message,
    });
  }
};

//updateSection handler
exports.updateSection = async (req,res) => {
  try {
    //data input 
    const {sectionName,sectionId,courseId} = req.body;

    //data validation
    if(!sectionName || !sectionId) {
      return res.status(400).json({
        success:false,
        message:"missing properties"
      });
    }

    //update data
    const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

    // get updated course to return
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //return response
    return res.status(200).json({
      success:true,
      message:"Section updated successfully",
      data: updatedCourse
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "unable to update section ,please try again",
      error: error.message,
    });
  }
}


//delete section handler
exports.deleteSection = async (req,res) => {
  try {
    //fetch id
    const {sectionId, courseId} = req.body;
    const sId = sectionId || req.params.sectionId;
    const cId = courseId || req.params.courseId;

    if(!sId || !cId) {
      return res.status(400).json({
        success: false,
        message: "Missing sectionId or courseId",
      });
    }

    //use findbyidanddelete
    const section = await Section.findById(sId);
    if(!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    //delete sub-sections
    await SubSection.deleteMany({_id: {$in: section.subSection}});

    await Section.findByIdAndDelete(sId);

    //todo[testing]:do we need to delete the entry from the course schema?
    // YES, we do!
    const updatedCourse = await Course.findByIdAndUpdate(
      cId,
      {
        $pull: {
          courseContent: sId,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //return response
    return res.status(200).json({
      success:true,
      message:"Section deleted successfully",
      data: updatedCourse
    });

  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "unable to delete section ,please try again",
      error: error.message,
    });
  }
}