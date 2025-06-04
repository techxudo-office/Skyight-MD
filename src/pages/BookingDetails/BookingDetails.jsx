import { useEffect, useRef } from "react";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
} from "../../components/CardLayout/CardLayout";
import {
  Button,
  Tag,
  Table,
  Spinner,
  CustomTooltip,
} from "../../components/components";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosAirplane, IoMdClock } from "react-icons/io";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useDispatch, useSelector } from "react-redux";
import { getBookingDetails } from "../../_core/features/bookingSlice";
import { MdArrowBack } from "react-icons/md";

dayjs.extend(utc); // Enables UTC plugin for consistent date parsing

const BookingDetails = () => {
  const printRef = useRef(); // Reference for printing-related functionality (not currently used here)
  const location = useLocation(); // React Router hook to access passed route state
  const navigate = useNavigate(); // React Router hook for navigation
  const dispatch = useDispatch();
  const { adminData } = useSelector((state) => state.persist);
  const { isLoadingBookingDetails, bookingDetails } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    // Fetch booking details when component mounts and required state/token exists
    if (location.state && adminData?.token) {
      const refId = location.state.id;
      dispatch(getBookingDetails({ id: refId, token: adminData?.token }));
    }
  }, [location.state, adminData?.token]);

  if (isLoadingBookingDetails) {
    return <Spinner className={"text-primary"} />; // Show loading spinner while data is being fetched
  }

  return (
    <>
      <div ref={printRef} className="flex flex-col w-full gap-5">
        <CardLayoutContainer>
          <CardLayoutBody className={"flex flex-wrap gap-3 justify-between"}>
            <div className="flex flex-col gap-3">
              <div className="py-4 text-3xl font-semibold text-text">
                <h1>
                  PNR:{" "}
                  <span className="text-primary">
                    {bookingDetails?.booking_reference_id}
                  </span>
                </h1>
                <h1 className="flex items-center gap-2 mt-2 w-fit ">
                  Status: <Tag value={bookingDetails?.booking_status} />
                </h1>
              </div>
            </div>
          </CardLayoutBody>

          <CardLayoutBody>
            {/* Looping through flight segments to render departure and arrival details */}
            {bookingDetails?.flightSegments &&
              bookingDetails.flightSegments.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-5 py-5 max-sm:flex-wrap text-text"
                >
                  <div className="flex flex-col items-start">
                    <h2 className="mb-2 text-2xl font-semibold text-primary">
                      Departure
                    </h2>
                    <p className="text-xl font-bold">
                      {item.departure_airport}
                    </p>
                    <p className="flex items-center gap-2">
                      <IoMdClock className="text-lg text-primary" />
                      {/* Formatting date and time for display */}
                      {dayjs(item.departure_datetime).format(
                        "MMM-DD-YYYY, hh:mm a"
                      )}
                    </p>
                  </div>
                  {/* Displaying a visual airplane icon with separators */}
                  <div className="flex items-center gap-3 max-sm:hidden text-primary">
                    <span className="h-0.5 rounded-full md:w-12 xl:w-28 bg-primary"></span>
                    <IoIosAirplane className="text-5xl" />
                    <span className="h-0.5 rounded-full md:w-12 xl:w-28 bg-primary"></span>
                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="mb-2 text-2xl font-semibold text-primary">
                      Arrival
                    </h2>
                    <p className="text-xl font-bold">{item.arrival_airport}</p>
                    <p className="flex items-center gap-2">
                      <IoMdClock className="text-lg text-primary" />
                      {dayjs(item.arrival_datetime).format(
                        "MMM-DD-YYYY, hh:mm a"
                      )}
                    </p>
                  </div>
                </div>
              ))}
          </CardLayoutBody>
        </CardLayoutContainer>

        <CardLayoutContainer>
          <div className="flex justify-between p-4 text-text">
            <div>
              <span className="font-semibold">Booked On: </span>
              {/* Parsing UTC created_at date for local display */}
              {dayjs
                .utc(bookingDetails?.created_at)
                .format("DD MMM YYYY, h:mm a")}
            </div>
            <div>
              <span className="font-semibold">TKT Time Limit: </span>
              {/* Formatting deadline to issue ticket */}
              {dayjs(bookingDetails?.Timelimit).format("DD MMM YYYY, h:mm a")}
            </div>
          </div>
        </CardLayoutContainer>

        <CardLayoutContainer>
          <CardLayoutHeader
            className={"mb-2 text-text"}
            heading="Passenger Details"
          />

          {bookingDetails && (
            <Table
              pagination={true}
              // Column definitions for each passenger detail
              columnsData={[
                {
                  name: "NAME",
                  selector: (row) => row.given_name,
                  sortable: false,
                },
                {
                  name: "TYPE",
                  selector: (row) => row.passenger_type_code,
                  sortable: false,
                },
                {
                  name: "BIRTH DATE",
                  selector: (row) => dayjs(row.birth_date).format("D-MMM-YYYY"),
                  sortable: false,
                },
                {
                  name: "PASSPORT NUMBER",
                  selector: (row) => row.doc_id,
                  sortable: false,
                },
                {
                  name: "EXPIRY",
                  selector: (row) =>
                    dayjs(row.expire_date).format("D-MMM-YYYY"),
                  sortable: false,
                },
                {
                  name: "ISSUANCE",
                  selector: (row) => row.doc_issue_country,
                  sortable: false,
                },
                {
                  name: "NATIONALITY",
                  selector: (row) => row.nationality,
                  sortable: false,
                },
              ]}
              tableData={bookingDetails?.passengers || []} // Populating table with passenger array
              progressPending={isLoadingBookingDetails}
              paginationTotalRows={bookingDetails?.passengers?.length}
              paginationComponentOptions={{ noRowsPerPage: "10" }}
            />
          )}
        </CardLayoutContainer>

        <CardLayoutContainer>
          <CardLayoutHeader
            className={"mb-2 text-text"}
            heading={"Pricing Information"}
          />
          <h2 className="p-5 text-xl font-semibold text-text">
            {/* Safely formatting total fare as localized currency */}
            Total Fare: {Number(
              bookingDetails?.total_fare
            ).toLocaleString()}{" "}
            PKR
          </h2>
        </CardLayoutContainer>

        <div className="flex items-center justify-end gap-3 mb-4">
          <CustomTooltip content={"Previous Page"}>
            <div>
              <Button
                icon={<MdArrowBack />}
                id={"hide-buttons"}
                text="Go Back"
                // Navigates back to previous route in history stack
                onClick={() => {
                  navigate(-1);
                }}
              />
            </div>
          </CustomTooltip>
        </div>
      </div>
    </>
  );
};

export default BookingDetails;
