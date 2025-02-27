import dayjs from "dayjs";
import React from "react";
import { IoIosAirplane } from "react-icons/io";

export default function FlightInfoCard({ className, origin_destination }) {
    return (
        <>
            {origin_destination.length > 0 && origin_destination.map((origin, originIndex) => (
                origin.FlightSegment.map((flight, flightIndex) => (
                    <div key={`${originIndex}-${flightIndex}`} className={`${className} w-full mx-auto flex flex-col gap-5 p-5 bg-white shadow-lg rounded-lg text-text`}>
                        <div>
                            <div className="px-3 py-1 text-sm font-semibold text-white rounded-md bg-primary w-fit">
                                FLIGHT {originIndex + 1}-{flightIndex + 1}
                            </div>
                            <div className="flex justify-between mt-4 text-sm text-gray-500">
                                <div className="text-center">
                                    <p className="font-semibold">DEPARTURE</p>
                                    <p className="text-gray-700">{dayjs(flight.DepartureDate).format('MMM-DD-YYYY')}</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold">ARRIVAL</p>
                                    <p className="text-gray-700">{dayjs(flight.ArrivalDate).format('MMM-DD-YYYY')}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-4 mt-3 border-b border-lightgray">
                                <div className="text-start">
                                    <p className="text-xl font-bold">{flight.DepartureAirport.LocationCode}</p>
                                    <p className="text-gray-600">{flight.DepartureAirport.Terminal}</p>
                                    <p className="font-semibold text-gray-700">{flight.DepartureTime}</p>
                                </div>
                                <div className="flex items-center gap-3 text-primary">
                                    <span className="h-0.5 w-8 bg-primary"></span>
                                    <IoIosAirplane className="text-2xl" />
                                    <span className="h-0.5 w-8 bg-primary"></span>
                                </div>
                                <div className="text-end">
                                    <p className="text-xl font-bold">{flight.ArrivalAirport.LocationCode}</p>
                                    <p className="text-gray-600">{flight.ArrivalAirport.Terminal}</p>
                                    <p className="font-semibold text-gray-700">{flight.ArrivalTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ))}
        </>
    );
}