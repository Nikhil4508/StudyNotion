import React from "react";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FooterLinks } from "../../data/footer-Links";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];

const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-4 pt-14">
        <div className="border-b w-full flex flex-col lg:flex-row pb-5 border-richblack-700">
          {/* Section 1 - Left */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
            {/* Column 1: Logo & Company */}
            <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-white rounded-full lg:h-8 lg:w-8 h-6 w-6 p-4 flex items-center justify-center">
                  <span className="text-richblack-900 font-bold text-lg">
                    S
                  </span>
                </div>
                <span className="text-richblack-50 font-semibold text-lg tracking-tight">
                  StudyNotion
                </span>
              </div>
              <h1 className="text-richblack-50 font-semibold text-[16px]">
                Company
              </h1>
              <div className="flex flex-col gap-2">
                {["About", "Careers", "Affiliates"].map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={`/${ele.toLowerCase()}`}>{ele}</Link>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 text-lg mt-1">
                <FaFacebook className="hover:text-richblack-50 transition-all duration-200 cursor-pointer" />
                <FaGoogle className="hover:text-richblack-50 transition-all duration-200 cursor-pointer" />
                <FaTwitter className="hover:text-richblack-50 transition-all duration-200 cursor-pointer" />
                <FaYoutube className="hover:text-richblack-50 transition-all duration-200 cursor-pointer" />
              </div>
            </div>

            {/* Column 2: Resources */}
            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px] mb-3">
                Resources
              </h1>
              <div className="flex flex-col gap-2">
                {Resources.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={`/${ele.split(" ").join("-").toLowerCase()}`}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 3: Plans & Community */}
            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px] mb-3">
                Plans
              </h1>
              <div className="flex flex-col gap-2 mb-6">
                {Plans.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={`/${ele.split(" ").join("-").toLowerCase()}`}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>
              <h1 className="text-richblack-50 font-semibold text-[16px] mb-3">
                Community
              </h1>
              <div className="flex flex-col gap-2">
                {Community.map((ele, index) => {
                  return (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      <Link to={`/${ele.split(" ").join("-").toLowerCase()}`}>
                        {ele}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2 - Right (Data from footer-links) */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLinks.map((ele, i) => {
              return (
                <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                  <h1 className="text-richblack-50 font-semibold text-[16px] mb-3">
                    {ele.title}
                  </h1>
                  <div className="flex flex-col gap-2">
                    {ele.links.map((link, index) => {
                      return (
                        <div
                          key={index}
                          className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                        >
                          <Link to={link.link}>{link.title}</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Hardcoded Career Building column as it's missing in data */}
            <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-richblack-50 font-semibold text-[16px] mb-3">
                Career building
              </h1>
              <div className="flex flex-col gap-2">
                {[
                  "Career paths",
                  "Career services",
                  "Interview prep",
                  "Professional certification",
                  "-",
                  "Full Catalog",
                  "Beta Content",
                ].map((ele, i) => {
                  return (
                    <div
                      key={i}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                    >
                      {ele === "-" ? (
                        <span className="block h-[1px] w-[50%] bg-richblack-700 my-2"></span>
                      ) : (
                        <Link to={`/${ele.split(" ").join("-").toLowerCase()}`}>
                          {ele}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-4 text-sm">
        <div className="flex-cols lg:justify-between lg:items-center lg:flex gap-3 w-full">
          <div className="flex flex-row">
            {BottomFooter.map((ele, i) => {
              return (
                <div
                  key={i}
                  className={`${
                    BottomFooter.length - 1 === i
                      ? ""
                      : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  } px-3 first:pl-0`}
                >
                  <Link to={`/${ele.split(" ").join("-").toLowerCase()}`}>
                    {ele}
                  </Link>
                </div>
              );
            })}
          </div>
          <span className="block h-[1px] w-[50%] md:w-0 lg:w-0 bg-richblack-700 my-2"></span>
          <div className="mt-2 lg:text-center text-left">
            Made with ❤️ NikhilRathod © 2026 Studynotion
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
