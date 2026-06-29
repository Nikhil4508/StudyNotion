const crypto = require("crypto");
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");


// initiate the razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.json({
      success: false,
      message: "Please provide Course Id",
    });
  }

  let totalAmount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(200).json({
          success: false,
          message: "Could not find the course",
        });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is Already Enrolled.",
        });
      }

      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not Initiate Order.",
    });
  }
};

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({
      success: false,
      message: "Payment Failed: Missing fields",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  console.log("Expected:", expectedSignature);
  console.log("Received:", razorpay_signature);
  console.log("Match:", expectedSignature === razorpay_signature);

  if (expectedSignature === razorpay_signature) {
    try {
      await enrollStudents(courses, userId);
      return res.status(200).json({
        success: true,
        message: "Payment Verified",
      });
    } catch (error) {
      console.log("Enrollment error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  return res.status(200).json({
    success: false,
    message: "Payment Failed: Signature mismatch",
  });
};

const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    throw new Error("Please Provide Data for Courses or UserId");
  }

  for (const courseId of courses) {
    // find the course and enroll the student in it
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { studentsEnrolled: userId } },
      { new: true },
    );

    if (!enrolledCourse) {
      throw new Error("Course Not Found");
    }

    // find the student and add the course to their list of enrolledCourses
    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      { $push: { courses: courseId } },
      { new: true },
    );

    // send mail to student
    const emailResponse = await mailSender(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        `${enrolledStudent.firstName}`,
      ),
    );
    console.log("Email Sent Successfully", emailResponse.response);
  }
};


exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the fields",
    });
  }

  try {
    // student ko dhundo
    const enrollStudent = await User.findById(userId);
    await mailSender(
      enrollStudent.email,
      `PaymentRecieved`,
      paymentSuccessEmail(`${enrollStudent.firstName}`,
        amount/100,orderId,paymentId)
    )
  } catch (error) {
    console.log("Error in Sending mail",error);
    return res.status(500).json({
      success:false,
      message:"Could not send email",
    });
  }

};

// //capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//   //get id
//   const { course_Id } = req.body;
//   const userId = req.user.id;
//   //validation
//   //valid courseId
//   if (!course_Id) {
//     return res.json({
//       success: false,
//       message: "Please provide valid course ID",
//     });
//   }
//   //valid courseDetails
//   let course;
//   try {
//     course = await Course.findById(course_Id);
//     if (!course) {
//       return res.json({
//         success: false,
//         message: "Could not find the course",
//       });
//     }

//     //user already pay for the same course
//     const uid = new mongoose.Types.ObjectId(userId);
//     if (course.studentsEnrolled.includes(uid)) {
//       return res.status(200).json({
//         success: false,
//         message: "Student already Enrolled",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }

//   //create order
//   const amount = course.price;
//   const currency = "INR";

//   const options = {
//     amount: amount * 100,
//     currency,
//     receipt: math.random(Date.now()).toString(),
//     notes: {
//       courseId: course_Id,
//       userId,
//     },
//   };

//   try {
//     //initiate the payment using Razorpay
//     const paymentResponse = await instance.orders.create(options);
//     console.log("payment Response is: ", paymentResponse);
//     //return response
//     return res.status(200).json({
//       success: true,
//       courseName: course.courseName,
//       courseDescription: course.courseDescription,
//       thumbnail: course.thumbnail,
//       orderId: paymentResponse.id,
//       currency: paymentResponse.currency,
//       amount: paymentResponse.amount,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       success: false,
//       message: "Could not initiate order",
//       error: error.message,
//     });
//   }
// };

// //verify signature of Razorpay
// exports.verifySignature = async (req, res) => {
//   const webhookSecret = "123456789";

//   const signature = req.headers["x-razorpay-signature"];

//   const shasum = crypto.createHmac("sha256", webhookSecret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   if (signature === digest) {
//     console.log("Payment is Authorised");
//   }
// };
