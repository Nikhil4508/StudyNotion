const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const RatingAndReview = require("../models/RatingAndReview");
const Profile = require("../models/Profile");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");

//createCourse handler function
exports.createCourse = async (req, res) => {
  try {
    // fetch data (accept both `tag` and `category` from frontend)
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body;

    // get thumbnail (accept multiple possible field names)
    const thumbnail =
      req.files &&
      (req.files.thumbnailImage || req.files.courseImage || req.files.image);

    // validation of data
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const courseStatus = status || "Draft";

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    //check given category is valid or not
    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details not found",
      });
    }

    // upload image to cloudinary (only if provided)
    let thumbnailImage = null;
    if (thumbnail) {
      thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
    }

    // Handle tag and instructions (could be JSON strings)
    let tag = _tag;
    let instructions = _instructions;

    try {
      if (typeof _tag === "string") tag = JSON.parse(_tag);
      if (typeof _instructions === "string") instructions = JSON.parse(_instructions);
    } catch (e) {
      console.log("Error parsing tag or instructions:", e);
    }

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price: Number(price),
      category: categoryDetails._id,
      tag: Array.isArray(tag) ? tag : [tag || "General"],
      thumbnail: thumbnailImage ? thumbnailImage.secure_url : undefined,
      status: courseStatus,
      instructions: Array.isArray(instructions) ? instructions : [instructions].filter(Boolean),
      ratingAndReviews: [],
      studentsEnrolled: [],
    });

    //add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true },
    );

    //update the TAGS schema
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true },
    );

    //return response
    res.status(200).json({
      success: true,
      message: " Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("[createCourse] Detailed error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Course",
      error: error.message,
    });
  }
};

// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    console.log("[editCourse] courseId:", courseId);
    console.log("[editCourse] updates:", updates);

    const course = await Course.findById(courseId);

    if (!course) {
      console.log("[editCourse] Course not found");
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("[editCourse] thumbnail found in files");
      const thumbnail = req.files.thumbnailImage || req.files.courseImage || req.files.image;
      if (thumbnail) {
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        );
        course.thumbnail = thumbnailImage.secure_url;
      }
    }

    // Update only the fields that are present in the request body and are part of the schema
    const schemaFields = [
      "courseName",
      "courseDescription",
      "whatYouWillLearn",
      "price",
      "tag",
      "category",
      "status",
      "instructions",
      "thumbnail",
    ];

    for (const key of schemaFields) {
      if (updates[key] !== undefined && updates[key] !== "undefined") {
        console.log(`[editCourse] Updating field: ${key} with value:`, updates[key]);
        if (key === "tag" || key === "instructions") {
          try {
            course[key] = JSON.parse(updates[key]);
          } catch (e) {
            console.log(`[editCourse] JSON.parse failed for ${key}, trying fallback`);
            // If it's already an array or not a valid JSON string, assign it directly if it's an array
            if (Array.isArray(updates[key])) {
              course[key] = updates[key];
            } else {
              // Handle comma separated string if that's how it's sent
              course[key] = updates[key].split(",").map(item => item.trim());
            }
          }
        } else {
          course[key] = updates[key];
        }
      }
    }

    console.log("[editCourse] Saving course...");
    await course.save();

    console.log("[editCourse] Fetching updated course with population...");
    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    console.log("[editCourse] Success");
    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error editing course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//getAllCourses handler function
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        courseDescription: true,
        instructor: true,
        studentsEnrolled: true,
        ratingAndReviews: true,
      },
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
      message: "Data for all courses fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load Courses data",
      error: error.message,
    });
  }
};

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    //get id
    const { courseId } = req.body;
    //find course details
    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    //return response
    return res.status(200).json({
      success: true,
      message: "Course Details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// GET FULL COURSE DETAILS
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with this id : ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0;
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const timeDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration: timeDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET A LIST OF COURSE FOR A GIVEN INSTRUCTOR
exports.getInstructorCourses = async (req, res) => {
  try {
    // get instructor ID from the authenticated user
    const instructorId = req.user.id;

    // find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    // return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get instructor courses",
      error: error.message,
    });
  }
};

// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
