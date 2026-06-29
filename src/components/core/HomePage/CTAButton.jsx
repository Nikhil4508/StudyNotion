import React from "react";
import { Link } from "react-router-dom";

const CTAButton = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <button
        className={`text-center text-sm md:text-lg lg:text-lg px-4 py-2 rounded-md font-semibold
          ${active ? "bg-yellow-100 text-black shadow-none" : "bg-richblack-800 text-white shadow-card"} hover:scale-95 transition-all duration-200  
        `}
      >
        {children}
      </button>
    </Link>
  );
};

export default CTAButton;
