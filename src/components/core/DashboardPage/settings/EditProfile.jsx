import React from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../../../services/operations/SettingAPI";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Others"];

const EditProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      dateOfBirth: user?.additionalDetails?.dateOfBirth,
      gender: user?.additionalDetails?.gender,
      contactNumber: user?.additionalDetails?.contactNumber,
      about: user?.additionalDetails?.about,
    },
  });

  const submitProfileForm = async (data) => {
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("Error Message - ", error.message);
    }
  };

  const inputClass =
    "w-full rounded-md bg-richblack-700 p-3 text-richblack-5 placeholder:text-richblack-400 outline-none focus:ring-[1.5px] focus:ring-yellow-50 text-sm";
  const labelClass = "text-richblack-300 text-sm mb-1 block";

  return (
    <form onSubmit={handleSubmit(submitProfileForm)} className="mb-8">
      <div className="rounded-md bg-richblack-800 p-6">
        <h2 className="text-richblack-5 text-lg font-semibold mb-6">
          Profile Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div>
            <label className={labelClass}>First Name</label>
            <input
              type="text"
              placeholder="Enter First Name"
              className={inputClass}
              {...register("firstName", { required: true })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
            {errors.firstName && (
              <p className="text-pink-200 text-xs mt-1">First name is required.</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              placeholder="Enter Last Name"
              className={inputClass}
              {...register("lastName", { required: true })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
            {errors.lastName && (
              <p className="text-pink-200 text-xs mt-1">Last name is required.</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              className={`${inputClass} cursor-pointer`}
              {...register("dateOfBirth")}
              style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            />
          </div>

          {/* Gender */}
          <div>
            <label className={labelClass}>Gender</label>
            <select
              className={`${inputClass} cursor-pointer`}
              {...register("gender")}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            >
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Number */}
          <div>
            <label className={labelClass}>Contact Number</label>
            <input
              type="tel"
              placeholder="Enter Contact Number"
              className={inputClass}
              {...register("contactNumber", {
                minLength: { value: 8, message: "Invalid phone number" },
                maxLength: { value: 12, message: "Invalid phone number" },
              })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
            {errors.contactNumber && (
              <p className="text-pink-200 text-xs mt-1">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          {/* About */}
          <div>
            <label className={labelClass}>About</label>
            <input
              type="text"
              placeholder="Enter Bio Details"
              className={inputClass}
              {...register("about")}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            />
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
          Save
        </button>
      </div>
    </form>
  );
};

export default EditProfile;

