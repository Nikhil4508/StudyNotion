import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import { FiBook, FiClock, FiPlay, FiChevronRight } from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const response = await getUserEnrolledCourses(token);
        setEnrolledCourses(response || []);
      } catch (error) {
        console.log("Unable to fetch enrolled courses", error);
        setEnrolledCourses([]);
      }
    })();
  }, [token]);

  // Loading skeleton
  if (enrolledCourses === null) {
    return (
      <div className="px-4 py-6">
        <div className="mb-8">
          <div className="h-8 w-64 bg-richblack-700 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-48 bg-richblack-700 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-richblack-800 rounded-2xl p-4 mb-4 flex gap-4 animate-pulse"
          >
            <div className="w-36 h-24 bg-richblack-700 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-richblack-700 rounded w-3/4" />
              <div className="h-4 bg-richblack-700 rounded w-1/2" />
              <div className="h-2 bg-richblack-700 rounded-full w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (enrolledCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-richblack-700 rounded-full flex items-center justify-center mb-6">
          <MdOutlineSchool className="text-5xl text-richblack-400" />
        </div>
        <h2 className="text-2xl font-bold text-richblack-5 mb-3">
          No Courses Yet
        </h2>
        <p className=" text-richblack-400 mb-8 ">
          You haven't enrolled in any courses yet. Explore our catalog and start
          learning today!
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-yellow-50 text-richblack-900 px-2 py-2 lg:px-6 lg:py-3 rounded-md font-semibold hover:bg-yellow-100 transition-all duration-200"
        >
          <FiBook />
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-richblack-5 mb-1">
          Enrolled Courses
        </h1>
        <p className="text-richblack-400">
          {enrolledCourses.length} course
          {enrolledCourses.length !== 1 ? "s" : ""} in progress
        </p>
      </div>

      {/* Table Header — desktop */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] gap-4 px-4 py-2 mb-2 text-xs font-semibold text-richblack-400 uppercase tracking-wider border-b border-richblack-700">
        <span>Course</span>
        <span>Duration</span>
        <span>Progress</span>
      </div>

      {/* Course rows */}
      <div className="flex flex-col gap-3">
        {enrolledCourses.map((course, index) => (
          <div
            key={index}
            className="group bg-richblack-800 border border-richblack-700 hover:border-yellow-50/30 rounded-2xl p-4 transition-all duration-200 hover:bg-richblack-800 cursor-pointer"
            onClick={() => navigate(`/view-course/${course._id}`)}
          >
            <div className="md:grid md:grid-cols-[2fr_1fr_1fr] gap-4 items-center">
              {/* Course Info */}
              <div className="flex gap-4 items-center">
                <div className="relative flex-shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-32 h-20 md:w-36 md:h-24 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-32 h-20 md:w-36 md:h-24 bg-richblack-700 rounded-xl items-center justify-center hidden"
                    style={{ display: "none" }}
                  >
                    <FiBook className="text-3xl text-richblack-400" />
                  </div>
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                      <FiPlay className="text-richblack-900 text-lg ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-richblack-5 text-base md:text-lg leading-tight mb-1 line-clamp-2 group-hover:text-yellow-50 transition-colors">
                    {course.courseName}
                  </h3>
                  <p className="text-richblack-400 text-sm line-clamp-2 hidden md:block">
                    {course.courseDescription}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="hidden md:flex items-center gap-2 text-richblack-300">
                <FiClock className="text-yellow-50 flex-shrink-0" />
                <span className="text-sm">{course.totalDuration || "—"}</span>
              </div>

              {/* Progress */}
              <div className="mt-4 md:mt-0">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-richblack-400">Progress</span>
                  <span className="text-xs font-semibold text-yellow-50 ">
                    {course.progressPercentage || 0}%
                  </span>
                </div>
                <div className="w-full bg-richblack-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${course.progressPercentage || 0}%`,
                      background: "linear-gradient(90deg, #FFD60A, #FFA500)",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-richblack-400">
                    {course.progressPercentage === 100
                      ? "✅ Completed"
                      : "In Progress"}
                  </span>
                  <button
                    className="text-xs text-yellow-50 flex items-center gap-1 hover:gap-2 transition-all duration-150 group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/view-course/${course._id}`);
                    }}
                  >
                    {course.progressPercentage === 100 ? "Review" : "Continue"}
                    <FiChevronRight className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;
