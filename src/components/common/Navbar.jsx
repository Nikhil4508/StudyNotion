import React, { useEffect, useState } from "react";
import { Link, matchPath } from "react-router-dom";
import navbarLinks from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import ProfileDropDown from "../core/auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";


const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [subLinks, setSubLinks] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(result.data.data);
      } catch (error) {
        console.log("Could not fetch categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-14 flex items-center justify-center border-b border-richblack-700">
      <div className="w-11/12 max-w-maxContent flex items-center justify-between ">
        {/* logo code */}
        <Link to="/">
          <div className="flex items-center gap-2">
            {/* The 'S' Icon Circle */}
            <div className="bg-white rounded-full h-9 w-9 flex items-center justify-center">
              <span className="text-richblack-900 font-bold text-xl">S</span>
            </div>
            {/* The Logo Text */}
            <span className="text-white font-semibold text-xl tracking-tight">
              StudyNotion
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:block">
          <ul className="flex gap-4 text-richblack-25 ">
            {navbarLinks.map((link, index) => (
              <li className="" key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className="flex items-center gap-1 group relative cursor-pointer"
                    onMouseEnter={() => setCatalogOpen(true)}
                    onMouseLeave={() => setCatalogOpen(false)}
                  >
                    <p className="">{link.title}</p>
                    <IoIosArrowDown size={20} />
                    <div
                      className={`absolute left-[50%] top-[50%] translate-x-[-50%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 transition-all duration-200 w-88 mt-7 z-11 ${
                        catalogOpen
                          ? "visible opacity-100"
                          : "invisible opacity-0"
                      }`}
                    >
                      <div className="absolute w-15 h-15 left-[50%] top-0 translate-x-[-50%] rotate-45 bg-richblack-5 rounded -z-10"></div>
                      <div className="flex flex-col gap-4">
                        {subLinks.length ? (
                          subLinks
                            ?.filter((sublink) => sublink?.course?.length > 0)
                            .map((element, idx) => (
                              <Link
                                className="hover:bg-richblack-50 p-2 rounded transitions-all duration-200"
                                to={`/catalog/${element.name
                                  .split("/")
                                  .join("")
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                key={idx}
                                onClick={() => setCatalogOpen(false)}
                              >
                                {element.name}
                              </Link>
                            ))
                        ) : (
                          <div className="">No Courses Found</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop login/signup/dashboard */}
        <div className="hidden lg:flex gap-x-4 items-center ">
          {user && user?.accountType !== "Instructor" && (
            <Link to={"/dashboard/cart"} className="relative">
              <FaCartShopping className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {/* login BTN */}
          {token === null && (
            <Link to={"/login"}>
              <button className="py-2 px-3 bg-richblack-800 border border-richblack-700 text-richblack-100 rounded-md cursor-pointer">
                Log in{" "}
              </button>
            </Link>
          )}
          {/* signup BTN */}
          {token === null && (
            <Link to={"/signup"}>
              <button className="py-2 px-3 bg-richblack-800 border border-richblack-700 text-richblack-100 rounded-md cursor-pointer">
                Sign up{" "}
              </button>
            </Link>
          )}
          {/*   */}
          {token !== null && <ProfileDropDown />}
        </div>

        {/* Mobile Right Section - Profile and Menu Button */}
        <div className="flex lg:hidden gap-x-4 items-center">
          {/* Profile Icon - Outside Menu */}
          {token !== null && <ProfileDropDown />}
          
          {/* Mobile Menu Button */}
          <button
            className="text-richblack-25 text-3xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <HiMenuAlt3 />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-richblack-900 bg-opacity-95 z-50 lg:hidden">
            <div className="flex flex-col h-full">
              {/* Top Bar with Cart and Close */}
              <div className="flex items-center justify-between p-4 border-b border-richblack-700">
                {/* Cart Icon on Left */}
                <div>
                  {user && user?.accountType !== "Instructor" && (
                    <Link
                      to={"/dashboard/cart"}
                      className="relative"
                      onClick={closeMobileMenu}
                    >
                      <FaCartShopping className="text-2xl text-richblack-100" />
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  )}
                </div>

                {/* Close Icon on Right */}
                <button
                  className="text-richblack-25 text-3xl"
                  onClick={closeMobileMenu}
                >
                  <IoClose />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-6">
                <ul className="flex flex-col gap-6 text-richblack-25">
                  {navbarLinks.map((link, index) => (
                    <li key={index}>
                      {link.title === "Catalog" ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-1 text-lg font-medium">
                            <p>{link.title}</p>
                            <IoIosArrowDown size={20} />
                          </div>
                          <div className="flex flex-col gap-3 pl-4">
                            {subLinks.length ? (
                              subLinks
                                ?.filter((sublink) => sublink?.course?.length > 0)
                                .map((element, idx) => (
                                  <Link
                                    className="text-richblack-100 hover:text-yellow-25 transition-all duration-200"
                                    to={`/catalog/${element.name
                                      .split("/")
                                      .join("")
                                      .split(" ")
                                      .join("-")
                                      .toLowerCase()}`}
                                    key={idx}
                                    onClick={closeMobileMenu}
                                  >
                                    {element.name}
                                  </Link>
                                ))
                            ) : (
                              <div className="text-richblack-100">No Courses Found</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Link to={link?.path} onClick={closeMobileMenu}>
                          <p
                            className={`text-lg font-medium ${
                              matchRoute(link?.path)
                                ? "text-yellow-25"
                                : "text-richblack-25"
                            }`}
                          >
                            {link.title}
                          </p>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Mobile Auth Buttons - Only show if not logged in */}
                {token === null && (
                  <div className="flex flex-col gap-4 mt-8">
                    <Link to={"/login"} onClick={closeMobileMenu}>
                      <button className="w-full py-2 px-3 bg-richblack-800 border border-richblack-700 text-richblack-100 rounded-md cursor-pointer">
                        Log in
                      </button>
                    </Link>
                    <Link to={"/signup"} onClick={closeMobileMenu}>
                      <button className="w-full py-2 px-3 bg-richblack-800 border border-richblack-700 text-richblack-100 rounded-md cursor-pointer">
                        Sign up
                      </button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
