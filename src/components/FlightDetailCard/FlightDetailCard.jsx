import { useMemo, useState } from "react";
import { FaPlaneDeparture, FaChevronUp } from "react-icons/fa";
import { IoIosAirplane } from "react-icons/io";
import { CardLayoutContainer } from "../CardLayout/CardLayout";
import { GoDotFill } from "react-icons/go";
import dayjs from "dayjs";

const FlightDetailCard = ({ flights }) => {
  const [isOpen, setIsOpen] = useState(false); // Controls dropdown visibility
  const [flightSegments, setFlightSegments] = useState([]); // Stores list of flight segments

  // Memoize flight segment extraction when `flights` changes
  useMemo(() => {
    if (flights) {
      setFlightSegments(
        flights.AirItinerary.OriginDestinationOptions[0].FlightSegment
      );
    }
  }, [flights]);

  return (
    <CardLayoutContainer className={"p-5 flightdetailpdf"}>
      <h2 className="mb-3 text-xl font-semibold text-text">Flight Details</h2>

      {/* Loop through each flight segment */}
      {flightSegments.map((flight, index) => {
        return (
          <>
            {/* Summary section for each flight */}
            <div className="flex items-center justify-between p-4 rounded-lg">
              <div className="flex gap-3">
                <FaPlaneDeparture className="mt-1 text-lg text-primary" />
                <div>
                  <p className="font-semibold text-gray-700 text-text">
                    Flight {index + 1}
                  </p>
                  <p className="text-sm text-gray-500 text-gray">
                    {/* Format the departure date nicely */}
                    {dayjs(flight.DepartureDate).format("dddd, MMMM-DD-YYYY")}
                  </p>
                </div>
              </div>

              {/* Airline Info */}
              <div className="text-center">
                <p className="text-base font-semibold text-gray-600 text-text">
                  Airblue
                </p>
                <p className="text-sm font-semibold text-gray">
                  {/* Display airline code and flight number */}
                  {flight.OperatingAirline.Code}-{flight.FlightNumber}
                </p>
              </div>

              {/* Time and route display */}
              <div className="flex items-center gap-9">
                {/* Departure info */}
                <div className="text-center">
                  <p className="text-lg font-semibold leading-5 text-text">
                    {flight.DepartureTime}
                  </p>
                  <p className="text-xs font-semibold text-gray">
                    {flight.DepartureAirport.LocationCode}
                  </p>
                </div>

                {/* Flight duration visual with airplane icon */}
                <div className="flex flex-col items-center text-center">
                  <p className="text-lg font-semibold text-primary">
                    {flight.FlightDuration.split(":")[0]}hrs:
                    {flight.FlightDuration.split(":")[1]}mins
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="h-0.5 w-8 bg-primary"></span>
                    <IoIosAirplane className="text-2xl text-primary" />
                    <span className="h-0.5 w-8 bg-primary"></span>
                  </div>
                </div>

                {/* Arrival info */}
                <div className="text-center">
                  <p className="text-lg font-semibold leading-5 text-text">
                    {flight.ArrivalTime}
                  </p>
                  <p className="text-xs font-semibold text-gray">
                    {flight.ArrivalAirport.LocationCode}
                  </p>
                </div>
              </div>

              {/* Dropdown toggle button */}
              <button
                onClick={() => setIsOpen(!isOpen)} // Toggle dropdown
                className={`text-gray-500 ${
                  isOpen ? "" : "rotate-180"
                } transition-all duration-300 bg-primary text-white rounded-full p-[5px]`}
              >
                <FaChevronUp size={18} />
              </button>
            </div>

            {/* Dropdown Details */}
            <div
              className={`${
                isOpen ? "h-auto py-6" : "h-0 overflow-hidden"
              }  mt-4  rounded-lg px-6 bg-gray-50 text-text transition-all duration-500`}
            >
              {/* Redundant date section */}
              <p className="p-3 mb-4 font-semibold bg-greenbg ">
                {dayjs(flight.DepartureDate).format("dddd, MMMM-DD-YYYY")}
              </p>

              <div className="flex items-center gap-4">
                {/* Timeline visual with dots and duration */}
                <div className="text-center">
                  <p className="font-semibold">{flight.DepartureTime}</p>
                  <div className="flex flex-col items-center justify-center">
                    <GoDotFill className="text-lg translate-y-2 text-primary" />
                    <div className="w-1 h-20 mx-auto rounded-full bg-primary"></div>
                    <GoDotFill className="text-lg -translate-y-2 text-primary " />
                  </div>
                  <p className="font-semibold">{flight.ArrivalTime}</p>
                </div>

                {/* Airport and terminal info */}
                <div>
                  <p className="font-semibold text-gray-700">
                    {flight.DepartureAirport.Terminal}{" "}
                    <span className="text-gray-500">
                      / {flight.DepartureAirport.Terminal} International Airport
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {/* Remove leading zero from hour/minutes */}
                    {flight.FlightDuration.split(":")[0].replace(0, "")}hrs :{" "}
                    {flight.FlightDuration.split(":")[1].replace(0, "")}mins
                  </p>

                  <p className="mt-4 font-semibold text-gray-700">
                    {flight.ArrivalAirport.Terminal}
                    <span className="text-gray-500">
                      / {flight.ArrivalAirport.Terminal} International Airport
                    </span>
                  </p>
                </div>

                {/* Airline details in the dropdown */}
                <div className="ml-auto text-right">
                  <p className="text-base font-semibold">Airblue</p>
                  <p className="text-sm font-semibold text-gray">
                    {flight.OperatingAirline.Code}-{flight.FlightNumber}
                  </p>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </CardLayoutContainer>
  );
};

export default FlightDetailCard;
