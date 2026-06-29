import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div className='w-11/12 text-left lg:text-center text-4xl font-semibold mb-10'>
        We are passionate about revolutionizing the way we learn.Our innovative platform
        <HighlightText text={"combines technology"}/>,
        <span className="bg-linear-to-b from-red-500 to-yellow-200 bg-clip-text text-transparent">
            {" "}expertise
        </span>,
        and community to create an 
        <span className="bg-linear-to-b from-orange-600 to-yellow-100 bg-clip-text text-transparent">
            {" "}unparalleled educational experience.
        </span>
    </div>
  )
}

export default Quote