import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFromCart } from "../../../../slices/cartSlice";
import RatingStars from "../../../common/RatingStars";

const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course, index) => {
        // Safe calculation of average rating
        const reviews = course?.ratingAndReviews || [];
        const avgRating =
          reviews.length > 0
            ? (
                reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
                reviews.length
              ).toFixed(1)
            : 0;

        return (
          <div
            key={course?._id || index}
            className={`flex w-full flex-wrap items-start justify-between gap-6 ${
              index !== cart.length - 1 && "border-b border-b-richblack-700 pb-6"
            } ${index !== 0 && "mt-6"}`}
          >
            <div className="flex flex-1 flex-col gap-4 xl:flex-row">
              <img
                src={course?.thumbnail}
                alt={course?.courseName}
                className="h-[148px] w-[220px] rounded-lg object-cover"
              />
              <div className="flex flex-col space-y-1">
                <p className="text-lg font-medium text-richblack-5">
                  {course?.courseName}
                </p>
                <p className="text-sm text-richblack-300">
                  {course?.category?.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-100">{avgRating}</span>
                  <RatingStars Review_Count={Number(avgRating)} />
                  <span className="text-richblack-400">
                    ({reviews.length} Ratings)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <button
                onClick={() => dispatch(removeFromCart(course?._id))}
                className="flex items-center gap-x-1 rounded-md border border-richblack-700 bg-richblack-800 p-2 text-pink-200 cursor-pointer hover:bg-richblack-700 transition-all duration-300"
              >
                <RiDeleteBin6Line />
                {/* <span>Remove</span> */}
              </button>
              <p className="text-3xl font-medium text-yellow-100">
                ₹ {course?.price?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderCartCourses;
