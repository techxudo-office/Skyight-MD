import { useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import {
  CardLayoutContainer,
  CardLayoutHeader,
} from "../../components/CardLayout/CardLayout";
import { IoNotificationsOutline } from "react-icons/io5";
import { Spinner, BellIcon } from "../../components/components";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../_core/features/notificationSlice";
import useLogout from "../../hooks/useLogout";

const Notifications = () => {
  const dispatch = useDispatch();
  const logoutHandler = useLogout(); // Custom hook to log user out (used if token is invalid/expired)

  const { adminData } = useSelector((state) => state.persist);
  const { notifications, isLoadingNotifications } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (!adminData?.token) return;

    // Dispatch async thunk to fetch notifications, passing token and logout handler in case of auth failure
    dispatch(
      getNotifications({
        token: adminData?.token,
        id: adminData?.admin?.id,
        logoutHandler,
      })
    );
  }, [adminData?.token]);

  useEffect(() => {}, [notifications]); // This is redundant unless you're planning side effects

  // Function to render a single notification row — used by react-window for virtualized rendering
  const renderRow = ({ index, style }) => {
    const item = notifications[index]; // Efficiently accesses only the visible notification for rendering
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
              {/* Formats ISO date and only keeps the YYYY-MM-DD portion */}
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
      {/* Show loading spinner while fetching notifications */}
      {isLoadingNotifications && <Spinner className="mx-auto text-primary" />}

      {notifications?.length > 0 ? (
        // Virtualized list for performance: only renders items visible in viewport
        <List
          height={600} // Height of the scrollable area
          itemCount={notifications.length} // Total number of notifications
          itemSize={100} // Fixed height for each item (required by react-window)
          width="100%"
        >
          {renderRow}
        </List>
      ) : (
        <>
          {/* Fallback message shown if not loading and no data present */}
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
