import RenderSteps from "./RenderSteps";
import { AiFillThunderbolt } from "react-icons/ai";

export default function AddCourse() {
  return (
    <>
      <div className="w-full text-white flex flex-col lg:flex-row items-start justify-between gap-y-6 lg:gap-y-0 lg:gap-x-6">
        <div className="w-full lg:flex-1">
          <h1 className="text-3xl font-semibold">Add Course</h1>
          <div className="">
            <RenderSteps />
          </div>
        </div>
        <div className="hidden md:block bg-richblack-800 rounded-md p-6 w-full lg:max-w-[400px]">
          <p className="text-xl font-semibold flex items-center gap-1 mb-4">
            <AiFillThunderbolt className="text-yellow-200" />
            Code Upload Tips
          </p>
          <ul className="text-xs md:text-sm text-richblack-50 list-disc pl-5 space-y-2">
            <li>Set the course price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024*576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course builder is where you create & organize a course.</li>
            <li>
              Add topics in the course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the additional Data section throws up on the
              course single page.
            </li>
            <li>
              Make Announcements to notify any important notes to all enrolled
              students at once.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
