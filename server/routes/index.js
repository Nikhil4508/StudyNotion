const express = require("express");
const router = express.Router();

// controllers
const AuthController = require("../controllers/Auth");
const ProfileController = require("../controllers/Profile");
const CourseController = require("../controllers/Course");
const PaymentController = require("../controllers/Payment");
const CategoryController = require("../controllers/Categorys");
const RatingController = require("../controllers/RatingAndReview");
const ResetPasswordController = require("../controllers/ResetPassword");
const SectionController = require("../controllers/Section");
const SubsectionController = require("../controllers/Subsection");
const CourseProgressController = require("../controllers/courseProgress");

const { auth } = require("../middlewares/auth");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mailSender = require("../utils/mailSender");
const User = require("../models/User");

// AUTH ROUTES
router.post("/auth/sendotp", AuthController.sendOTP);
router.post("/auth/signup", AuthController.signUp);
router.post("/auth/login", AuthController.login);
router.post("/auth/changePassword", auth, AuthController.changePassword);

// RESET PASSWORD
router.post("/auth/reset-password-token", ResetPasswordController.mailSender);
router.post("/auth/reset-password", ResetPasswordController.resetPassword);

// PROFILE / SETTINGS
router.get("/profile/getUserDetails", auth, ProfileController.getUserDetails);
router.get(
  "/profile/getEnrolledCourses",
  auth,
  ProfileController.getEnrolledCourses,
);
router.put("/profile/updateProfile", auth, ProfileController.updateProfile);
router.delete("/profile/deletePassword", auth, ProfileController.deleteProfile);

// update display picture
router.post("/profile/updateDisplayPicture", auth, async (req, res) => {
  try {
    if (!req.files || !req.files.displayPicture) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const file = req.files.displayPicture;
    const uploadResult = await uploadImageToCloudinary(
      file,
      process.env.FOLDER_NAME || "StudyNotion",
    );

    // update user's image field
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { image: uploadResult.secure_url },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Display picture updated",
      image: uploadResult.secure_url,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not update display picture",
      error: error.message,
    });
  }
});

// COURSE ROUTES
router.get("/course/getAllCourses", CourseController.showAllCourses);
router.post("/course/getCourseDetails", CourseController.getCourseDetails);
router.post("/course/createCourse", auth, CourseController.createCourse);
router.put("/course/editCourse", auth, CourseController.editCourse);
router.get(
  "/course/getInstructorCourses",
  auth,
  CourseController.getInstructorCourses,
);
router.post(
  "/course/getFullCourseDetails",
  auth,
  CourseController.getFullCourseDetails,
);
router.delete("/course/deleteCourse", auth, CourseController.deleteCourse);
router.post(
  "/course/updateCourseProgress",
  auth,
  CourseProgressController.updateCourseProgress,
);

// SECTION ROUTES
router.post("/course/addSection", auth, SectionController.createSection);
router.put("/course/updateSection", auth, SectionController.updateSection);
router.delete("/course/deleteSection", auth, SectionController.deleteSection);

// SUBSECTION ROUTES
router.post(
  "/course/addSubSection",
  auth,
  SubsectionController.createSubSection,
);
router.put(
  "/course/updateSubSection",
  auth,
  SubsectionController.updateSubSection,
);
router.delete(
  "/course/deleteSubSection",
  auth,
  SubsectionController.deleteSubSection,
);

// CATEGORY ROUTES
router.get("/course/showAllCategories", CategoryController.showAllCategory);
router.post(
  "/course/getCategoryPageDetails",
  CategoryController.categoryPageDetails,
);

// RATING & REVIEW
router.post("/course/createRating", auth, RatingController.createRating);
router.get("/course/getReviews", RatingController.getAllRating);

// PAYMENT
router.post("/payment/capturePayment", auth, PaymentController.capturePayment);
router.post("/payment/verifyPayment", auth, PaymentController.verifyPayment);
router.post("/payment/sendPaymentSuccessEmail", auth, PaymentController.sendPaymentSuccessEmail);
  
// CONTACT / REACH
router.post("/reach/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const body = `<p>From: ${name} &lt;${email}&gt;</p><p>Message: ${message}</p>`;
    await mailSender(process.env.MAIL_USER, "Contact Us - StudyNotion", body);
    return res.status(200).json({ success: true, message: "Message sent" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Could not send message" });
  }
});

module.exports = router;
