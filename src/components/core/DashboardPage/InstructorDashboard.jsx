import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getInstructorCourses } from '../../../services/operations/CourseDetailsAPI'
import { AiOutlinePlus } from 'react-icons/ai'
import { VscVm, VscMortarBoard, VscStarFull } from 'react-icons/vsc'
import IconBtn from '../../common/IconBtn'

const InstructorDashboard = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getInstructorCourses(token)
      if (result) setCourses(result)
    }
    fetchCourses()
  }, [])

  const totalStudents = courses.reduce(
    (acc, c) => acc + (c.studentsEnrolled?.length ?? 0),
    0
  )

  const totalRevenue = courses.reduce(
    (acc, c) => acc + (c.price ?? 0) * (c.studentsEnrolled?.length ?? 0),
    0
  )

  const stats = [
    {
      label: 'Total Courses',
      value: courses.length,
      icon: <VscVm className="text-3xl text-yellow-50" />,
      bg: 'bg-richblack-700',
    },
    {
      label: 'Total Students',
      value: totalStudents,
      icon: <VscMortarBoard className="text-3xl text-blue-300" />,
      bg: 'bg-richblack-700',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: <VscStarFull className="text-3xl text-caribbeangreen-300" />,
      bg: 'bg-richblack-700',
    },
  ]

  return (
    <div className="text-richblack-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">
            Hi, {user?.firstName} 👋
          </h1>
          <p className="text-richblack-300 mt-1">
            Let's learn something new today!
          </p>
        </div>
        <IconBtn
          text="Add Course"
          textClasses="hidden md:inline"
          customClasses="bg-yellow-100 text-black font-semibold md:py-2 md:px-4 p-2 cursor-pointer"
          onclick={() => navigate('/dashboard/add-course')}
        >
          <AiOutlinePlus />
        </IconBtn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-xl p-6 flex items-center gap-4`}
          >
            <div className="p-3 bg-richblack-800 rounded-lg">{s.icon}</div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-richblack-300 text-sm">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <button
            onClick={() => navigate('/dashboard/my-courses')}
            className="text-yellow-50 text-sm hover:underline"
          >
            View All →
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="bg-richblack-800 rounded-xl p-10 text-center text-richblack-400">
            <VscVm className="text-5xl mx-auto mb-3 opacity-50" />
            <p>You haven't created any courses yet.</p>
            <button
              onClick={() => navigate('/dashboard/add-course')}
              className="mt-4 text-yellow-50 hover:underline text-sm"
            >
              Create your first course →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course._id}
                className="bg-richblack-800 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer"
                onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <p className="font-semibold truncate">{course.courseName}</p>
                  <div className="flex items-center justify-between mt-2 text-sm text-richblack-300">
                    <span>{course.studentsEnrolled?.length ?? 0} students</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        course.status === 'Published'
                          ? 'bg-caribbeangreen-800 text-caribbeangreen-100'
                          : 'bg-richblack-600 text-richblack-200'
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorDashboard
