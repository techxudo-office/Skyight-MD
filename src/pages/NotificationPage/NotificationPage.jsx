import { MdAdd } from "react-icons/md";
import {
  CardLayoutBody,
  CardLayoutContainer,
  CardLayoutHeader,
} from "../../components/CardLayout/CardLayout";
import { useNavigate } from "react-router-dom";
import Notifications from "../../components/Notifications/Notifications";
import SecondaryButton from "../../components/SecondaryBtn/SecondaryBtn";

export default function NotificationPage() {
  const navigate = useNavigate();

  const navigationHandler = () => {
    navigate("/dashboard/create-notification");
  };
  return (
    <CardLayoutContainer>
      <CardLayoutHeader
        heading={"Notifications"}
        className="flex items-center justify-between"
      >
        <div className="relative">
          <SecondaryButton
            icon={<MdAdd className="text-black" />}
            text={"Create New Notification"}
            onClick={navigationHandler}
          />
        </div>
      </CardLayoutHeader>
      <CardLayoutBody removeBorder={true}>
        <Notifications />
      </CardLayoutBody>
    </CardLayoutContainer>
  );
}
