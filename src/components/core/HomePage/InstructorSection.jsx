import React from 'react'
import Instructor from '../../../assets/instructor.jpg'
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='mt-20 '>

      <div className="flex-cols lg:flex gap-20 items-center ">
        {/* left  */}
        <div className="lg:w-[50%] lg:shadow-card-2 w-full pl-3 sm:px-4 md:px-8 lg:px-0">
          <img 
            src={Instructor} 
            alt="Instructor" 
            className='w-full h-auto max-w-full object-contain md:shadow-card-2 shadow-card-5'
          />
        </div>

        <div className="lg:w-[50%] flex flex-col gap-6  ">

          <div className="text-4xl font-semibold mt-10 lg:w-[50%]">
            Become an
            <HighlightText text={"Instructor"} />
          </div>
          <p className="font-medium text-[16px] lg:w-[80%] text-richblack-300 ">
            Instructor from around the world teach millions of students on StudyNotion.We provide the tools and skills to teach what you love.  
          </p>
          <div className="mt-6">
            <CTAButton active={true} linkto={"/signup"} >
              <div className="flex gap-2 items-center">
                Start Teaching Today
                <FaArrowRight/>
              </div>
            </CTAButton>
          </div>

        </div>

      </div>

    </div>
  )
}

export default InstructorSection
