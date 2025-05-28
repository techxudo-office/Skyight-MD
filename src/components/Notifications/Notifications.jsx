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
  const logoutHandler = useLogout();
  const { adminData } = useSelector((state) => state.persist);
  const { notifications, isLoadingNotifications } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (!adminData?.token) return;
    dispatch(
      getNotifications({
        token: adminData?.token,
        id: adminData?.admin?.id,
        logoutHandler,
      })
    );
  }, [adminData?.token]);

  useEffect(() => {}, [notifications]);

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
          height={600}
          itemCount={notifications.length}
          itemSize={100}
          width="100%"
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
