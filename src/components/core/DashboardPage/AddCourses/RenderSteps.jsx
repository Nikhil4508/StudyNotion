import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import CourseInformationForm from "./courseInformation/CourseInformationForm";
import CourseBuilderForm from "./courseBuilder/CourseBuilderForm";
import PublishCourse from "./PublishCourse/index.jsx";

const steps = [
  {
    id: 1,
    title: "Course Information",
  },
  {
    id: 2,
    title: "Course Builder",
  },
  {
    id: 3,
    title: "Publish",
  },
];

const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);

  return (
    <>
      <div className="relative mt-4 mb-6 flex w-full justify-between select-none">
        {steps.map((item) => (
          <React.Fragment key={item.id}>
            <div
              className="flex flex-col items-center relative z-10"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div
                className={`grid aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                  step === item.id
                    ? "bg-yellow-900 border-yellow-50 text-yellow-50"
                    : "border-richblack-700 bg-richblack-800 text-richblack-300"
                }`}
              >
                {step > item.id ? <FaCheck className="font-bold text-yellow-50" /> : item.id}
              </div>
              
              {item.id !== steps.length && (
                <div
                  className={`absolute top-[17px] left-[50%] h-[2px] w-full border-b-2 border-dashed -translate-y-1/2 -z-10 ${
                    step > item.id ? "border-yellow-50" : "border-richblack-500"
                  }`}
                />
              )}

              <p className={`mt-2 text-[10px] md:text-sm text-center ${step === item.id ? "text-richblack-5" : "text-richblack-300"}`}>
                {item.title}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>

      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  );
};

export default RenderSteps;
