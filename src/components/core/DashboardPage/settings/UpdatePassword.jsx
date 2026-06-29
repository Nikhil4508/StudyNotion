import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { changePassword } from "../../../../services/operations/SettingAPI";

const UpdatePassword = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitPasswordForm = async (data) => {
    try {
      await changePassword(token, data);
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  const inputClass =
    "w-full rounded-md bg-richblack-700 p-3 pr-10 text-richblack-5 placeholder:text-richblack-400 outline-none focus:ring-[1.5px] focus:ring-yellow-50 text-sm";
  const labelClass = "text-richblack-300 text-sm mb-1 block";

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)} className="mb-8">
      <div className="rounded-md bg-richblack-800 p-6">
        <h2 className="text-richblack-5 text-lg font-semibold mb-6">
          Password
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Current Password */}
          <div>
            <label className={labelClass}>Current Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter Current Password"
                className={inputClass}
                {...register("oldPassword", { required: true })}
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-richblack-300 hover:text-richblack-100"
                onClick={() => setShowOldPassword((p) => !p)}
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>
            {errors.oldPassword && (
              <p className="text-pink-200 text-xs mt-1">Current password is required.</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className={labelClass}>New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter New Password"
                className={inputClass}
                {...register("newPassword", { required: true, minLength: 8 })}
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-richblack-300 hover:text-richblack-100"
                onClick={() => setShowNewPassword((p) => !p)}
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </span>
            </div>
            {errors.newPassword && (
              <p className="text-pink-200 text-xs mt-1">
                {errors.newPassword.type === "minLength"
                  ? "Password must be at least 8 characters."
                  : "New password is required."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-x-3 mt-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/myprofile")}
          className="px-5 py-2 rounded-md bg-richblack-700 text-richblack-300 text-sm font-medium hover:bg-richblack-600 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-yellow-50 text-black text-sm font-semibold hover:bg-yellow-100 transition-colors cursor-pointer"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default UpdatePassword;

