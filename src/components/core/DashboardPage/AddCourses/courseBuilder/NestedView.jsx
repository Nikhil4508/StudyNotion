import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {RxDropdownMenu} from "react-icons/rx"
import {MdEdit,MdOutlineDelete} from "react-icons/md"
import {AiOutlinePlus} from "react-icons/ai"  
import { BiDownArrow } from 'react-icons/bi'
import SubSectionModal from "./SubSectionModal"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import { deleteSection ,deleteSubsection} from '../../../../../services/operations/CourseDetailsAPI'
import { setCourse } from '../../../../../slices/courseSlice' 


const NestedView = ({handleChangeEditSectionName }) => {

  const {course} = useSelector((state)=> state.course);
  const {token} = useSelector((state)=> state.auth);
  const dispatch = useDispatch();

  const [addSubSection,setAddSubSection] = useState(null);
  const [viewSubSection,setViewSubSection] = useState(null);
  const [editSubSection,setEditSubSection] = useState(null);

  const [confirmationModal,setConfirmationModal] = useState(null);

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
    }, token)

    if(result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (subSectionId,sectionId) => {
    const result = await deleteSubsection({
      subSectionId,
      sectionId,
      courseId: course._id,
    }, token)

    if(result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };


  return (
    <div>
      <div className="text-white rounded-md bg-richblack-700 p-6 px-8 mt-4 mb-4">
        {course?.courseContent?.map((section) => (
          <details key={section._id} open>
            <summary className="flex items-center justify-between gap-x-3 border-b-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu/>
                <p>{section.sectionName}</p>
              </div>

              <div className="flex items-center gap-x-2">
                <button onClick={() => handleChangeEditSectionName(section._id,section.sectionName)}>
                  <MdEdit className='cursor-pointer'/>
                </button>
                <button 
                  onClick={()=>{
                    setConfirmationModal({
                      text1:"Are You sure you want to Delete this Section",
                      text2:"All the lessons and lectures in this section will be deleted",
                      btn1Text:"Yes,Delete",
                      btn2Text:"Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }}
                >
                  <MdOutlineDelete className='text-red-400 cursor-pointer'/>
                </button>
                <span className="text-richblack-300">|</span>
                <BiDownArrow className={`text-xl text-richblack-300`} />
              </div>
            </summary>
            
            {/* subsections are here */}
            <div className="">
              {
                section.subSection.map((data)=> {
                  return(
                    <div key={data._id} className="flex justify-between px-4 border-b-1 border-richblack-600" onClick={()=>setViewSubSection(data)}>
                      <div className="flex items-center gap-x-3 ">
                        <RxDropdownMenu/>
                        <p>{data.title}</p>
                      </div>

                      <div className="flex items-center gap-x-3">
                        <button 
                          onClick={(e)=>{
                            e.stopPropagation();
                            setEditSubSection({...data,sectionId:section._id})
                          }}

                        >
                          <MdEdit className='cursor-pointer' />
                        </button>
                        <button 
                          onClick={(e)=>{
                            e.stopPropagation();
                            setConfirmationModal({
                            text1:"Are You sure you want to Delete this SubSection",
                            text2:"Selected lectures in this SubSection will be deleted",
                            btn1Text:"Yes,Delete",
                            btn2Text:"Cancel",
                            btn1Handler: () => handleDeleteSubSection(data._id,section._id),
                            btn2Handler: () => setConfirmationModal(null),
                            })
                          }}
                        >
                          <MdOutlineDelete className='text-red-400 cursor-pointer'/>
                        </button>
                        

                      </div>

                    </div>
                  )
                })
              }
              <button
                onClick={() => setAddSubSection(section._id)}
                className="mt-2 mb-4 flex items-center gap-x-2 text-yellow-50 cursor-pointer"
              >
                  <AiOutlinePlus/>
                  <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>

        {
          addSubSection ? (<SubSectionModal 
            modalData = {addSubSection}
            setModalData={setAddSubSection}
            add={true}
          />) 
          : viewSubSection ? (<SubSectionModal 
            modalData = {viewSubSection}
            setModalData={setViewSubSection}
            view={true}
          />) 
          : editSubSection ? (<SubSectionModal 
            modalData = {editSubSection}
            setModalData={setEditSubSection}
            edit={true}
          />) 
          : (<div> </div>)
        }

        {confirmationModal ? (<ConfirmationModal modalData = {confirmationModal} />) : (<div></div>)}
    </div>
  )
}

export default NestedView