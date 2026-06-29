import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";

export default function Settings() {
  return (
    <>
      <h1 className="mb-10 text-3xl font-semibold text-richblack-5">
        Edit Profile
      </h1>
      {/* change profile picture */}
      <ChangeProfilePicture />
      {/* profile */}
      <EditProfile />
      {/* update password */}
      <UpdatePassword />
      {/* delete account */}
      <DeleteAccount />
    </>
  );
}
