import React, { useEffect } from "react";
import { FixedSizeList as List } from "react-window"; // Import List from react-window
import {
  CardLayoutContainer,
  CardLayoutHeader,
} from "../../components/CardLayout/CardLayout";
import { IoNotificationsOutline } from "react-icons/io5";
import { Spinner, BellIcon } from "../../components/components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../_core/features/notificationSlice";

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.auth);
  const { notifications, isLoadingNotifications } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (!adminData?.token) return;
    dispatch(
      getNotifications({ token: adminData?.token, id: adminData?.admin?.id })
    );
  }, [adminData?.token]);

  useEffect(() => {
    console.log(notifications, "notifications");
  }, [notifications]);

  // Render function for each item in the list
  const renderRow = ({ index, style }) => {
    const item = notifications[index];
    return (
      <div style={style} key={index}>
        <CardLayoutContainer className="w-full mb-5">
          <CardLayoutHeader
            className="flex flex-wrap items-center justify-start gap-5 py-3"
            removeBorder={true}
          >
            <BellIcon
              icon={
                <IoNotificationsOutline className="text-[30px] text-[#5372D8]" />
              }
            />
            <div>
              <h3 className="text-[12px] text-[#333]">
                {new Date(item?.created_at).toISOString().split("T")[0]}
              </h3>
              <h4 className="mb-0 text-[18px] font-semibold text-[#666]">
                {item?.title}
              </h4>
              <h4 className="mb-0 text-[12px] text-text">
                {item?.description}
              </h4>
            </div>
          </CardLayoutHeader>
        </CardLayoutContainer>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {isLoadingNotifications && <Spinner className="mx-auto text-primary" />}

      {notifications?.length > 0 ? (
        <List
          height={600} // Set the height of the viewport
          itemCount={notifications.length} // Number of items to render
          itemSize={100} // Height of each item in pixels (adjust as needed)
          width="100%" // Set the width of the list
        >
          {renderRow}
        </List>
      ) : (
        <>
          {!isLoadingNotifications && (
            <h2 className="text-center capitalize text-text">
              No Notifications Found
            </h2>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
