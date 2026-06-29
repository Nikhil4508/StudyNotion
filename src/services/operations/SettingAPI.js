import { apiConnector } from "../apiconnector";
import { toast } from "react-hot-toast";
import { setLoading } from "../../slices/profileSlice";
import { setToken, setLoading as setAuthLoading } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { settingsEndpoints } from "../apis";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateProfile(token, formData) {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Updating profile...");
    dispatch(setLoading(true));
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await apiConnector(
        "PUT",
        UPDATE_PROFILE_API,
        formData,
        headers,
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Could not update profile");
      }

      // merge updated profile details into user object
      const state = getState();
      const existingUser = state.profile.user;
      const updatedProfileDetails = response.data.profileDetails;

      const updatedUser = existingUser
        ? {
            ...existingUser,
            firstName: formData.firstName || existingUser.firstName,
            lastName: formData.lastName || existingUser.lastName,
            additionalDetails: updatedProfileDetails,
          }
        : null;

      if (updatedUser) {
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("UPDATE PROFILE ERROR =>", error);
      toast.error("Unable to update profile");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function changePassword(token, passwordData, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating password...");
    dispatch(setAuthLoading(true));
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await apiConnector(
        "POST",
        CHANGE_PASSWORD_API,
        passwordData,
        headers,
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Could not change password");
      }

      toast.success("Password changed successfully");
      if (navigate) navigate("/login");
    } catch (error) {
      console.log("CHANGE PASSWORD ERROR =>", error);
      toast.error("Unable to change password");
    }
    dispatch(setAuthLoading(false));
    toast.dismiss(toastId);
  };
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting account...");
    dispatch(setLoading(true));
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await apiConnector(
        "DELETE",
        DELETE_PROFILE_API,
        null,
        headers,
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Could not delete account");
      }

      // clear client state
      dispatch(setToken(null));
      dispatch(setUser(null));
      dispatch(resetCart());
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Account deleted successfully");
      if (navigate) navigate("/");
    } catch (error) {
      console.log("DELETE PROFILE ERROR =>", error);
      toast.error("Unable to delete account");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function changeProfilePicture(token, formData) {
  return async (dispatch, getState) => {
    const toastId = toast.loading("Updating profile picture...");
    dispatch(setLoading(true));
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await apiConnector(
        "POST",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        headers,
      );

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Could not update profile picture",
        );
      }

      // try to obtain the new image URL from multiple possible response shapes
      const newImage =
        response.data.image ||
        response.data.profileDetails?.image ||
        response.data.user?.image ||
        null;

      const state = getState();
      const existingUser = state.profile.user;

      const updatedUser = existingUser
        ? { ...existingUser, image: newImage }
        : null;

      if (updatedUser) {
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.log("CHANGE PROFILE PICTURE ERROR =>", error);
      toast.error("Unable to update profile picture");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}
