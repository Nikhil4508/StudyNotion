import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import {
  AiOutlineClockCircle,
  AiOutlineGlobal,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { BsPlayCircle, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineVerified } from "react-icons/md";

import { apiConnector } from "../services/apiconnector";
import { courseEndpoints } from "../services/apis";
import { buyCourse } from "../services/operations/StudentFeatureAPI";
import { addToCart } from "../slices/cartSlice";
import copy from "copy-text-to-clipboard";
import { ACCOUNT_TYPE } from "../utils/constants";
import Spinner from "../components/common/Spinner";

const { COURSE_DETAILS_API } = courseEndpoints;

const CourseDetails = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { paymentLoading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const [allOpen, setAllOpen] = useState(true);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await apiConnector("POST", COURSE_DETAILS_API, {
          courseId,
        });
        if (res?.data?.success) {
          setCourse(res.data.data);
          // Open all sections by default
          const initial = {};
          res.data.data.courseContent?.forEach((s) => {
            initial[s._id] = true;
          });
          setOpenSections(initial);
        } else {
          toast.error("Could not fetch course details");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  const handleBuyCourse = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor, you can't buy a course");
      return;
    }

    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    toast.error("Please login to buy a course");
    navigate("/login");
  };

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor, you can't buy a course");
      return;
    }

    if (!token) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    if (course) {
      dispatch(addToCart(course));
    }
  };

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    const next = !allOpen;
    setAllOpen(next);
    const updated = {};
    course?.courseContent?.forEach((s) => {
      updated[s._id] = next;
    });
    setOpenSections(updated);
  };

  // Derived stats
  const avgRating =
    course?.ratingAndReviews?.length > 0
      ? course.ratingAndReviews.reduce((acc, r) => acc + r.rating, 0) /
        course.ratingAndReviews.length
      : 0;

  const totalLectures =
    course?.courseContent?.reduce(
      (acc, s) => acc + (s.subSection?.length || 0),
      0,
    ) || 0;

  const totalSections = course?.courseContent?.length || 0;

  const totalDurationSeconds =
    course?.courseContent?.reduce((acc, section) => {
      return (
        acc +
        (section.subSection?.reduce(
          (a, sub) => a + (parseInt(sub.timeDuration) || 0),
          0,
        ) || 0)
      );
    }, 0) || 0;

  const formatDuration = (secs) => {
    if (secs < 60) return `${secs}s`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m`;
    return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-richblack-900">
        <p className="text-richblack-300 text-lg">Course not found.</p>
      </div>
    );
  }

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied To Clipboard");
  };

  return (
    <div className="bg-richblack-900 min-h-screen text-richblack-5">
      {/* ─── HERO SECTION ─── */}
      <div className="relative bg-richblack-800">
        <div className="mx-auto max-w-maxContent px-4 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-4">
            {/* Left: Course Info */}
            <div className="flex-1 lg:pr-[420px]">
              {/* Category tag */}
              {course.category?.name && (
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-50 mb-3">
                  {course.category.name}
                </p>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-richblack-5 leading-tight mb-3">
                {course.courseName}
              </h1>

              {/* Description */}
              <p className="text-richblack-200 text-base mb-4">
                {course.courseDescription}
              </p>

              {/* Rating row */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-yellow-25 font-semibold text-sm">
                  {avgRating > 0 ? avgRating.toFixed(1) : "New"}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) =>
                    s <= Math.floor(avgRating) ? (
                      <FaStar key={s} size={16} className="text-yellow-400" />
                    ) : s - 0.5 <= avgRating ? (
                      <FaStarHalfAlt
                        key={s}
                        size={16}
                        className="text-yellow-400"
                      />
                    ) : (
                      <FaRegStar
                        key={s}
                        size={16}
                        className="text-yellow-400"
                      />
                    ),
                  )}
                </div>
                <span className="text-richblack-400 text-sm">
                  ({course.ratingAndReviews?.length || 0} review
                  {course.ratingAndReviews?.length !== 1 ? "s" : ""})
                </span>
                <span className="text-richblack-400 text-sm">
                  {course.studentsEnrolled?.length || 0} student
                  {course.studentsEnrolled?.length !== 1 ? "s" : ""} enrolled
                </span>
              </div>

              {/* Instructor */}
              <p className="text-richblack-200 text-sm mb-3">
                Created By{" "}
                <span className="text-richblack-5 font-medium">
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </span>
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-5 text-richblack-400 text-sm">
                <div className="flex items-center gap-1.5">
                  <AiOutlineClockCircle className="text-richblack-300" />
                  <span>Created at {formatDate(course.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AiOutlineGlobal className="text-richblack-300" />
                  <span>English</span>
                </div>
              </div>
            </div>

            {/* Right: Floating pricing card */}
            <div className="lg:absolute lg:right-4 xl:right-[calc((100vw-1280px)/2+16px)] lg:top-10 w-full lg:w-[380px] bg-richblack-700 rounded-md overflow-hidden shadow-2xl border border-richblack-600 self-start">
              {/* Thumbnail */}
              <div className="w-full aspect-video bg-richblack-800 overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-richblack-400">
                    No preview available
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-5">
                {/* Price */}
                <p className="text-3xl font-bold text-richblack-5 mb-4">
                  Rs. {course.price?.toLocaleString("en-IN")}
                </p>

                {/* Buy Now */}
                <button
                  onClick={handleBuyCourse}
                  disabled={paymentLoading}
                  className="w-full bg-yellow-50 text-richblack-900 font-bold py-3 rounded-md mb-3 
                             hover:bg-yellow-25 active:scale-95 transition-all duration-150 
                             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? "Processing…" : "Buy Now"}
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-richblack-800 text-richblack-5 font-semibold py-3 rounded-md mb-4
                             border border-richblack-600 hover:bg-richblack-700 active:scale-95 
                             transition-all duration-150"
                >
                  Add to Cart
                </button>

                {/* Guarantee */}
                <p className="text-center text-xs text-richblack-400 mb-4">
                  30-Day Money-Back Guarantee
                </p>

                {/* Course Includes */}
                <div>
                  <p className="font-semibold text-richblack-5 mb-2">
                    This Course Includes :
                  </p>
                  <ul className="space-y-1.5">
                    {/* {course.courseContent?.slice(0, 3).map((section) =>
                      section.subSection?.slice(0, 1).map((sub) => (
                        <li key={sub._id} className="flex items-center gap-2 text-sm text-caribbeangreen-100">
                          <BsPlayCircle className="shrink-0" />
                          <span className="truncate">{sub.title}</span>
                        </li>
                      ))
                    )} */}
                    {course.instructions?.slice(0, 2).map((instr, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-caribbeangreen-100"
                      >
                        <MdOutlineVerified className="shrink-0" />
                        <span className="truncate">{instr}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Share */}
                <button
                  className="flex items-center gap-2 mt-4 mx-auto text-yellow-50 text-sm hover:text-yellow-25 transition-colors cursor-pointer"
                  onClick={() => handleShare()}
                >
                  <AiOutlineShareAlt />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="mx-auto max-w-maxContent px-4 py-10 lg:pr-[420px] space-y-10">
        {/* What You'll Learn */}
        {course.whatYouWillLearn && (
          <section className="border border-richblack-600 rounded-md p-6">
            <h2 className="text-xl font-bold text-richblack-5 mb-4">
              What you&apos;ll learn
            </h2>
            <p className="text-richblack-200 leading-relaxed whitespace-pre-line">
              {course.whatYouWillLearn}
            </p>
          </section>
        )}

        {/* Course Content */}
        <section>
          <h2 className="text-xl font-bold text-richblack-5 mb-2">
            Course Content
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <p className="text-richblack-400 text-sm">
              {totalSections} section{totalSections !== 1 ? "s" : ""} •{" "}
              {totalLectures} lecture{totalLectures !== 1 ? "s" : ""} •{" "}
              {formatDuration(totalDurationSeconds)} total length
            </p>
            <button
              onClick={toggleAll}
              className="text-yellow-50 text-sm hover:text-yellow-25 transition-colors font-medium cursor-pointer"
            >
              {allOpen ? "Collapse all sections" : "Expand all sections"}
            </button>
          </div>

          {/* Accordion */}
          <div className="border border-richblack-600 rounded-md overflow-hidden divide-y divide-richblack-600 ">
            {course.courseContent?.length > 0 ? (
              course.courseContent.map((section) => (
                <div key={section._id}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section._id)}
                    className="w-full flex items-center justify-between px-5 py-3.5 
                               bg-richblack-700 hover:bg-richblack-600 transition-colors text-left gap-4"
                  >
                    <div className="flex items-center gap-2 text-richblack-5 font-medium text-sm ">
                      {openSections[section._id] ? (
                        <BsChevronUp className="shrink-0 text-yellow-50" />
                      ) : (
                        <BsChevronDown className="shrink-0 text-yellow-50" />
                      )}
                      {section.sectionName}
                    </div>
                    <span className="text-yellow-50 text-xs shrink-0 ">
                      {section.subSection?.length || 0} lecture
                      {section.subSection?.length !== 1 ? "s" : ""}
                    </span>
                  </button>

                  {/* Sub-sections */}
                  {openSections[section._id] && (
                    <div className="bg-richblack-900 divide-y divide-richblack-700">
                      {section.subSection?.length > 0 ? (
                        section.subSection.map((sub) => (
                          <div
                            key={sub._id}
                            className="flex items-center gap-3 px-6 py-3 text-sm text-richblack-300"
                          >
                            <BsPlayCircle className="text-richblack-400 shrink-0" />
                            <span className="flex-1">{sub.title}</span>
                            {sub.timeDuration && (
                              <span className="text-richblack-400 text-xs shrink-0">
                                {formatDuration(parseInt(sub.timeDuration))}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="px-6 py-3 text-sm text-richblack-400">
                          No lectures in this section.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="px-5 py-4 text-richblack-400 text-sm">
                No content available yet.
              </p>
            )}
          </div>
        </section>

        {/* Instructor Info */}
        {course.instructor && (
          <section>
            <h2 className="text-xl font-bold text-richblack-5 mb-4">
              Instructor
            </h2>
            <div className="flex items-center gap-4">
              <img
                src={
                  course.instructor.image ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${course.instructor.firstName}`
                }
                alt={course.instructor.firstName}
                className="w-14 h-14 rounded-full object-cover border-2 border-richblack-600"
              />
              <div>
                <p className="font-semibold text-richblack-5">
                  {course.instructor.firstName} {course.instructor.lastName}
                </p>
                <p className="text-richblack-400 text-sm">
                  {course.instructor.additionalDetails?.designation ||
                    "Instructor"}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
