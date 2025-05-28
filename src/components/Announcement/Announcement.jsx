import  { useEffect, useState, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import {
  CardLayoutContainer,
  CardLayoutHeader,
} from "../../components/CardLayout/CardLayout";
// import { getAnnouncements } from "../../utils/api_handler";
import { Spinner } from "../../components/components";
import { HiOutlineSpeakerphone } from "react-icons/hi";

const Announcement = () => {
  const [AnnouncementData, setAnnouncementData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAnnouncementHandler = useCallback(async () => {
    setLoading(true);
    // let response = await getAnnouncements();
    if (response.status) {
      setAnnouncementData(response.data[0]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getAnnouncementHandler();
  }, [getAnnouncementHandler]);

  // Render function for each item in the list
  const renderRow = ({ index, style }) => {
    const item = AnnouncementData[index];
    return (
      <div style={style} key={index}>
        <CardLayoutContainer className="w-full mb-5">
          <CardLayoutHeader
            className="flex flex-wrap items-center justify-start gap-5 py-3"
            removeBorder={true}
          >
            {/* <BellIcon
              icon={
                <HiOutlineSpeakerphone className="text-[46px] text-primary" />
              }
            /> */}
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

      {AnnouncementData?.length > 0 ? (
        <List
          height={600} 
          itemCount={AnnouncementData.length}
          itemSize={100}
          width="100%" 
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

export default Announcement;