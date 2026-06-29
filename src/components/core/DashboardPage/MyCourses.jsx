import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { getInstructorCourses } from '../../../services/operations/CourseDetailsAPI';
import IconBtn from '../../common/IconBtn';
import { AiOutlinePlus } from 'react-icons/ai';
import CoursesTable from '../DashboardPage/InstructorCourses/CourseTable';

const MyCourses = () => {

  const {token} = useSelector((state)=> state.auth);
  const navigate = useNavigate();
  const [courses,setCourses] = useState([]);


  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getInstructorCourses(token);

      if(result) {
        setCourses(result);
      } 
    }
    fetchCourses();

  },[]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-richblack-5 text-2xl font-semibold">My Courses</h1>
        <IconBtn 
          text="Add Courses"
          textClasses="hidden md:inline"
          customClasses={"bg-yellow-100 text-black font-semibold md:py-2 md:px-4 p-2 cursor-pointer"}
          onclick={() => navigate("/dashboard/add-course")}
        >
          <AiOutlinePlus />
        </IconBtn>
      </div>

      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}

    </div>
  )
}

export default MyCourses