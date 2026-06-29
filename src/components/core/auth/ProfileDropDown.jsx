import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../services/operations/authAPI";

const ProfileDropDown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    dispatch(logout(navigate));
  };

  const avatarSrc =
    user?.image ||
    `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName}%20${user?.lastName}`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="h-9 w-9 rounded-full overflow-hidden border border-richblack-700 flex items-center justify-center bg-richblack-800"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <img
          src={avatarSrc}
          alt="profile"
          className="h-full w-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-richblack-800 text-richblack-25 rounded-md shadow-lg z-50 border border-richblack-600">
          <div className="flex flex-col py-2 px-1">
            <Link
              to="/dashboard/myprofile"
              onClick={() => setOpen(false)}
              className="px-4 py-2 hover:bg-richblack-700 hover:rounded-md"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-left px-4 py-2 hover:bg-richblack-700 w-full hover:rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropDown;
