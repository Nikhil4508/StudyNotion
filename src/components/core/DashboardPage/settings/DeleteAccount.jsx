import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProfile } from "../../../../services/operations/SettingAPI";

const DeleteAccount = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate));
    } catch (error) {
      console.log("Error Message - ", error.message);
    }
  }

  return (
    <div className="flex gap-x-5 rounded-md border border-pink-700 bg-pink-900 p-6 mb-8">
      {/* Icon */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-700">
        <FiTrash2 className="text-2xl text-pink-200" />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-y-2">
        <h2 className="text-lg font-semibold text-richblack-5">
          Delete Account
        </h2>
        <p className="text-richblack-300 text-sm leading-relaxed max-w-[500px]">
          Would you like to delete account?
          <br />
          This account may contain Paid Courses. Deleting your account is
          permanent and will remove all the content associated with it.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="w-fit italic text-pink-300 underline underline-offset-2 text-sm hover:text-pink-200 transition-colors mt-1 cursor-pointer"
        >
          I want to delete my account
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;

