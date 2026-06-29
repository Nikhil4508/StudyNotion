import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";

const Course_card = ({ course, height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  }, []);

  return (
    <div>
      <Link to={`/courses/${course._id}`}>
        <div className="bg-richblack-700 p-2 rounded-md">
          <div className="">
            <img
              src={course?.thumbnail}
              className={`${height} w-full rounded-xl object-cover`}
              alt="course image"
            />
          </div>

          <div className="mt-1">
            <p className="">{course?.courseName}</p>
            <p className="">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>

            <div className="flex items-center gap-x-2">
              <span>{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span>{course?.ratingAndReviews?.length} Ratings</span>
            </div>

            <p>Rs.{course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Course_card;
