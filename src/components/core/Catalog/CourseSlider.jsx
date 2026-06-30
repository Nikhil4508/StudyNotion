import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation , FreeMode, Pagination } from 'swiper/modules';
import 'swiper/css';
// import "swiper/css/free-mode"
import "swiper/css/pagination"

import Course_card from './Course_card';

const CourseSlider = ({courses}) => {
  // loop needs at least (slidesPerView * 2) slides to work without warning
  const enableLoop = courses?.length > 3;

  return (
    <>
      {
        courses?.length ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            loop={enableLoop}
            modules={[Autoplay,FreeMode,Navigation, Pagination]}
            breakpoints={{
              1024: { slidesPerView: 3 },
              768:  { slidesPerView: 2 },
            }}
            autoplay ={{
              delay:2500,
              disableOnInteraction:false,
            }}
            // navigation={true}
            pagination={{ clickable: true }}
            // freeMode={true}
          > 
            {
              courses.map((course,index) => (
                <SwiperSlide key={index}>
                  <Course_card course={course} height={"h-[250px]"}/>
                </SwiperSlide>
              ))
            }
          </Swiper>
        ) : (
          <p className="">No Course Found</p>
        )
      }
    </>
  )
}

export default CourseSlider