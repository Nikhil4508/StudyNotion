import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  createSubsection,
  updateSubsection,
} from "../../../../../services/operations/CourseDetailsAPI";
import toast from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../../../../common/Upload";
import { setCourse } from "../../../../../slices/courseSlice";

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  edit = false,
  view = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if (view) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, [modalData, view, setValue]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleEditSubSection = async () => {
    const currentValue = getValues();
    const formData = new FormData();

    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    formData.append("courseId", course._id);

    if (currentValue.lectureTitle !== modalData.title) {
      formData.append("title", currentValue.lectureTitle);
    }

    if (currentValue.lectureDesc !== modalData.description) {
      formData.append("description", currentValue.lectureDesc);
    }

    if (currentValue.lectureVideo !== modalData.videoUrl) {
      formData.append("videoFile", currentValue.lectureVideo);
    }

    setLoading(true);
    const result = await updateSubsection(formData, token);
    if (result) {
      //TODO:-same check
      dispatch(setCourse(result));
    }
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form");
      } else {
        //edit krdo store me
        handleEditSubSection();
      }
      return;
    }

    // ADD
    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("videoFile", data.lectureVideo);
    formData.append("courseId", course._id);
    setLoading(true);

    //api call
    const result = await createSubsection(formData, token);

    if (result) {
      //TODO:-check for updation
      dispatch(setCourse(result));
    }
    setModalData(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center overflow-y-auto bg-white/10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[380px] rounded-lg border border-richblack-400 bg-richblack-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-richblack-700 p-3 px-4 border-b border-richblack-600">
          <p className="text-lg font-semibold text-richblack-5">
            {view && "Viewing"} {edit && "Editing"} {add && "Adding"} Lecture
          </p>
          <button
            onClick={() => (!loading ? setModalData(null) : {})}
            disabled={loading}
            className="text-richblack-200 hover:text-richblack-5 transition-colors duration-200"
          >
            <RxCross1 size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-3 px-4 space-y-3">
          {/* lecture video */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          {/* lecture title */}
          <div>
            <label className="text-xs text-richblack-5" htmlFor="lectureTitle">
              Lecture Title <sup className="text-pink-200">*</sup>
            </label>
            <input
              type="text"
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              className="w-full p-2 rounded-md text-richblack-5 bg-richblack-700 placeholder-richblack-400 mt-1 focus:outline-none focus:ring-1 focus:ring-yellow-50 text-sm"
              {...register("lectureTitle", { required: true })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
            {errors.lectureTitle && (
              <span className="text-[10px] text-pink-200 mt-0.5 block">
                Lecture title is required
              </span>
            )}
          </div>

          {/* lecture description */}
          <div>
            <label className="text-xs text-richblack-5" htmlFor="lectureDesc">
              Lecture Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="lectureDesc"
              className="w-full min-h-[90px] rounded-md text-richblack-5 bg-richblack-700 placeholder-richblack-400 mt-1 focus:outline-none focus:ring-1 focus:ring-yellow-50 p-2 text-sm"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
            {errors.lectureDesc && (
              <span className="text-[10px] text-pink-200 mt-0.5 block">
                Lecture description is required
              </span>
            )}
          </div>

          {/* Buttons */}
          {!view && (
            <div className="flex justify-end gap-x-2 pt-1">
              <button
                type="button"
                onClick={() => (!loading ? setModalData(null) : {})}
                className="flex items-center bg-richblack-700 text-richblack-5 px-4 py-1.5 rounded-md font-semibold cursor-pointer border border-richblack-600 hover:bg-richblack-800 transition-all duration-200 text-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <IconBtn
                text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}
                onclick={handleSubmit(onSubmit)}
                customClasses="bg-yellow-100 px-4 py-1.5 text-black font-semibold cursor-pointer rounded-md hover:bg-yellow-50 transition-all duration-200 text-sm"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubSectionModal;
