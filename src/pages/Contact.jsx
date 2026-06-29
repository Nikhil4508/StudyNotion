import React from "react"
import Footer from "../components/common/Footer"
import ContactUsForm from "../components/core/ContactPage/ContactUsForm"
import { HiChatBubbleLeftRight, HiMiniGlobeEuropeAfrica } from "react-icons/hi2"
import { IoCall } from "react-icons/io5"
import ReviewSlider from "../components/common/ReviewSlider"

const Contact = () => {
  const contactDetails = [
    {
      icon: <HiChatBubbleLeftRight className="h-6 w-6" />,
      heading: "Chat on us",
      description: "Our friendly team is here to help.",
      details: "info@studynotion.com",
    },
    {
      icon: <HiMiniGlobeEuropeAfrica className="h-6 w-6" />,
      heading: "Visit us",
      description: "Come and say hello at our office HQ.",
      details: "Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016",
    },
    {
      icon: <IoCall className="h-6 w-6" />,
      heading: "Call us",
      description: "Mon - Fri From 8am to 5pm",
      details: "+123 456 7869",
    },
  ]

  return (
    <div className="text-white">
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 lg:flex-row">
        {/* Contact Details */}
        <div className="flex flex-col gap-6 rounded-xl bg-richblack-800 p-8 lg:w-[40%] h-fit">
          {contactDetails.map((ele, i) => (
            <div
              className="flex flex-col gap-2 p-3 text-sm text-richblack-200"
              key={i}
            >
              <div className="flex flex-row items-center gap-3">
                <div className="text-richblack-5">{ele.icon}</div>
                <h1 className="text-lg font-semibold text-richblack-5">
                  {ele.heading}
                </h1>
              </div>
              <p className="font-medium">{ele.description}</p>
              <p className="font-semibold">{ele.details}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="flex flex-col gap-6 rounded-xl border border-richblack-600 p-8 lg:w-[60%]">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold text-richblack-5">
              Got a Idea? We've got the skills. Let's team up
            </h1>
            <p className="text-base text-richblack-300">
              Tell us more about yourself and what you're got in mind.
            </p>
          </div>
          <ContactUsForm />
        </div>
      </div>

      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      
      <Footer />
    </div>
  )
}

export default Contact
