import React from "react";
// import logo1 from "../../../assets/GraduationCap.png";
// import logo2 from "../../../assets/GraduationCap.png";
// import logo3 from "../../../assets/Diamond.png";
// import logo4 from "../../../assets/GraduationCap.png";
import deskpc from "../../../assets/desk-pc.jpg";
import { BsFillMortarboardFill } from "react-icons/bs";
import { GiCutDiamond } from "react-icons/gi";
import { LiaCertificateSolid } from "react-icons/lia";
import { GiPuzzle } from "react-icons/gi";

const timeline = [
  {
    logo: <LiaCertificateSolid size={50} className="text-blue-200" />,
    heading: "Leadership",
    description: "Fully Committed to the success company",
  },
  {
    logo: <BsFillMortarboardFill size={50} className="text-red-400" />,
    heading: "Responsibility",
    description: "Students will always be our top priority",
  },
  {
    logo: <GiCutDiamond size={50} className="text-caribbeangreen-100" />,
    heading: "Flexibility",
    description: "The ability to switch is an important skills",
  },
  {
    logo: <GiPuzzle size={50} className="text-yellow-100" />,
    heading: "Solve the Problem",
    description: "Code your way to a solution",
  },
];

const TimeLineSection = () => {
  return (
    <div className="  ">
      <div className="flex-cols  lg:flex gap-6 items-center">
        {/* left */}
        <div className=" lg:w-[45%] flex flex-col items-start justify-between gap-2 ">
          {timeline.map((element, idx) => {
            return (
              <div key={idx}>
                <div className="flex gap-15 justify-center items-center">
                  <div className="w-[50px] h-[50px] bg-white flex items-center">
                    {/* <img src={element.logo} alt="image1" /> */}
                    {element.logo}
                  </div>
                  <div className=" ">
                    <h2 className="font-semibold text-[18px]">
                      {element.heading}
                    </h2>
                    <p className=" text-base ">{element.description}</p>
                  </div>
                </div>
                {idx !== timeline.length - 1 && (
                  <div className="w-0.5 h-5 bg-dotted border-l-2 border-dashed border-gray-400 ml-6.25 mt-1"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* right */}
        <div className="lg:w-[45%] mt-10 relative shadow-blue-200 ">
          <img
            className="object-cover h-fit "
            src={deskpc}
            alt="timeline-image"
          />

          <div
            className=" absolute bg-caribbeangreen-800 flex text-white uppercase md:py-8 lg:py-8 py-4 left-[50%] translate-x-[-50%] translate-y-[-50%] 
          "
          >
            <div className="flex-cols md:flex lg:flex gap-3 items-center border-r border-caribbeangreen-300 px-6">
              <p className="text-3xl font-bold">10</p>
              <p className=" text-caribbeangreen-300 text-sm">
                years exprience
              </p>
            </div>

            <div className="flex-cols md:flex lg:flex gap-3 items-center px-6">
              <p className="text-3xl font-bold">250</p>
              <p className=" text-caribbeangreen-300 text-sm">
                type of courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLineSection;
