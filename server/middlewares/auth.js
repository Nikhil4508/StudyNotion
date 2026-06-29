const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
  try {
    //extract token
    console.log("[auth] incoming headers:", req.headers);
    const authHeader =
      req.header("Authorization") || req.header("Authorisation");
    console.log("[auth] authHeader:", authHeader);

    let token = null;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log("[auth] token from cookies");
    } else if (req.body && req.body.token) {
      token = req.body.token;
      console.log("[auth] token from body");
    } else if (authHeader) {
      token = authHeader.replace("Bearer", "").trim();
      console.log(
        "[auth] token from authHeader, cleaned token:",
        token.substring(0, 50) + "...",
      );
    }

    console.log(
      "[auth] final token:",
      token ? token.substring(0, 50) + "..." : "null",
    );

    //if token is missing return response
    if (!token) {
      console.log("[auth] token is missing/null");
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    //verify the token
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      //verification - issue
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    console.log("[auth] OUTER CATCH ERROR:", error.message, error.stack);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Students only",
      });
    }
    next();
  } catch (error) {
    return res.status().json({
      success: false,
      message: " User role cannot be verified,please try again ",
    });
  }
};

//isInstructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Instructor only",
      });
    }
    next();
  } catch (error) {
    return res.status().json({
      success: false,
      message: " User role cannot be verified,please try again ",
    });
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status().json({
      success: false,
      message: " User role cannot be verified,please try again ",
    });
  }
};
