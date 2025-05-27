import { useSelector } from "react-redux";
import { skyightLogo } from "../../assets/Index";

export default function Profileimage() {
  const { adminData } = useSelector((state) => state.persist);
  return (
    <img
      src={adminData?.admin?.image_url || skyightLogo}
      alt="profile-img"
      className="object-contain w-full h-full rounded-full"
    />
  );
}
