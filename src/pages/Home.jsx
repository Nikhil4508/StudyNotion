import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/CTAButton";
import Banner from "../assets/video2.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import "../App.css";
import TimeLineSection from "../components/core/HomePage/TimeLineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider";

const Home = () => {
  return (
    <div className="">
      {/* section 1 */}
      <div className="relative mx-auto flex flex-col items-center w-11/12 text-white justify-between max-w-maxContent ">
        <Link to={"/signup"}>
          <div className=" group mt-10 p-1 mx-auto rounded-full bg-richblack-700 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit shadow-xl ">
            <button className=" flex flex-row gap-2 items-center rounded-full px-3 py-1.25  transition-all duration-200 group-hover:bg-richblack-900">
              Become an Instructor
              <FaArrowRight />
            </button>
          </div>
        </Link>

        <div className=" mt-8 text-left lg:text-center text-4xl font-semibold">
          Empower your future with <HighlightText text={"Coding Skills"} />
        </div>

        <div className=" mt-4 lg:w-[70%] md:w-[90%] md:text-center text-left lg:text-center text-lg font-bold text-richblack-300">
          with our coding courses, you can learn at your own pace, from anywhere
          in the world, and get access to a wealth of resources, including
          hands-on-projects, quizzes, and persnalized feedback from Instructors.
        </div>

        <div className="flex flex-row gap-8 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        <div className="mt-14 lg:shadow-card-1 w-full pr-3 sm:px-4 md:px-8 lg:px-0">
          <video
            className="w-full h-auto max-w-full object-contain md:shadow-card-1 shadow-card-4"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* code section 1 */}
        <div className="mx-auto mt-25 md:mt-30 lg:mt-40 mb-10 w-full max-w-maxContent">
          <CodeBlocks
            position={"lg:flex-row flex-col"}
            heading={
              <div className=" text-4xl font-semibold text-white ">
                Unlock your <HighlightText text={"Coding potential "} />
                with our online courses.
              </div>
            }
            subheading={
              "Our courses are designed and taughty by industry experts who have years of experience in coming and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btntext: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btntext: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>
  <html>
  <head>
  <title>Example</title>
  <link rel="stylesheet" href="style.css">
  </head>
  <body>
  <h1>
    <a href="/">Header</a>
  </h1>
  <nav>
    <a href="one/">One</a>
    <a href="two/">two</a>
    <a href="three/">three</a>
  </nav>
  </body>
  </html>`}
            codeColor={"text-yellow-25"}
            gradientColor={`pointer-events-none absolute left-1/3 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[400px] rounded-full bg-gradient-to-b from-yellow-200 to-orange-500 opacity-30 blur-[100px]`}
          />
        </div>
        {/* code section 2 */}
        <div className="mx-auto mb-30 mt-10 w-full max-w-maxContent">
          <CodeBlocks
            position={"lg:flex-row-reverse flex-col"}
            heading={
              <div className=" text-4xl font-semibold text-white ">
                Start <HighlightText text={"Coding in seconds "} />
              </div>
            }
            subheading={
              "Go ahead,give it a try.Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btntext: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btntext: "Learn More",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>
  <html>
  <head>
  <title>Example</title>
  <link rel="stylesheet" href="style.css">
  </head>
  <body>
  <h1>
    <a href="/">Header</a>
  </h1>
  <nav>
    <a href="one/">One</a>
    <a href="two/">two</a>
    <a href="three/">three</a>
  </nav>
  </body>
  </html>`}
            codeColor={"text-yellow-25"}
            gradientColor={`pointer-events-none absolute left-1/3 top-1/4 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[400px] rounded-full bg-gradient-to-b from-blue-400 to-blue-500 opacity-30 blur-[100px]`}
          />
        </div>

        <ExploreMore />
      </div>

      {/* section 2  tabs and cards */}
      <div className=" bg-pure-greys-5 text-richblack-700  mt-10">
        <div className="homepage_bg lg:h-75 h-50 ">
          <div className=" w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto ">
            <div className="h-[30px] lg:h-[165px]"></div>

            <div className="flex flex-col md:flex-row gap-6 items-center ">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-1">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>

              <CTAButton active={false} linkto={"/signup"}>
                <div className="">Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>

        <div className=" mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-6 ">
          <div className="flex-cols lg:flex gap-6 mt-25 mb-10 ">
            <div className="text-4xl font-semibold lg:w-[45%] ">
              Get the skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className=" flex flex-col gap-6 lg:w-[45%] mt-8 lg:mt-0">
              <div className="text-[16px] mb-6">
                The modern StudyNotion is the dictates its own terms.Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
              </CTAButton>
            </div>
          </div>
          <TimeLineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* section 3 */}
      <div className=" w-11/12 max-w-maxContent mx-auto flex flex-col items-center justify-center gap-6 bg-richblack-900 text-white">
        <InstructorSection />

        <h2 className="text-center text-4xl font-semibold mt-10">
          Reviews from other learners
        </h2>
        <ReviewSlider />
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Home;
