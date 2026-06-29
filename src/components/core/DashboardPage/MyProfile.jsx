import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import {FaRegEdit} from "react-icons/fa"


const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div className="text-white">
      <h1 className="text-3xl font-semibold mb-10">My Profile</h1>
      {/* section 1 */}
      <div className="flex items-center justify-between bg-richblack-800 py-6 px-4 md:px-10 rounded-md mb-10">
        <div className="flex items-center justify-center gap-3 md:gap-4">
          <img
            src={user?.image}
            alt={`profile - ${user?.firstName}`}
            className="aspect-square w-[60px] md:w-[78px] rounded-full object-cover"
          />
          <div className="">
            <p className="font-semibold text-lg md:text-xl">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm md:text-base text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text={"Edit"}
          textClasses={"hidden md:inline"}
          customClasses={"bg-yellow-100 text-black font-semibold cursor-pointer md:py-2 md:px-4 p-2"}
          onclick={() => {
            navigate("/dashboard/settings");
          }}
        >
         <FaRegEdit size={18}/>
        </IconBtn>
      </div>

      {/* section 2 */}
      <div className="flex flex-col justify-between bg-richblack-800 py-6 px-4 md:px-10 rounded-md mb-10">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xl font-semibold">About</p>
          <IconBtn
            text="Edit"
            textClasses={"hidden md:inline"}
            customClasses={"bg-yellow-100 text-black font-semibold cursor-pointer md:py-2 md:px-4 p-2"}
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <FaRegEdit size={18}/>
          </IconBtn>
        </div>
        <p className="text-richblack-300">
          {user?.additionalDetails?.about ?? "Write Something about Yourself"}
        </p>
      </div>

      {/* section 3 */}
      <div className="flex flex-col bg-richblack-800 py-6 px-4 md:px-10 rounded-md ">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xl font-semibold">Personal Details</p>
          <IconBtn
            text="Edit"
            textClasses={"hidden md:inline"}
            customClasses={"bg-yellow-100 text-black font-semibold cursor-pointer md:py-2 md:px-4 p-2"}
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <FaRegEdit size={18}/>
          </IconBtn>
        </div>
        <div className="flex flex-col md:flex-row justify-start gap-y-4 md:gap-x-40 ">
          <div className="flex flex-col gap-y-4 ">
            <div className="">
              <p className="text-richblack-300">First Name</p>
              <p className="font-semibold">
                {user?.firstName ?? "Add Firstname"}
              </p>
            </div>
            <div className="">
              <p className="text-richblack-300">Email</p>
              <p className="font-semibold">
                {user?.email ?? "Add Email Address"}
              </p>
            </div>
            <div className="">
              <p className="text-richblack-300">Gender</p>
              <p className="font-semibold">
                {user?.additionalDetails?.gender ?? "Add Gender" }
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-y-4">
            <div className="">
            <p className="text-richblack-300">Last Name</p>
            <p className="font-semibold">
              {user?.lastName ?? "Add Lastname"}
            </p>
            </div>
            <div className="">
              <p className="text-richblack-300">Phone No.</p>
              <p className="font-semibold">
                {user?.additionalDetails?.contactNumber ?? "Add Phone Number" } 
              </p>
            </div>
            <div className="">
              <p className="text-richblack-300">Date of Birth</p>
              <p className="font-semibold">
                {user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
