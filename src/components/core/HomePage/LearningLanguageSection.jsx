import React from "react";
import HighlightText from "./HighlightText";
import know_your_progress from "../../../assets/know_your_progress1.png";
import compare_with_other from "../../../assets/compare_with_other1.png";
import plan_your_lesson from "../../../assets/plan_your_lessons1.png";
import CTAButton from "./CTAButton";


const LearningLanguageSection = () => {
  return (
    <div className="mt-33 mb-25">
      <div className=" flex flex-col items-center gap-4 ">
        <div className="text-4xl font-semibold text-left lg:text-center">
          Your Swiss Knife for
          <HighlightText text={" Learning any Language."} />
        </div>
        <div className=" text-left lg:text-center text-richblack-600 text-base font-medium lg:w-[70%] mx-auto">
          Using spin making learning mulitple languages easy.with 20+ languages
          realistic voice-over,progress tracking,custom schedule and more.
        </div>

        <div className="flex-cols lg:flex items-center justify-center mt-15 ">
          <img
            src={know_your_progress}
            alt="know_your_progress image"
            className="w-60 lg:w-90 rounded-md border border-richblack-25 rotate-15 shadow-image "
          />
          <img
            src={compare_with_other}
            alt="compare_with_other image"
            className="w-60 lg:w-90 rounded-md border border-richblack-25 -rotate-5 shadow-image "
          />
          <img
            src={plan_your_lesson}
            alt="plan_your_lesson image"
            className="w-60 lg:w-90 rounded-md border border-richblack-25 rotate-15 shadow-image "
          />
        </div>
        <div className="  mt-20 ">
          <CTAButton active={true} linkto={"/signup"} >
            Learn More
          </CTAButton>
        </div>

      </div>
    </div>
  );
};

export default LearningLanguageSection;
