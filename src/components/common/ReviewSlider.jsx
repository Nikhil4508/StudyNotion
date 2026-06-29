import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaQuoteLeft } from "react-icons/fa";

import "swiper/css";

import { apiConnector } from "../../services/apiconnector";
import { ratingEndpoints } from "../../services/apis";

const { REVIEWS_DETAILS_API } = ratingEndpoints;

// Fallback avatar using initials
const Avatar = ({ name, image }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-yellow-400/40 flex-shrink-0"
      />
    );
  }
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-richblack-900 font-bold text-sm ring-2 ring-yellow-400/40 flex-shrink-0">
      {initials}
    </div>
  );
};

// Simple star display (no external dep)
const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => {
      const filled = star <= Math.floor(rating);
      const half = !filled && star === Math.ceil(rating) && rating % 1 >= 0.5;
      return (
        <span
          key={star}
          style={{ fontSize: 14, lineHeight: 1 }}
          className={
            filled
              ? "text-yellow-400"
              : half
                ? "text-yellow-300/60"
                : "text-richblack-600"
          }
        >
          ★
        </span>
      );
    })}
  </div>
);

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiConnector("GET", REVIEWS_DETAILS_API);
        if (res?.data?.success) {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.error("ReviewSlider fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex gap-4 overflow-hidden py-6 px-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="min-w-[260px] h-44 rounded-2xl bg-richblack-700 animate-pulse flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <p className="text-center text-richblack-400 py-8">
        No reviews yet. Be the first to review!
      </p>
    );
  }

  // Duplicate slides for smoother looping when fewer items exist
  const slides =
    reviews.length < 4 ? [...reviews, ...reviews, ...reviews] : reviews;

  return (
    <div className="w-full mt-8 pb-8">
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        slidesPerView={1}
        spaceBetween={24}
        breakpoints={{
          480: { slidesPerView: 1.2, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          900: { slidesPerView: 3, spaceBetween: 24 },
          1200: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="w-full !px-4 !pb-2"
      >
        {slides.map((review, idx) => {
          const fullName =
            `${review?.user?.firstName ?? ""} ${review?.user?.lastName ?? ""}`.trim() ||
            "Anonymous";
          const truncatedReview =
            review?.review?.length > 120
              ? review.review.slice(0, 120) + "…"
              : review?.review;

          return (
            <SwiperSlide key={idx}>
              <div
                className="group relative flex flex-col gap-3 rounded-2xl bg-richblack-800 border border-richblack-700 hover:border-yellow-400/30 p-5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,214,10,0.08)] "
                style={{ minHeight: 170 }}
              >
                {/* Quote icon */}
                <FaQuoteLeft className="text-yellow-400/20 text-2xl absolute top-4 right-4 group-hover:text-yellow-400/40 transition-colors duration-300" />

                {/* User info */}
                <div className="flex items-center gap-3">
                  <Avatar name={fullName} image={review?.user?.image} />
                  <div className="min-w-0">
                    <p className="font-semibold text-richblack-5 text-sm truncate">
                      {fullName}
                    </p>
                    <p className="text-richblack-400 text-xs truncate">
                      {review?.course?.courseName ?? "StudyNotion Course"}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <StarRating rating={review?.rating ?? 0} />

                {/* Review text */}
                <p className="text-richblack-300 text-sm leading-relaxed">
                  {truncatedReview}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ReviewSlider;
