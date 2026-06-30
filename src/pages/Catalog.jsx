import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/PageAndComponentData";
import Course_card from "../components/core/Catalog/Course_card";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import Spinner from "../components/common/Spinner";

const Catalog = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [activeTab, setActiveTab] = useState("mostPopular");

  // fetch all categories
  useEffect(() => {
    const getCategories = async () => {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      const category_id = res?.data?.data?.filter(
        (ct) =>
          ct.name.split("/").join("").split(" ").join("-").toLowerCase() ===
          catalogName,
      )[0]?._id;
      setCategoryId(category_id);
    };
    getCategories();
  }, [catalogName]);

  useEffect(() => {
    if (!categoryId) return;
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogPageData(categoryId);
        setCatalogPageData(res);
      } catch (error) {
        console.log(error);
      }
    };
    getCategoryDetails();
  }, [categoryId]);

  // Derive sorted courses based on active tab
  const allCourses = catalogPageData?.data?.selectedCategory?.course ?? [];

  const filteredCourses = (() => {
    if (activeTab === "mostPopular") {
      // sort by number of ratings — ratingAndReviews IS populated in the response
      return [...allCourses].sort(
        (a, b) =>
          (b.ratingAndReviews?.length ?? 0) - (a.ratingAndReviews?.length ?? 0),
      );
    } else {
      // sort by newest first; fall back to reversing the array if createdAt is absent
      const sorted = [...allCourses].sort(
        (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0),
      );
      // if every createdAt is identical/missing the sort is a no-op → reverse instead
      const allSame = sorted.every((c) => c.createdAt === sorted[0]?.createdAt);
      return allSame ? [...allCourses].reverse() : sorted;
    }
  })();

  if (!categoryId) return <Spinner />;

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="bg-richblack-800 px-4 py-8 lg:py-16">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-4">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-11/12 max-w-maxContent pb-10">
        {/* section 1 */}
        <div className="mt-10 lg:mt-16">
          <div className="text-3xl font-semibold mb-6 text-richblack-5">
            Courses to get you started
          </div>

          {/* Tabs */}
          <div className="flex border-b border-richblack-600 text-sm mb-6">
            <button
              onClick={() => setActiveTab("mostPopular")}
              className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                activeTab === "mostPopular"
                  ? "border-b-2 border-yellow-25 text-yellow-25"
                  : "text-richblack-200 hover:text-richblack-50"
              }`}
            >
              Most Popular
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                activeTab === "new"
                  ? "border-b-2 border-yellow-25 text-yellow-25"
                  : "text-richblack-200 hover:text-richblack-50"
              }`}
            >
              New
            </button>
          </div>

          <div>
            <CourseSlider key={activeTab} courses={filteredCourses} />
          </div>
        </div>

        {/* section 2 */}
        <div className="mt-10 lg:mt-16">
          <div className="text-3xl font-semibold mb-6 text-richblack-5">
            Top Courses in {catalogPageData?.data?.selectedCategory?.name}
          </div>

          <div>
            <CourseSlider
              courses={catalogPageData?.data?.differentCategory?.course}
            />
          </div>
        </div>

        {/* section 3 */}
        <div className="my-10 lg:my-16">
          <div className="text-3xl font-semibold text-richblack-5 mb-6">
            Frequently Bought Together
          </div>
          <div className="py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {catalogPageData?.data?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, index) => (
                  <Course_card
                    course={course}
                    key={index}
                    height={"h-[400px]"}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
