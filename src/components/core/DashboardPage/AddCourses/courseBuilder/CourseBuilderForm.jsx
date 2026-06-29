import React, { useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from '../../../../common/IconBtn'
import{MdAddCircleOutline} from 'react-icons/md'
import {BiRightArrow} from 'react-icons/bi'
import { useDispatch, useSelector } from "react-redux";
import {setCourse, setEditCourse,setStep} from '../../../../../slices/courseSlice'
import{toast} from "react-hot-toast";
import { createSection, updateSection } from "../../../../../services/operations/CourseDetailsAPI";
import NestedView from "./NestedView";

const CourseBuilderForm = () => {

  const {register,handleSubmit,setValue,formState:{errors} } = useForm();
  const [editSectionName,setEditSectionName] = useState(null);
  const {course} = useSelector((state)=> state.course);
  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.auth);
  const [loading,setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    if(editSectionName){
      // we are editing the section name
      result = await updateSection(
        {
          sectionName:data.sectionName,
          sectionId:editSectionName,
          courseId:course._id,
        },token
      )
    } else {
      result = await createSection({
        sectionName:data.sectionName,
        courseId:course._id,
      },token)
    }

    // update values
    if(result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName","");
    }

    // loading false
    setLoading(false);

  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "")
  }

  const goBack =() => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true))
  }

  const goToNext = () => {
    if(course?.courseContent?.length === 0) {
      toast.error("Please add atleast one Lecture in each section")
      return;
    }

    if(course?.courseContent?.some((section) => section.subSection.length === 0 )) {
      toast.error("Please add atleast one lecture in each sub-section");
      return;
    }

    // if everything is good 
    dispatch(setStep(3));

  }

  const handleChangeEditSectionName = (sectionId,sectionName) => {
    if(editSectionName === sectionId) {
      cancelEdit();
      return;
    }

    setEditSectionName(sectionId);
    setValue("sectionName",sectionName);
  }

  return (
  <div className="w-full bg-richblack-800 p-4 rounded-md">
    <p className="text-2xl font-semibold mb-4">Course Builder</p>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <label htmlFor="sectionName">Section Name</label>
        <input 
          id="sectionName"
          placeholder="Add section name"
          {...register("sectionName",{required:true} )}
          className=" w-full py-2 px-2 bg-richblack-700 rounded-md mt-2 mb-2"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
        {
          errors.sectionName && (
            <span className="text-red-400">Section Name is required**</span>
          )
        }
      </div>
      <div className="flex">
        <IconBtn 
          type="Submit"
          text={editSectionName ? "Edit Section Name" : "Create Section"}
          outline={true}
          customClasses={"text-yellow-100 border-1 border-yellow-100 "}

        >
          <MdAddCircleOutline className="text-yellow-50" size={20} />
        </IconBtn>  
        {
          editSectionName && (
            <button 
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline ml-10"
            >
              Cancel Edit
            </button>
          )
        }
      </div>
    </form>

    {course?.courseContent?.length > 0 && ( 
      <NestedView 
        handleChangeEditSectionName={handleChangeEditSectionName}
      /> 
    )}

    <div className="flex justify-end gap-x-3 ">
      <button onClick={goBack} className="rounded-md cursor-pointer flex items-center bg-richblack-700 py-2 px-4 ">
        Back
      </button>
      <IconBtn  
        text="Next"
        onclick={goToNext}
        customClasses = {"bg-yellow-100 text-black"}
      >
        <BiRightArrow/>
      </IconBtn>
    </div>

  </div>



)};

export default CourseBuilderForm;
