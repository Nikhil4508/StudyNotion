import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {
  const { totalItems } = useSelector((state) => state.cart);

  return (
    <div className="mx-auto w-11/12 max-w-[1000px] py-10">
      <h1 className="mb-14 text-3xl font-semibold text-richblack-5">Cart</h1>
      <p className="border-b border-b-richblack-700 pb-2 font-semibold text-richblack-400">
        {totalItems} Courses in Cart
      </p>

      {totalItems > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <div className="flex flex-1 flex-col">
            <RenderCartCourses />
          </div>
          <RenderTotalAmount />
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-richblack-100">
          Your Cart is Empty
        </p>
      )}
    </div>
  );
}
