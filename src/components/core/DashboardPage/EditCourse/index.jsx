import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { setCourse,setEditCourse } from "../../../../slices/courseSlice";
import { getFullCourseDetails } from "../../../../services/operations/CourseDetailsAPI";
import RenderSteps from "../AddCourses/RenderSteps";



export default function EditCourse() {

  const dispatch = useDispatch();
  const {courseId} = useParams();
  const {course} = useSelector((state)=>state.course);
  const {token} = useSelector((state)=> state.auth);
  const [loading,setLoading] = useState(false);

  useEffect(()=> {
    const populateCourseDetails = async () => {
      setLoading(true);
      const result = await getFullCourseDetails(courseId,token);
      if(result?.courseDetails) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails));
      }
    }
    populateCourseDetails();

  },[]);

  return (
    <div className="text-white">
      <h1 className="text-richblack-5 text-2xl font-semibold">Edit Course</h1>
      <div className="">
        {
          course ? (<RenderSteps/>) : (<p>Course not Found</p>)
        }
      </div>
    </div>
  )
}