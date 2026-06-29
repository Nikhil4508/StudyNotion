import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { markLectureAsComplete } from "../../../services/operations/CourseDetailsAPI";
import IconBtn from "../../common/IconBtn";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (() => {
      if (!courseSectionData.length) return;
      if (!courseId || !sectionId || !subSectionId) {
        navigate(`/dashboard/enrolled-courses`);
      } else {
        // console.log("courseSectionData", courseSectionData)
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId,
        );
        // console.log("filteredData", filteredData)
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId,
        );
        // console.log("filteredVideoData", filteredVideoData)
        setVideoData(filteredVideoData[0]);
        setPreviewSource(courseEntireData.thumbnail);
        setVideoEnded(false);
      }
    })();
  }, [courseSectionData, courseEntireData, location.pathname]);

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId,
    );

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSectionIndex === 0 && currentSubSectionIndex === 0) {
      return true;
    } else {
      return false;
    }
  };

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId,
    );

    const noOfSubsections =
      courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (
      currentSectionIndex === courseSectionData.length - 1 &&
      currentSubSectionIndex === noOfSubsections - 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  // go to the next video
  const goToNextVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId,
    );

    const noOfSubsections =
      courseSectionData[currentSectionIndex].subSection.length;

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    // console.log("no of subsections", noOfSubsections)

    if (currentSubSectionIndex !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndex + 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`,
      );
    } else {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndex + 1].subSection[0]._id;
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`,
      );
    }
  };

  // go to the previous video
  const goToPreviousVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId,
    );

    const currentSubSectionIndex = courseSectionData[
      currentSectionIndex
    ].subSection.findIndex((data) => data._id === subSectionId);

    if (currentSubSectionIndex !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSection[
          currentSubSectionIndex - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`,
      );
    } else {
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSectionLength =
        courseSectionData[currentSectionIndex - 1].subSection.length;
      const prevSubSectionId =
        courseSectionData[currentSectionIndex - 1].subSection[
          prevSubSectionLength - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`,
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    await markLectureAsComplete(
      { courseId: courseId, subSectionId: subSectionId },
      token,
      dispatch,
    );
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 text-white pt-6">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <div className="relative w-full">
          <video
            ref={playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
            controls
            className="w-full rounded-md shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          ></video>

          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1))",
              }}
              className="absolute inset-0 z-[10] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-sm md:text-lg max-w-max px-3 md:px-4 mx-auto bg-yellow-100 text-richblack-900 font-semibold"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // Native <video> element: reset time and autoplay
                    playerRef.current.currentTime = 0;
                    playerRef.current.play();
                    setVideoEnded(false);
                  }
                }}
                text="Rewatch"
                customClasses="text-sm md:text-lg bg-yellow-100 text-richblack-900 max-w-max px-3 md:px-4 mx-auto mt-2 md:mt-4 font-semibold"
              />
              <div className="mt-4 md:mt-10 flex min-w-[200px] md:min-w-[250px] justify-center gap-x-4 md:gap-x-6 text-sm md:text-lg">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPreviousVideo}
                    className="blackButton bg-yellow-100 text-richblack-900 px-3 md:px-4 py-1.5 md:py-2 rounded-md cursor-pointer font-semibold"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton bg-yellow-100 text-richblack-900 px-3 md:px-4 py-1.5 md:py-2 rounded-md cursor-pointer font-semibold"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <h1 className="mt-4 text-2xl md:text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6 text-sm md:text-base text-richblack-300">{videoData?.description}</p>
    </div>
  );
};

export default VideoDetails;
