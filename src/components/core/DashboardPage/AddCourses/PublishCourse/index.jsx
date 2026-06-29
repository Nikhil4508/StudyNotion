import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector,useDispatch } from "react-redux";
import IconBtn from "../../../../common/IconBtn";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { useNavigate } from "react-router-dom";
import { editCourseDetails } from "../../../../../services/operations/CourseDetailsAPI";


const PublishCourse = () => {

  const {register,handleSubmit,formState:{errors},setValue,getValues} = useForm();
  
  const {course} = useSelector((state)=>state.course);
  const {token} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    if(course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public",true);
    }
  },[]);

  const goBack = () => {
    dispatch(setStep(2));
  }

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  }

  const handleCoursePublish = async () => {
    if(!course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true || (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)) {
      // no updation in form ,so no need to make api calls
      goToCourses();
      return;
    }
    // if form is updated 
    const formData = new FormData();
    formData.append("courseId",course._id);
    const courseStatus =  getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
    formData.append("status",courseStatus);

    setLoading(true);
    const result = await editCourseDetails(formData,token); 

    if(result) {
      goToCourses();
    }

    setLoading(false);

  }

  const onSubmit = async (data) => {
    handleCoursePublish();
  }


    return (
      <div 
        className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
      >

        <h1 className="text-2xl font-semibold mb-4">Publish Course</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="">
          
          <div className="mb-6 ">
            <label htmlFor="public" className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="public"
              {...register("public")}
              className="rounded h-4 w-4 "
             />
             <span>Make this Course as Public</span>
             </label>
          </div>

          <div className=" flex items-center justify-end gap-x-4 ">
            <button 
              disabled={loading}
              type="button"
              onClick={goBack}
              className="flex items-center rounded-md cursor-pointer px-4 py-2 bg-richblack-700 text-richblack-250"
            >
              Back
            </button>

            <IconBtn disabled={loading} text="Save Changes" customClasses={"bg-yellow-100 text-black font-semibold py-2 px-4 cursor-pointer"} />

          </div>

        </form>



      </div>
    );
};

export default PublishCourse;
