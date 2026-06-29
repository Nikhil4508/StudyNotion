import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homePage-Explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

const tabName = [
  "Free",
  "New to Coding",
  "Most Popular",
  "Skill Paths",
  "Career Paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading,
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((courses) => courses.tag === value);
    if (result.length > 0) {
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading);
    }
  };

  return (
    <div className="relative w-full">
      <div className="text-4xl font-semibold text-center">
        Unlock the
        <HighlightText text={"Power of Code"} />
      </div>
      <p className="text-center text-richblack-300 text-lg mt-2">
        Learn to Build Anything You Can Imagine
      </p>

      {/* Tabs Section - fully responsive */}
      <div className="text-[16px] text-richblack-300 flex flex-row flex-wrap lg:flex-nowrap gap-1.5 lg:gap-2 bg-richblack-800 p-1.5 lg:p-1 items-center rounded-[30px] lg:rounded-full mt-6 mb-6 mx-auto w-fit border border-richblack-700/50 justify-center">
        {tabName.map((items, idx) => {
          return (
            <div
              className={`px-3 py-1.5 md:px-4 md:py-2 text-[14px] md:text-[16px] rounded-full cursor-pointer transition-all duration-200 hover:bg-richblack-900 hover:text-richblack-5 ${currentTab === items ? "bg-richblack-900 font-medium text-richblack-5 " : "text-richblack-300"}`}
              key={idx}
              onClick={() => setMyCards(items)}
            >
              {items}
            </div>
          );
        })}
      </div>

      <div>
        {/* Spacer for overlapping on desktop, hidden/collapsed on mobile */}
        <div className="hidden lg:block lg:h-[200px]"></div>

        {/* course card group */}
        <div className="lg:absolute lg:left-[50%] lg:-translate-x-[50%] lg:bottom-0 lg:translate-y-[50%] w-full lg:w-11/12 max-w-maxContent flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8 lg:gap-10 px-4 lg:px-0 z-10 mt-8 lg:mt-0">
          {courses.map((element, index) => {
            return (
              <CourseCard
                key={index}
                cardData={element}
                setCourses={setCourses}
                currentCard={currentCard}
                setCurrentCard={setCurrentCard}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExploreMore;
