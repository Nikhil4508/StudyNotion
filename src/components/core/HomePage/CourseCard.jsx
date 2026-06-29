import React from 'react'
import { BsPeopleFill } from "react-icons/bs";
import { FaNetworkWired } from "react-icons/fa6";

const CourseCard = ({cardData, currentCard, setCurrentCard }) => {
  return (
    <div className="w-[360px] max-w-full md:w-80 lg:w-[30%] min-h-[300px] lg:h-63 flex flex-col" >
      <div 
      className={`w-full h-full p-6 border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between flex-1
        ${currentCard === cardData.heading 
          ? 'bg-white  shadow-yellow-100 shadow-card-3' 
          : 'bg-richblack-800 border-richblack-700'
        }`}
        onClick={() => setCurrentCard(cardData.heading)}
      
      >
      {/* Card Header */}
      <h3 className={`text-xl font-semibold text-richblack-5 mb-2 ${currentCard === cardData.heading ? "text-richblack-900": ""}`}>
        {cardData.heading}
      </h3>

      {/* Card Description */}
      <p className={`text-richblack-300 text-sm mb-4 ${ currentCard === cardData.heading ? "text-richblack-700": ""}`}>
        {cardData.description}
      </p>

      {/* Card Footer - Level and Lessons */}
      <div className="border-richblack-600 border-t-2 border-dotted pt-3 flex justify-between items-center text-sm">
        <span className="text-blue-200 font-medium flex items-center justify-center gap-2">
          <BsPeopleFill size={20}/>  {cardData.level}
        </span>
        <span className={`text-richblack-300 flex items-center justify-center gap-2 ${currentCard === cardData.heading ?"text-richblack-700":""}`}>
          <FaNetworkWired /> {cardData.lessonNumber} Lessons
        </span>
      </div>
    </div>
    </div>
  )
}

export default CourseCard