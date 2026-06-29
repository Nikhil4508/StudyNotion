const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subSectionId);
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" });
    }

    // Find the course progress entry for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      // No progress record yet — create one now and mark this lecture complete
      courseProgress = await CourseProgress.create({
        courseId,
        userId,
        completedVideos: [subSectionId],
      });

      return res.status(200).json({
        success: true,
        message: "Course progress created and updated",
      });
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res.status(400).json({ error: "Subsection already completed" });
      }

      // Push the subsection into the completedVideos array
      courseProgress.completedVideos.push(subSectionId);
    }

    // Save the updated course progress
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course progress updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
