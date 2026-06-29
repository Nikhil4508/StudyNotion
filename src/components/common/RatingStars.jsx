import { useEffect, useState } from "react";
import { TiStarFullOutline } from "react-icons/ti";


function RatingStars({Review_Count,Star_Size}) {
  const [starCount,setStarCount] = useState({
    full:0,
    half:0,
    empty:0,
  })

  useEffect(() => {
    const wholeStars = Math.floor(Review_Count) || 0
    setStarCount({
      full:wholeStars,
      half:Number.isInteger(Review_Count) ? 0 : 1,
      empty:Number.isInteger(Review_Count) ? 5 - wholeStars : 4 - wholeStars,
    })

  },[Review_Count]);

  return (
    <div className="flex gap-1 text-yellow-100">
      {/* full star */}
      {[...new Array(starCount.full)].map((_,i) => {
        return <TiStarFullOutline key={i} size={Star_Size || 20} />
      })}
      {/* half star */}
      {[...new Array(starCount.half)].map((_,i) => {
        return <TiStarFullOutline key={i} size={Star_Size || 20} />
      })}
      {/* empty star */}
      {[...new Array(starCount.empty)].map((_,i) => {
        return <TiStarFullOutline key={i} size={Star_Size || 20} />
      })}
    </div>
  )
}

export default RatingStars