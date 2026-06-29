import React from 'react'
import IconBtn from './IconBtn'

const ConfirmationModal = ({modalData}) => {
  return (
    <div className='fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-white/10 backdrop-blur-sm'>
        <div className="border border-richblack-400 rounded-md p-6 bg-richblack-800 w-[350px] flex flex-col gap-y-4">
            <p className="text-lg font-semibold text-richblack-5">
                {modalData.text1}
            </p>
            <p className="text-richblack-200">
                {modalData.text2}
            </p>
            <div className=" flex gap-4 items-center mt-4">
                <IconBtn  
                    onclick={modalData?.btn1Handler}
                    text={modalData?.btn1Text}
                    customClasses={"bg-yellow-100 text-black font-semibold cursor-pointer"}
                />
                <button
                    onClick={modalData?.btn2Handler}
                    className="px-4 py-2 rounded-md bg-richblack-700 text-richblack-50 cursor-pointer"
                >
                    {modalData?.btn2Text}
                </button>
            </div>

        </div>
    </div>
  )
}

export default ConfirmationModal