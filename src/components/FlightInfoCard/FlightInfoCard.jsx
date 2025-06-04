import dayjs from "dayjs";
import { IoIosAirplane } from "react-icons/io";

export default function FlightInfoCard({ className, origin_destination }) {
  return (
    <>
      {/* Ensure we only render if there are flights to display */}
      {origin_destination.length > 0 &&
        origin_destination.map((origin, originIndex) =>
          origin.FlightSegment.map((flight, flightIndex) => (
            <div
              key={`${originIndex}-${flightIndex}`} // Unique key for each flight segment
              className={`${className} w-full mx-auto flex flex-col gap-5 p-5 bg-white shadow-lg rounded-lg text-text`}
            >
              <div>
                {/* Label for flight segment */}
                <div className="px-3 py-1 text-sm font-semibold text-white rounded-md bg-primary w-fit">
                  FLIGHT {originIndex + 1}-{flightIndex + 1}
                </div>

                {/* Departure and Arrival Dates */}
                <div className="flex justify-between mt-4 text-sm text-gray-500">
                  <div className="text-center">
                    <p className="font-semibold">DEPARTURE</p>
                    {/* Format departure date to "MMM-DD-YYYY" */}
                    <p className="text-gray-700">
                      {dayjs(flight.DepartureDate).format("MMM-DD-YYYY")}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">ARRIVAL</p>
                    {/* Format arrival date to "MMM-DD-YYYY" */}
                    <p className="text-gray-700">
                      {dayjs(flight.ArrivalDate).format("MMM-DD-YYYY")}
                    </p>
                  </div>
                </div>

                {/* Flight Route Info */}
                <div className="flex items-center justify-between py-4 mt-3 border-b border-lightgray">
                  {/* Departure airport info */}
                  <div className="text-start">
                    {/* Airport IATA code */}
                    <p className="text-xl font-bold">
                      {flight.DepartureAirport.LocationCode}
                    </p>
                    {/* Terminal name or number */}
                    <p className="text-gray-600">
                      {flight.DepartureAirport.Terminal}
                    </p>
                    {/* Time of departure */}
                    <p className="font-semibold text-gray-700">
                      {flight.DepartureTime}
                    </p>
                  </div>

                  {/* Visual indicator of a flight path using an airplane icon */}
                  <div className="flex items-center gap-3 text-primary">
                    <span className="h-0.5 w-8 bg-primary"></span>
                    <IoIosAirplane className="text-2xl" />
                    <span className="h-0.5 w-8 bg-primary"></span>
                  </div>

                  {/* Arrival airport info */}
                  <div className="text-end">
                    {/* Airport IATA code */}
                    <p className="text-xl font-bold">
                      {flight.ArrivalAirport.LocationCode}
                    </p>
                    {/* Terminal name or number */}
                    <p className="text-gray-600">
                      {flight.ArrivalAirport.Terminal}
                    </p>
                    {/* Time of arrival */}
                    <p className="font-semibold text-gray-700">
                      {flight.ArrivalTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
    </>
  );
}
