import { useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../../_core/features/notificationSlice";
import {
  CardLayoutContainer,
  CardLayoutHeader,
} from "../../CardLayout/CardLayout";
import { BellIcon, Spinner } from "../../components";

const NotificationDrop = () => {
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.persist);
  const { notifications, isLoadingNotifications } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    // Fetch notifications only if the admin is authenticated (token exists)
    if (!adminData?.token) return;
    dispatch(
      getNotifications({ token: adminData?.token, id: adminData?.admin?.id })
    );
  }, [adminData?.token]); // Run this effect when the token changes

  useEffect(() => {}, [notifications]); // Currently unused but reserved for future effects tied to notification updates

  // Renders each notification in the virtualized list
  const renderRow = ({ index, style }) => {
    const item = notifications[index]; // Get the current notification item by index

    return (
      <div style={style} key={index}>
        <CardLayoutContainer removeBg={true} className="w-full mb-2">
          <CardLayoutHeader
            className="flex items-center justify-start gap-3 py-2"
            removeBorder={true}
          >
            <BellIcon
              icon={
                <IoNotificationsOutline className="text-[20px] text-[#5372D8]" />
              }
            />
            <div>
              {/* Format creation date to YYYY-MM-DD */}
              <h3 className="text-xs text-[#333]">
                {new Date(item?.created_at).toISOString().split("T")[0]}
              </h3>
              {/* Display notification title and description */}
              <h4 className="mb-0 text-xs font-semibold text-[#666]">
                {item?.title}
              </h4>
              <h4 className="mb-0 text-xs text-text">{item?.description}</h4>
            </div>
          </CardLayoutHeader>
        </CardLayoutContainer>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-fit">
      {/* Show a spinner while loading notifications */}
      {isLoadingNotifications && <Spinner className="mx-auto text-primary" />}

      {notifications?.length > 0 ? (
        <>
          {/* Virtualized list using react-window for performance with large lists */}
          <List
            height={300} // Max height of the visible list container
            itemCount={3} // Only render 3 notifications for preview (can increase or make dynamic)
            itemSize={100} // Each row takes 100px height
            width="100%" // Full width of the container
          >
            {renderRow}
          </List>

          {/* Link to full notifications page */}
          <Link
            to={"notifications"}
            className="text-sm hover:underline hover:text-primary"
          >
            View more
          </Link>
        </>
      ) : (
        // Only show this message when not loading and list is empty
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

export default NotificationDrop;
