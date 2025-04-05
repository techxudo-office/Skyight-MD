import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import {
  Button,
  Tag,
  Table,
  Spinner,
  CustomTooltip,
} from "../../components/components";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosAirplane, IoMdClock } from "react-icons/io";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useDispatch, useSelector } from "react-redux";
import { getBookingDetails } from "../../_core/features/bookingSlice";
import { MdArrowBack } from "react-icons/md";

dayjs.extend(utc); // Extend dayjs with UTC support

const TicketDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { isLoadingBookingDetails, bookingDetails } = useSelector((state) => state.booking);
  const printRef = useRef();

  // const downloadAsPDF = async () => {
  //   const element = printRef.current;
  //   const canvas = await html2canvas(element);
  //   const imgData = canvas.toDataURL("image/png");
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save("download.pdf");
  // };

  useEffect(() => {
    if (location.state) {
      const refId = location.state.id;
      dispatch(getBookingDetails({ id: refId, token: userData?.token }))
        .then((resp) => {
          console.log(resp, "bookingDetails");
        });
    }
  }, [location.state, userData?.token]);

  const now = dayjs.utc();
  const timeLimit = dayjs(bookingDetails?.Timelimit);
  const timelimit = new Date(bookingDetails?.Timelimit);
  const localTimeLimit = timelimit.toLocaleString("en-GB");

  if (isLoadingBookingDetails) {
    return <Spinner className={"text-primary"} />
  }

  return (
    <>
      <Toaster />
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
            {bookingDetails?.flightSegments &&
              bookingDetails.flightSegments.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-5 max-sm:flex-wrap text-text py-5">
                  <div className="flex flex-col items-start">
                    <h2 className="mb-2 text-2xl font-semibold text-primary">
                      Departure
                    </h2>
                    <p className="text-xl font-bold">
                      {item.departure_airport}
                    </p>
                    <p className="flex items-center gap-2">
                      <IoMdClock className="text-lg text-primary" />
                      {dayjs(item.departure_datetime).format(
                        "MMM-DD-YYYY, hh:mm a"
                      )}
                    </p>
                  </div>
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
              {dayjs
                .utc(bookingDetails?.created_at)
                .format("DD MMM YYYY, h:mm a")}
            </div>
            <div>
              <span className="font-semibold">TKT Time Limit: </span>
              {dayjs(bookingDetails?.Timelimit).format("DD MMM YYYY, h:mm a")}
            </div>
          </div>
        </CardLayoutContainer>
        <CardLayoutContainer>
          <CardLayoutHeader className={"mb-2 text-text"} heading="Passenger Details" />

          {bookingDetails && (
            <Table
              pagination={true}
              columnsData={[
                {
                  name: "NAME",
                  selector: (row) => row.given_name,
                  sortable: false,
                  minWidth: "150px",
                  center: true,
                },
                {
                  name: "TYPE",
                  selector: (row) => row.passenger_type_code,
                  sortable: false,
                  minWidth: "150px",
                  center: true,
                },
                {
                  name: "BIRTH DATE",
                  selector: (row) => dayjs(row.birth_date).format("D-MMM-YYYY"),
                  sortable: false,
                  minWidth: "150px",
                  center: true,
                },
                {
                  name: "PASSPORT NUMBER",
                  selector: (row) => row.doc_id,
                  sortable: false,
                  minWidth: "150px",
                  center: true,
                },
                {
                  name: "EXPIRY",
                  selector: (row) =>
                    dayjs(row.expire_date).format("D-MMM-YYYY"),
                  sortable: false,
                  minWidth: "150px",
                  center: true,
                },
                {
                  name: "ISSUANCE",
                  selector: (row) => row.doc_issue_country,
                  sortable: false,
                  minWidth: "150px",
                  center: true,
                },
                {
                  name: "NATIONALITY",
                  selector: (row) => row.nationality,
                  sortable: false,
                  minWidth: "150px",
                  center: true,
                },
              ]}
              tableData={bookingDetails?.passengers || []}
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
          <h2 className="text-xl font-semibold text-text p-5">
            Total Fare: {Number(bookingDetails?.total_fare).toLocaleString()} PKR
          </h2>
        </CardLayoutContainer>

        <div className="flex items-center justify-end gap-3 mb-4">
          <CustomTooltip content={"Previous Page"}>
            <div>
              <Button
                icon={<MdArrowBack />}
                id={"hide-buttons"}
                text="Go Back"
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

export default TicketDetails;