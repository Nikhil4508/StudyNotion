const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
require("dotenv").config();

// connect to database
const { connectDB } = require("./config/database");
connectDB();

// cloudinary config (used by image uploader util)
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// controllers
const AuthController = require("./controllers/Auth");
const ProfileController = require("./controllers/Profile");
const CourseController = require("./controllers/Course");
const PaymentController = require("./controllers/Payment");
const CategoryController = require("./controllers/Categorys");
const RatingController = require("./controllers/RatingAndReview");
const ResetPasswordController = require("./controllers/ResetPassword");

const { auth } = require("./middlewares/auth");
const { uploadImageToCloudinary } = require("./utils/imageUploader");
const mailSender = require("./utils/mailSender");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

// Use centralized routes
const routes = require("./routes");
app.use("/api/v1", routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
