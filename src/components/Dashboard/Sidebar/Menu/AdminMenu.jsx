import { FaUserCog } from "react-icons/fa";
import { TbUserStar } from "react-icons/tb";
import MenuItem from "./MenuItem";

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={FaUserCog} label="Manage Users" address="manage-users" />
      <MenuItem
        icon={TbUserStar}
        label="Seller Requests"
        address="seller-requests"
      />
    </>
  );
};

export default AdminMenu;
