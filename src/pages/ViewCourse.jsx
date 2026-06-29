import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { getFullCourseDetails } from '../services/operations/CourseDetailsAPI';
import { setCompletedLectures, SetCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/ViewCourseSlice';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';

const ViewCourse = () => {

    const [reviewModal, setReviewModal] = useState(false);
    const {courseId} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=> {
        const setCourseSpecificDetails = async() => {
              const courseData = await getFullCourseDetails(courseId, token);
              if (!courseData) return;
              dispatch(SetCourseSectionData(courseData.courseDetails.courseContent));
              dispatch(setEntireCourseData(courseData.courseDetails));
              dispatch(setCompletedLectures(courseData.completedVideos));
              let lectures = 0;
              courseData?.courseDetails?.courseContent?.forEach((sec) => {
                lectures += sec.subSection.length
              })
              dispatch(setTotalNoOfLectures(lectures));

              // Auto-navigate to first lecture if no sub-section is in the URL
              const firstSection = courseData?.courseDetails?.courseContent?.[0];
              const firstSubSection = firstSection?.subSection?.[0];
              if (firstSection && firstSubSection) {
                  navigate(
                      `/view-course/${courseId}/section/${firstSection._id}/sub-section/${firstSubSection._id}`
                  );
              }
        }
        setCourseSpecificDetails();
    },[]);


  return (
    <>
        <div className="relative flex flex-col-reverse md:flex-row min-h-[calc(100vh-3.5rem)]">
            <VideoDetailsSidebar setReviewModal={setReviewModal} />
            <div className="flex-1 h-auto md:h-[calc(100vh-3.5rem)] md:overflow-auto">
                <div className="mx-6 py-4">
                    <Outlet />
                </div>
            </div>
        </div>
        {reviewModal && (<CourseReviewModal setReviewModal={setReviewModal} />)}
    </>
  )
}

export default ViewCourse
