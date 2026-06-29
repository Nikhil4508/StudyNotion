import React from 'react'
import ContactUsForm from '../ContactPage/ContactUsForm'
import ReviewSlider from '../../common/ReviewSlider'


const ContactForm = () => {
  return (
    <div className='mt-[120px] mx-auto w-11/12 max-w-maxContent w-fit'>
      <h1 className="text-4xl font-semibold text-left lg:text-center mb-2">
        Get in Touch
      </h1>
      <p className="text-md text-left lg:text-center text-richblack-100 mb-8">
        We'd love to here for you, please fill out this form.
      </p>
      <div className="">
        <ContactUsForm/>
      </div>
      

    </div>
  )
}

export default ContactForm