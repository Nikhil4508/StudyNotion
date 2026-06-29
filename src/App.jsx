import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Lenis from "lenis";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import VerifyEmail from "./pages/VerifyEmail";
import Signup from "./pages/Signup";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/DashboardPage/MyProfile";
import OpenRoute from "./components/core/auth/OpenRoute";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import ErrorPage from "./pages/ErrorPage";
import Settings from "./components/core/DashboardPage/settings";
import EnrolledCourses from "./components/core/DashboardPage/EnrolledCourses";
import Cart from "./components/core/DashboardPage/cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/DashboardPage/AddCourses";
import MyCourses from "./components/core/DashboardPage/MyCourses";
import EditCourse from "./components/core/DashboardPage/EditCourse";
import InstructorDashboard from "./components/core/DashboardPage/InstructorDashboard";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";

const App = () => {
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const lenis = new Lenis();
    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />

        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route path="about" element={<About />} />

        {/* Dashboard routes */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="myprofile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="cart" element={<Cart />} />
              <Route path="enrolled-courses" element={<EnrolledCourses />} />
              
            </>
          )}

          {/* for Instructor route in dashboard */}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="instructor" element={<InstructorDashboard />} />
              <Route path="add-course" element={<AddCourse />} />
              <Route path="my-courses" element={<MyCourses />} />
              <Route path="edit-course/:courseId" element={<EditCourse />} />
            </>
          )}
        </Route>

        {/* View Course (enrolled student) */}
        <Route
          path="view-course/:courseId"
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          <Route
            path="section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
        </Route>

        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
