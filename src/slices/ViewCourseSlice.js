import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    courseSectionData: [],
    courseEntireData: [],
    completedLectures: [],
    totalNoOfLectures: 0,
}


const viewCourseSlice = createSlice({
    name:"viewCourse",
    initialState,
    reducers:{
        SetCourseSectionData:(state,action) => {
            state.courseSectionData = action.payload
        },
        setEntireCourseData:(state,action) => {
            state.courseEntireData = action.payload
        },
        setTotalNoOfLectures: (state,action) => {
            state.totalNoOfLectures = action.payload 
        },
        setCompletedLectures: (state,action) => {
            state.completedLectures = action.payload
        },
        updateCompletedLecutures: (state,action) => {
            state.completedLectures.push(action.payload)
        },
    }
})



export const {
    SetCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
    setCompletedLectures,
    updateCompletedLecutures,
} = viewCourseSlice.actions


export default viewCourseSlice.reducer