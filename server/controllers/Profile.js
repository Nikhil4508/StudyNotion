const req = require("express/lib/request");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");

//updateProfile handler
exports.updateProfile = async (req, res) => {
  try {
    //fetch data from req body
    const { firstName, lastName, gender, dateOfBirth = "", about = "", contactNumber } = req.body;

    //get userId
    const id = req.user.id;

    //validation
    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // Update user details
    if (firstName) userDetails.firstName = firstName;
    if (lastName) userDetails.lastName = lastName;
    await userDetails.save();

    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    //return response
    return res.status(200).json({
      success: true,
      message: "Profile Updated successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


//deleteProfile handler
//todo explore -- how can we schedule deletion operation
exports.deleteProfile = async (req,res) => {
  try {
    //get id 
    const id = req.user.id;

    //validation
    const userDetails = await User.findById(id);
    if(!userDetails){
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }

    //delete profile data
    await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

    //todo: HW is unenroll user from all enrolled courses

    //delete user
    await User.findByIdAndDelete({_id:id}); 

    //return response
    return res.status(200).json({
      success:true,
      message:"Profile Deleted successfully"
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  } 
}


//getUserDetails handler
exports.getUserDetails = async (req,res) => {
  try {
    
    //GET ID
    const id  = req.user.id;

    //validation and get user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .populate({
        path: "courses",
        populate: [
          {
            path: "instructor",
          },
          {
            path: "category",
          },
        ],
      })
      .exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //return response
    return res.status(200).json({
      success:true,
      message:"User data fetched successfully",
      userDetails,
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      error:error.message
    })
  }
}


//getEnrolledCourses handler
exports.getEnrolledCourses = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id).select("_id");
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Deep-populate so we can count total sub-sections per course
    const courses = await Course.find({ studentsEnrolled: id })
      .populate("instructor")
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .lean()  // plain JS objects — we'll add progressPercentage to each
      .exec();

    // For every course, look up this user's CourseProgress and compute %
    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        // Count total sub-sections across all sections
        const totalSubSections = course.courseContent.reduce(
          (acc, section) => acc + (section.subSection?.length || 0),
          0
        );

        // Fetch the progress document (may not exist yet)
        const progressDoc = await CourseProgress.findOne({
          courseId: course._id,
          userId: id,
        });

        const completedCount = progressDoc?.completedVideos?.length || 0;

        const progressPercentage =
          totalSubSections === 0
            ? 0
            : Math.round((completedCount / totalSubSections) * 100 * 10) / 10;

        return {
          ...course,
          totalSubSections,
          progressPercentage,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      courses: coursesWithProgress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllUserDetails = exports.getUserDetails;