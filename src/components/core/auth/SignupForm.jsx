import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [accountType, setAccountType] = useState("Student");

  const onSubmit = (data) => {
    const payload = {
      accountType,
      ...data,
    };

    dispatch(setSignupData(payload));
    dispatch(sendOtp(payload.email, navigate));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex w-full flex-col gap-4"
    >
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setAccountType("Student")}
          className={`px-4 py-2 rounded-md  ${accountType === "Student" ? "bg-richblack-800 text-white border-1 border-richblack-500" : "bg-richblack-700 text-richblack-300 border-1 border-richblack-700"}`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setAccountType("Instructor")}
          className={`px-4 py-2 rounded-md ${accountType === "Instructor" ? "bg-richblack-800 text-white border-1 border-richblack-500" : "bg-richblack-700 text-richblack-300 border-1 border-richblack-700"}`}
        >
          Instructor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          {...register("firstName")}
          placeholder="Enter first name"
          className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
        <input
          {...register("lastName")}
          placeholder="Enter last name"
          className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
      </div>

      <input
        {...register("email")}
        placeholder="Enter email address"
        className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5"
        style={{
          boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
        }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          {...register("password")}
          type="password"
          placeholder="Enter Password"
          className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          className="w-full rounded-md bg-richblack-800 p-3 text-richblack-5"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
        />
      </div>

      <button
        type="submit"
        className="mt-2 rounded-md bg-yellow-50 py-3 font-semibold text-richblack-900 cursor-pointer"
      >
        Create Account
      </button>
    </form>
  );
};

export default SignupForm;
