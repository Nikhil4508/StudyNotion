import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Thead, Tbody, Th, Td, Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { COURSE_STATUS } from "../../../../utils/constants";
import { PiClockCountdownLight } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import ConfirmationModal from "../../../common/ConfirmationModal";
import {
  deleteCourse,
  getInstructorCourses,
} from "../../../../services/operations/CourseDetailsAPI";
import { formatDate } from "../../../../services/formatDate";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function CourseTable({ courses, setCourses }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate = useNavigate();
  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await getInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <div className="text-richblack-5">
      <style>{`
        @media (max-width: 1017px) {
          .responsiveTable td:before {
            display: none !important;
          }
        }
      `}</style>
      <Table className="border-0 min-[1018px]:border min-[1018px]:border-richblack-800 rounded-none min-[1018px]:rounded-xl overflow-hidden">
        <Thead>
          <Tr className="hidden min-[1018px]:flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2 bg-richblack-800">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No Courses Found
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr
                className="flex flex-col min-[1018px]:flex-row gap-y-4 min-[1018px]:gap-y-0 min-[1018px]:gap-x-10 border border-richblack-800 min-[1018px]:border-0 min-[1018px]:border-b min-[1018px]:border-richblack-800 bg-richblack-800 min-[1018px]:bg-transparent rounded-xl min-[1018px]:rounded-none p-4 min-[1018px]:px-6 min-[1018px]:py-8 mb-4 min-[1018px]:mb-0"
                key={course._id}
              >
                <Td className="flex flex-col sm:flex-row flex-1 gap-4 pt-4 sm:pt-2 min-[1018px]:pt-0">
                  <img
                    src={course?.thumbnail}
                    alt="course image"
                    className="h-[120px] w-full sm:w-[180px] min-[1018px]:h-[148px] min-[1018px]:w-[220px] rounded-lg object-cover shadow-sm mt-2 sm:mt-0"
                  />

                  <div className="flex flex-col justify-between gap-y-2 min-[1018px]:gap-y-0">
                    <div>
                      <p className="text-lg font-semibold text-richblack-5">
                        {course.courseName}
                      </p>
                      <p className="text-xs text-richblack-300 mt-1">
                        {course.courseDescription.split(" ").length > 30
                          ? course.courseDescription
                              .split(" ")
                              .slice(0, 30)
                              .join(" ") + "..."
                          : course.courseDescription}
                      </p>
                    </div>
                    <div className="flex flex-col gap-y-1 mt-2">
                      <p className="text-[12px] text-white">
                        Created: {formatDate(course.createdAt)}
                      </p>
                      {course.status === COURSE_STATUS.DRAFT ? (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                          <PiClockCountdownLight size={14} />
                          Drafted
                        </p>
                      ) : (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                          <TiTick size={14} />
                          Published
                        </p>
                      )}
                    </div>
                  </div>
                </Td>

                <Td className="text-sm font-medium text-richblack-100 w-full min-[1018px]:w-auto flex items-center justify-between min-[1018px]:justify-start gap-x-2 border-t border-richblack-700/50 pt-4 pb-2 min-[1018px]:border-0 min-[1018px]:pt-0 min-[1018px]:pb-0 mt-4 min-[1018px]:mt-0">
                  <span className="inline min-[1018px]:hidden text-richblack-300 font-normal max-[629px]:hidden">
                    Duration
                  </span>
                  <span>2hr 30min</span>
                </Td>

                <Td className="text-sm font-medium text-richblack-100 w-full min-[1018px]:w-auto flex items-center justify-between min-[1018px]:justify-start gap-x-2 py-2 min-[1018px]:py-0">
                  <span className="inline min-[1018px]:hidden text-richblack-300 font-normal max-[629px]:hidden">
                    Price
                  </span>
                  <span>₹{course.price}</span>
                </Td>

                <Td className="text-sm font-medium text-richblack-100 w-full min-[1018px]:w-auto flex items-center justify-between min-[1018px]:justify-start gap-x-4 py-2 min-[1018px]:py-0">
                  <span className="inline min-[1018px]:hidden text-richblack-300 font-normal max-[629px]:hidden">
                    Actions
                  </span>
                  <div className="flex items-center gap-x-3">
                    <button
                      disabled={loading}
                      className="hover:text-green-300 hover:scale-95 cursor-pointer transition-all duration-300 p-1.5 bg-richblack-700 rounded-md min-[1018px]:bg-transparent min-[1018px]:p-0"
                      onClick={() =>
                        navigate(`/dashboard/edit-course/${course._id}`)
                      }
                      title="Edit Course"
                    >
                      <MdOutlineModeEdit size={20} />
                    </button>
                    <button
                      disabled={loading}
                      className="hover:text-red-300 hover:scale-95 cursor-pointer transition-all duration-300 p-1.5 bg-richblack-700 rounded-md min-[1018px]:bg-transparent min-[1018px]:p-0"
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Do you want to delete this course?",
                          text2:
                            "All the data related to this course will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: !loading
                            ? () => handleCourseDelete(course._id)
                            : () => {},
                          btn2Handler: !loading
                            ? () => setConfirmationModal(null)
                            : () => {},
                        })
                      }
                      title="Delete Course"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}
