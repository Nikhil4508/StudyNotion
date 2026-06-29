import { useSelector } from "react-redux";
import { sidebarLinks } from "../../../data/Dashborad-links";
import SidebarLink from "./SidebarLink";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/operations/authAPI";
import { useState } from "react";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile,
  );
  const { loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);

  if (profileLoading || authLoading) {
    return <div className="mt-10 mx-auto">Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-row md:flex-col items-center md:items-stretch justify-around md:justify-start border-t-[1px] border-t-richblack-700 md:border-t-0 md:border-r-[1px] md:border-r-richblack-700 fixed bottom-0 left-0 right-0 z-50 md:relative md:bottom-auto md:left-auto md:right-auto md:z-0 h-14 md:h-[calc(100vh-3.5rem)] min-w-full md:min-w-[222px] bg-richblack-800 py-2 md:py-10">
        <div className="contents md:flex md:flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink link={link} iconName={link.icon} key={link.id} />
            );
          })}
        </div>

        <div className="hidden md:block mx-auto mt-5 mb-5 h-[1px] w-10/12 bg-richblack-600"></div>
        <div className="contents md:flex md:flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName={"VscSettingsGear"}
          />

          <button
            className="text-sm font-medium text-richblack-300"
            onClick={() =>
              setConfirmationModal({
                text1: " Are you Sure ?",
                text2: "You will be logged out of your Account",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
          >
            <div className="flex md:px-8 md:py-2 px-3 py-2 items-center gap-x-2">
              <VscSignOut className="text-lg font-medium" />
              <span className="hidden md:inline">Logout</span>
            </div>
          </button>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};
export default Sidebar;
