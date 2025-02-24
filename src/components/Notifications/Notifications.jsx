import React, { useEffect, useState, useCallback } from "react";
import { FixedSizeList as List } from "react-window"; // Import List from react-window
import {
  CardLayoutContainer,
  CardLayoutHeader,
} from "../../components/CardLayout/CardLayout";
import { getNotifications } from "../../utils/api_handler";
import { IoNotificationsOutline } from "react-icons/io5";
import { Spinner, BellIcon } from "../../components/components";

const Notifications = () => {
  const [notificationsData, setNotificationsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNotificationsHandler = useCallback(async () => {
    setLoading(true);
    let response = await getNotifications();
    if (response.status) {
      setNotificationsData(response.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getNotificationsHandler();
  }, [getNotificationsHandler]);

  // Render function for each item in the list
  const renderRow = ({ index, style }) => {
    const item = notificationsData[index];
    return (
      <div style={style} key={index}>
        <CardLayoutContainer className="w-full mb-5">
          <CardLayoutHeader
            className="flex flex-wrap items-center justify-start gap-5 py-3"
            removeBorder={true}
          >
            <BellIcon
              icon={
                <IoNotificationsOutline className="text-[46px] text-[#5372D8]" />
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
      {loading && <Spinner className="mx-auto text-primary" />}

      {notificationsData?.length > 0 ? (
        <List
          height={600} // Set the height of the viewport
          itemCount={notificationsData.length} // Number of items to render
          itemSize={100} // Height of each item in pixels (adjust as needed)
          width="100%" // Set the width of the list
        >
          {renderRow}
        </List>
      ) : (
        <>
          {!loading && (
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