import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FaStar } from "react-icons/fa";

import { createRating } from "../../../services/operations/CourseDetailsAPI";
import IconBtn from "../../common/IconBtn";

// Simple inline star picker — avoids the broken CommonJS export of react-rating-stars-component
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={28}
          className={`cursor-pointer transition-colors duration-150 ${
            star <= (hovered || value)
              ? "text-yellow-400"
              : "text-richblack-500"
          }`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
};

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseId } = useParams();

  const [rating, setRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (rating === 0) return;
    await createRating(
      {
        courseId,
        rating,
        review: data.courseExperience,
      },
      token
    );
    setReviewModal(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-11/12 max-w-[500px] rounded-lg bg-richblack-800 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 px-6 py-4">
          <p className="text-xl font-semibold text-richblack-5">Add Review</p>
          <button
            onClick={() => setReviewModal(false)}
            className="text-richblack-5 hover:text-white transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* User info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user?.image}
              alt={user?.firstName}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-300">Posting Publicly</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Star Rating */}
            <div>
              <StarPicker value={rating} onChange={setRating} />
              {rating === 0 && (
                <span className="text-xs text-red-400 mt-1 block">
                  Please select a rating
                </span>
              )}
            </div>

            {/* Review Text */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="courseExperience"
                className="text-sm text-richblack-200"
              >
                Your experience <sup className="text-red-400">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Share your experience about the course..."
                {...register("courseExperience", { required: true })}
                className="min-h-[130px] w-full resize-none rounded-md bg-richblack-700 px-4 py-3 text-richblack-5 placeholder:text-richblack-400 outline-none focus:ring-2 focus:ring-yellow-50"
              />
              {errors.courseExperience && (
                <span className="text-xs text-red-400">
                  Please share your experience
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-md bg-richblack-600 px-5 py-2 text-sm font-semibold text-richblack-5 hover:bg-richblack-500 transition-colors"
              >
                Cancel
              </button>
              <IconBtn
                text="Save"
                type="submit"
                customClasses="bg-yellow-50 px-5 py-2 text-sm font-semibold text-richblack-900 rounded-md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseReviewModal;
