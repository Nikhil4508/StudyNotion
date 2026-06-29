import React from 'react'

const stats = [
    {
        count:"5K",
        label:"Active Students"
    },
    {
        count:"10+",
        label:"Mentors"
    },
    {
        count:"200+",
        label:"Courses"
    },
    {
        count:"50+",
        label:"Awards"
    },
];

const StatsComponent = () => {
  return (
    <section className="bg-richblack-700 py-12 px-6">
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-10 lg:flex-row justify-between text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-y-8">
          {stats.map((data, idx) => (
            <div className="flex flex-col items-center" key={idx}>
              <h1 className="text-4xl font-bold text-richblack-5">
                {data.count}
              </h1>
              <h2 className="font-semibold text-lg text-richblack-500 mt-2">
                {data.label}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsComponent