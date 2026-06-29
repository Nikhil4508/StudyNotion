import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseCategories,
  editCourseDetails,
  addCourseDetails,
} from "../../../../../services/operations/CourseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { BiUpload } from "react-icons/bi";
import RequirementField from "./RequirementField";
import { setStep, setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { toast } from "react-hot-toast";
import Upload from "../../../../common/Upload";
// import editCourseDetails from ''

const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }

    getCategories();
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseTitle !== course?.courseName ||
      currentValues.courseShortDesc !== course?.courseDescription ||
      currentValues.coursePrice !== course?.price ||
      currentValues.courseBenefits !== course?.whatYouWillLearn ||
      currentValues.courseCategory !== course?.category?._id ||
      currentValues.courseCategory !== course?.category ||
      currentValues.courseRequirements?.toString() !==
        course?.instructions?.toString()
    )
      return true;
    else return false;
  };

  // handle next button click
  const onSubmit = async (data) => {
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }

        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }

        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }

        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }

        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory);
        }

        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements),
          );
        }

        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }

        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage);
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
      } else {
        toast.error("No Changes made to the Form.");
      }
      return;
    }

    // create a new course
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("thumbnailImage", data.courseImage);
    formData.append("status", COURSE_STATUS.DRAFT);

    setLoading(true);
    const result = await addCourseDetails(formData, token);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
  };

  return (
    <form
      className="text-white rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="">
        <label htmlFor="courseTitle">
          Course Title<sup className="text-red-600">*</sup>
        </label>
        <input
          type="text"
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="w-full rounded-md p-2 bg-richblack-700 mt-2"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />

        {errors.courseTitle && (
          <span className="text-red-400">Course Title is Required**</span>
        )}
      </div>

      <div className="">
        <label htmlFor="courseShortDesc">
          Course Short Description<sup className="text-red-600">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Course Short Description"
          {...register("courseShortDesc", { required: true })}
          className="min-h-[140px] w-full bg-richblack-700 rounded-md p-2 mt-2"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />

        {errors.courseShortDesc && (
          <span className="text-red-400">Course Description is Required**</span>
        )}
      </div>

      <div className="relative">
        <label htmlFor="coursePrice">
          Course Price<sup className="text-red-600">*</sup>
        </label>
        <input
          id="coursePrice"
          placeholder="Enter Course Price"
          {...register("coursePrice", {
            required: true,
            valueAsNumber: true,
          })}
          className="w-full pl-10 py-2 px-2 bg-richblack-700 rounded-md mt-2"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
        <HiOutlineCurrencyRupee className="absolute top-[42px] left-2 text-xl" />
        {errors.coursePrice && (
          <span className="text-red-400">Course Price is Required**</span>
        )}
      </div>

      <div className="">
        <label htmlFor="courseCategory">
          Course Category<sup className="text-red-600">*</sup>
        </label>
        <select
          className="bg-richblack-700 rounded-md p-2 ml-2 "
          id="courseCategory"
          defaultValue=""
          {...register("courseCategory", { required: true })}
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories.map((category, idx) => (
              <option key={idx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-red-400">
            Course Category is Required**
          </span>
        )}
      </div>

      {/* TODO: create a custom component for handling tags input  */}
      {/* <ChipInput
        label="tags"
        name="courseTags"
        placeholder="Enter tags and press enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      /> */}

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      <div className="">
        <label htmlFor="courseBenefits">
          Benefits of the Course <sup className="text-red-600">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter Benefits of the Course"
          {...register("courseBenefits", { required: true })}
          className="min-h-[140px] w-full bg-richblack-700 p-2 rounded-md mt-2"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
        {errors.courseBenefits && (
          <span className="text-red-400">
            Benefits of the Course are Required**
          </span>
        )}
      </div>

      <RequirementField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      <div className="flex items-center justify-end gap-x-4 ">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            className="flex items-center gap-x-2 rounded-md bg-richblack-700 py-2 px-4 cursor-pointer "
          >
            Continue Without Saving
          </button>
        )}

        <IconBtn
         text={!editCourse ? "Next" : "Save Changes"} 
        customClasses={"bg-yellow-100 text-black font-semibold py-2 px-4 cursor-pointer "}
         />
      </div>
    </form>
  );
};

export default CourseInformationForm;
