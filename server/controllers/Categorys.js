const Category = require("../models/Category");

//create Category ka handler
exports.createCategory = async (req, res) => {
  try {
    //fetch data from req.body
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //create a entry in db
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });

    console.log(categoryDetails);

    //return response
    res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//getAllCategory function handler
exports.showAllCategory = async (req, res) => {
  try {
    const getAllCategories = await Category.find({}, { name: 1, description: 1 }).populate("course");
    return res.status(200).json({
      success: true,
      message: "All categories returned successfully",
      data: getAllCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      });
    }

    //get courses for specified categoryId
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: [
          { path: "ratingAndReviews" },
          { path: "instructor" },
        ],
      })
      .exec();

    // handle the case when the category is not found
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    //get courses for different categories (pick one that has courses)
    const otherCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: [
          { path: "ratingAndReviews" },
          { path: "instructor" },
        ],
      })
      .exec();

    const differentCategory =
      otherCategories.find((cat) => cat.course && cat.course.length > 0) ||
      otherCategories[0] ||
      null;

    //get top selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: [
          { path: "instructor" },
          { path: "ratingAndReviews" },
        ],
      })
      .exec();

    const allCourses = allCategories.flatMap((cat) => cat.course ?? []);
    const mostSellingCourses = allCourses
      .sort((a, b) => (b.studentsEnrolled?.length ?? 0) - (a.studentsEnrolled?.length ?? 0))
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.error("categoryPageDetails ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
