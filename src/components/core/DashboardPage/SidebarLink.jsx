import React from "react";
import * as Icons from "react-icons/vsc";
import { NavLink, matchPath, useLocation } from "react-router-dom";

const SidebarLink = ({ link, iconName }) => {
  const Icon = Icons[iconName];
  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <NavLink
      to={link.path}
      className={`relative md:px-8 md:py-2 px-3 py-2 text-sm font-medium transition-all duration-200 ${
        matchRoute(link.path)
          ? "bg-transparent md:bg-yellow-800 text-yellow-50 md:text-yellow-100"
          : "bg-opacity-0 text-richblack-300"
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        } hidden md:block`}
      ></span>

      <div className="flex items-center gap-x-2">
        {Icon ? (
          <Icon className="text-lg" />
        ) : (
          <span className="text-lg">•</span>
        )}
        <span className="hidden md:inline">{link.name}</span>
      </div>
    </NavLink>
  );
};
export default SidebarLink;
