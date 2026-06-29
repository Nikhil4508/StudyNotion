const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { setOtp, getOtp, clearOtp } = require("../utils/otpStore");
require("dotenv").config();

//send otp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from req body
    const { email } = req.body;

    //check if user already exist or not
    const existingUser = await User.findOne({ email });

    //if user already exists then return a response
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate otp
    let otp = otpGenerator.generate({
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    otp = String(otp || Math.floor(100000 + Math.random() * 900000)).trim();

    console.log("OTP IS : ", otp, "LEN:", otp.length);

    //check unique otp or not
    let result = await OTP.findOne({ otpValue: otp });

    while (result) {
      otp = otpGenerator.generate({
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otpValue: otp });
    }

    const otpPayload = { email, otpValue: otp };

    // keep a short-lived in-memory fallback so verification still works if DB persistence fails
    setOtp(email, otp);

    //create a new otp entry in database
    try {
      const otpBody = await OTP.create(otpPayload);
      console.log("otp body is: ", otpBody);
    } catch (dbError) {
      console.log(
        "OTP persistence failed, falling back to memory store: ",
        dbError.message,
      );
    }

    try {
      await mailSender(
        email,
        `Verification Email from StudyNotion - OTP ${otp}`,
        `
          <div style="font-family: Arial, sans-serif; padding: 24px; background: #f6f8fb;">
            <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; padding: 28px;">
              <h1 style="margin: 0 0 12px; font-size: 22px; color: #111827;">StudyNotion verification code</h1>
              <p style="margin: 0 0 24px; font-size: 15px; color: #4b5563;">Use this code to complete your signup.</p>
              <div style="padding: 16px 20px; border: 1px solid #fbbf24; background: #fef3c7; color: #111827; font-family: monospace; font-size: 34px; font-weight: 700; letter-spacing: 6px; text-align: center;">
                ${otp}
              </div>
              <p style="margin: 18px 0 0; font-size: 14px; color: #4b5563;">OTP: ${otp}</p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #4b5563;">This code expires in 5 minutes.</p>
            </div>
          </div>
        `,
        `Your StudyNotion OTP is: ${otp}\nThis code expires in 5 minutes.`,
      );
    } catch (mailError) {
      console.log("error occured while sending mails : ", mailError);
    }

    //return response successful
    res.status(200).json({
      success: true,
      message: "OTP send successfully",
      otp,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signup
exports.signUp = async (req, res) => {
  try {
    //data fetch from req.body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate karo
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //2 passwords match krlo
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirmPassword value does not match, please try again ",
      });
    }

    //check user is exist or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //validate otp against in-memory fallback first, then DB
    const storedOtp = getOtp(email);
    if (storedOtp && otp !== storedOtp) {
      return res.status(400).json({
        success: false,
        message: "invalid OTP",
      });
    }

    if (!storedOtp) {
      const recentOtp = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);
      console.log("recent otp :", recentOtp);

      if (recentOtp.length == 0) {
        return res.status(400).json({
          success: false,
          message: "OTP not found",
        });
      }

      if (otp !== recentOtp[0].otpValue) {
        return res.status(400).json({
          success: false,
          message: "invalid OTP",
        });
      }
    }

    clearOtp(email);

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create profile first
    const ProfileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    //create entry in DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: ProfileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //return response
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "User  cannot be registered. Please try again",
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    //fetch data fro req.body
    const { email, password } = req.body;

    //validate data
    if (!email || !password) {
      res.status(403).json({
        success: false,
        message: "all fields are required,please try again",
      });
    }

    //check user is exist or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered,please signup first",
      });
    }

    //generate JWT after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Login Failure,Please try again",
    });
  }
};

//change password todo:homework for me
exports.changePassword = async (req, res) => {
  try {
    //get data from req.body
    //get oldpassword,newpassword,confirmpassword
    //validation
    //update password in database
    //send mail password updated
    //return response
  } catch (error) {
    console.log(error);
    return res.status().json({
      success: false,
      message: "",
    });
  }
};
