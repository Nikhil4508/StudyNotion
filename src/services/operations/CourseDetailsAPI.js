import { toast } from "react-hot-toast";
import { updateCompletedLecutures } from "../../slices/ViewCourseSlice";
// import {setLoading} from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints;

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);
    if (!response?.data?.success) {
      throw Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_ALL_COURSE_API API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...");
  //dispatch(setLoading(true))
  let result = null;

  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    console.log("COURSE_DETAILS_API api response", response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data;
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR.......", error);
    result = error.response.data;
    //toast.error(error.response.data.message);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  //dispatch(setLoading(false))
  return result;
};

// fetching the available course categories
export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    console.log("COURSE_CATEGORIES_API API RESPONSE.......", response);
    if (!response?.data?.success) {
      throw new Error("Could not fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR.......", error);
    toast.error(error.message);
  }
  return result;
};

export const getCourseCategories = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_CATEGORIES_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createCourse = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Create Course");
    }
    result = response?.data?.data;
    toast.success("Course Created Successfully");
  } catch (error) {
    console.log("CREATE_COURSE_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const editCourse = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("PUT", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Edit Course");
    }
    result = response?.data?.data;
    toast.success("Course Edited Successfully");
  } catch (error) {
    console.log("EDIT_COURSE_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course");
    }
    result = response?.data?.data;
    toast.success("Course Deleted Successfully");
  } catch (error) {
    console.log("DELETE_COURSE_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getInstructorCourses = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Get Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_ALL_INSTRUCTOR_COURSES_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Create Section");
    }
    result = response?.data?.data;
    toast.success("Section Created Successfully");
  } catch (error) {
    console.log("CREATE_SECTION_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("PUT", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section");
    }
    result = response?.data?.data;
    toast.success("Section Updated Successfully");
  } catch (error) {
    console.log("UPDATE_SECTION_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("DELETE", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section");
    }
    result = response?.data?.data;
    toast.success("Section Deleted Successfully");
  } catch (error) {
    console.log("DELETE_SECTION_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createSubsection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Create Subsection");
    }
    result = response?.data?.data;
    toast.success("Subsection Created Successfully");
  } catch (error) {
    console.log("CREATE_SUBSECTION_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSubsection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("PUT", UPDATE_SUBSECTION_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Update Subsection");
    }
    result = response?.data?.data;
    toast.success("Subsection Updated Successfully");
  } catch (error) {
    console.log("UPDATE_SUBSECTION_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSubsection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("DELETE", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Subsection");
    }
    result = response?.data?.data;
    toast.success("Subsection Deleted Successfully");
  } catch (error) {
    console.log("DELETE_SUBSECTION_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getFullCourseDetails = async (courseId, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      },
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Get Full Course Details");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_FULL_COURSE_DETAILS_AUTHENTICATED ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating");
    }
    result = response?.data?.data;
    toast.success("Rating Added Successfully");
  } catch (error) {
    console.log("CREATE_RATING_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const markLectureAsComplete = async (data, token, dispatch) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Mark Lecture As Complete");
    }
    result = response?.data?.data;
    toast.success("Lecture Marked Complete");
    dispatch(updateCompletedLecutures(data.subSectionId));
  } catch (error) {
    console.log("LECTURE_COMPLETION_API ERROR.......", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Alias exports for CourseInformationForm compatibility
export const addCourseDetails = createCourse;
export const editCourseDetails = editCourse;
