import { toast } from "react-hot-toast";

import { setLoading, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoint } from "../apis";

const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API } = profileEndpoint;

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      if (!token) throw new Error("No auth token provided");

      let normalizedToken = token;
      if (typeof token === "string") {
        normalizedToken =
          token.startsWith('"') && token.endsWith('"')
            ? token.slice(1, -1)
            : token;
      }

      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${normalizedToken}`,
      });

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Could not fetch user details",
        );
      }

      dispatch(setUser(response.data.userDetails));
      localStorage.setItem("user", JSON.stringify(response.data.userDetails));
    } catch (error) {
      console.log("GET_USER_DETAILS_API ERROR....", error);
      toast.error("Could Not Fetch User Details");
      if (navigate) {
        navigate("/login");
      }
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    if (!token) throw new Error("No auth token provided");

    let normalizedToken = token;
    if (typeof token === "string") {
      normalizedToken =
        token.startsWith('"') && token.endsWith('"')
          ? token.slice(1, -1)
          : token;
    }

    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${normalizedToken}`,
      },
    );

    //console.log("GET_USER_ENROLLED_COURSES_API API RESPONSE.......",response);

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message || "Could not fetch enrolled courses",
      );
    }

    result = response.data.courses || [];
    return result;
  } catch (error) {
    console.log(
      "GET_USER_ENROLLED_COURSES_API ERROR....",
      error?.response?.status,
      error?.response?.data,
      error?.message,
    );
    toast.error("Could Not Fetch Enrolled Courses");
    return result;
  } finally {
    toast.dismiss(toastId);
  }
}
