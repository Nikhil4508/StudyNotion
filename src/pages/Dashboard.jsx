import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/DashboardPage/Sidebar";

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  if (profileLoading || authLoading) {
    return <div className="mt-10 mx-auto">Loading...</div>;
  }

  return (
    <div className="relative flex flex-col md:flex-row min-h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <div className="h-[calc(100vh-3.5rem)] w-full overflow-auto" data-lenis-prevent="true">
        <div className="mx-auto w-11/12 max-w-[1000px] py-6 pb-20 md:pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
