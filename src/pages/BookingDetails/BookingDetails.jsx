import React, { useEffect, useState } from "react";
import { FaPlane, FaUser, FaSuitcase, FaMoneyBillAlt } from "react-icons/fa";
import {
  CardLayoutContainer,
  CardLayoutHeader,
  CardLayoutBody,
  CardLayoutFooter,
} from "../../components/CardLayout/CardLayout";
import { Button, Spinner } from "../../components/components";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { getBookingDetails } from "../../utils/api_handler";

const TicketDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

    // const [ticketData, setTicketData] = useState([]);

    // const getBookingDetailsHandler = async (id) => {
    //   const response = await getBookingDetails(id);
    //   if (response.status) {
    //     setTicketData(response.data);
    //   }
    // };

    // useEffect(() => {
    //   if (location.state) {
    //     const refId = location.state;
    //     getBookingDetailsHandler(refId);
    //   }
    // }, []);

  const ticketData = {
    AirReservation: {
      AirItinerary: {
        OriginDestinationOptions: [
          {
            FlightSegment: [
              {
                FlightDuration: "01:30",
                DepartureAirport: {
                  LocationCode: "THR",
                  Terminal: "Tehran",
                },
                ArrivalAirport: {
                  LocationCode: "TBZ",
                  Terminal: "Tabriz",
                },
                OperatingAirline: {
                  Code: "B9",
                },
                Equipment: {
                  AirEquipType: "320",
                },
                MarketingAirline: {
                  Code: "B9",
                },
                BookingClassAvails: [
                  {
                    ResBookDesigCode: "H1",
                    ResBookDesigQuantity: 0,
                    RPH: "191053",
                    AvailablePTC: null,
                    ResBookDesigCabinCode: "Y",
                    FareBasis: null,
                  },
                ],
                DepartureDateTime: "2025-01-02 14:00",
                ArrivalDateTime: "2025-01-02 15:30",
                DepartureDate: "2025-01-02",
                DepartureTime: "14:00",
                ArrivalDate: "2025-01-02",
                ArrivalTime: "15:30",
                FlightNumber: "5555",
                ResBookDesigCode: "H1",
                RPH: "191053",
                FreeBaggages: null,
              },
            ],
            RefNumber: "191053",
            DirectionId: 0,
            ElapsedTime: 0,
            CabinClass: "Y",
          },
        ],
        OriginDestinationCombinations: null,
      },
      PriceInfo: {
        ItinTotalFare: {
          BaseFare: {
            Amount: 2612613,
            CurrencyCode: null,
            DecimalPlaces: 0,
          },
          TotalFare: {
            Amount: 3000000,
            CurrencyCode: null,
            DecimalPlaces: 0,
          },
          TotalEquivFare: {
            Amount: 3000000,
            CurrencyCode: null,
            DecimalPlaces: 0,
          },
        },
        PTC_FareBreakDowns: [
          {
            PassengerTypeQuantity: {
              Code: "ADL",
              Quantity: 1,
            },
            FareBasisCode: null,
            PassengerFare: {
              BaseFare: {
                Amount: 2612613,
                CurrencyCode: null,
                DecimalPlaces: 0,
              },
              MarkupFare: null,
              Taxes: {
                Tax: [
                  { Name: "LP", Amount: 70000 },
                  { Name: "KU", Amount: 26126 },
                  { Name: "I6", Amount: 30000 },
                  { Name: "VT", Amount: 261261 },
                ],
              },
              Fees: null,
              TotalFare: {
                Amount: 3000000,
                CurrencyCode: null,
                DecimalPlaces: 0,
              },
            },
            TravelerRefNumber: null,
            PricingSource: null,
          },
        ],
      },
      TravelerInfo: [
        {
          TravelerNumber: "1",
          PersonName: {
            GivenName: "OFFICE",
            MiddleName: null,
            Surname: "TECHXUDO",
            NameTitle: "MR",
            PersianGivenName: null,
            PersianMiddleName: null,
            PersianSurname: null,
          },
          Telephone: null,
          ContactInfo: null,
          Document: {
            DocType: "N",
            DocID: "5430066131",
            DocIssueCountry: null,
            ExpireDate: null,
            Nationality: null,
          },
          TravelerRefNumber: null,
          BirthDate: null,
          PassengerTypeCode: "ADL",
          Gender: null,
          ETicketInfos: [
            {
              CouponNo: 1,
              ETicketNo: "4911000548397",
              FlightSegmentCode: "THRTBZ",
              FlightSegmentRPH: "191053",
              Status: "2",
              UsedStatus: "OK",
              TicketStatus: "1",
              TicketStatusDescription: "Ticket",
              TicketSegmentStatus: "O",
              TicketSegmentStatusDescription: "Open For Use",
              RefundedAmount: 0,
              Penalty: 0,
              PenaltyPercent: 0,
            },
          ],
        },
      ],
      Ticketing: null,
      bookingReferenceID: {
        Id: "QW8TM",
        Type: 0,
        Timelimit: null,
      },
    },
    Message: null,
    Success: true,
    Error: null,
    PrimaryLangID: null,
    SequenceNmbr: 0,
    TransactionIdentifier: null,
    Version: 0,
    PriceChange: null,
  };

  const flightSegment =
    ticketData?.AirReservation?.AirItinerary?.OriginDestinationOptions?.[0]
      ?.FlightSegment?.[0];

  if (!flightSegment) {
    return <Spinner className="text-primary" />;
  }

  const {
    PriceInfo: { ItinTotalFare, PTC_FareBreakDowns },
    TravelerInfo,
    bookingReferenceID,
  } = ticketData.AirReservation;

  const renderPassengerDetails = () =>
    PTC_FareBreakDowns.map((passenger, index) => (
      <div
        key={index}
        className="flex flex-wrap gap-3 py-3 border-b border-slate-200 items-center justify-between"
      >
        <h2 className="text-sm font-semibold text-slate-600 flex items-center gap-1">
          <FaUser className="text-primary" />
          {passenger.PassengerTypeQuantity.Quantity}{" "}
          {passenger.PassengerTypeQuantity.Code}
        </h2>
        <h2 className="text-sm font-semibold text-slate-500 flex items-center gap-1">
          <FaMoneyBillAlt className="text-primary" />
          Base Fare: {passenger.PassengerFare.BaseFare.Amount}
        </h2>
        <h2 className="text-sm font-semibold text-slate-500 flex items-center gap-1">
          <FaMoneyBillAlt className="text-primary" />
          Taxes:{" "}
          {passenger.PassengerFare.Taxes.Tax.reduce(
            (total, tax) => total + tax.Amount,
            0
          )}
        </h2>
      </div>
    ));

  const renderTravelerInfo = () =>
    TravelerInfo.map((traveler, index) => (
      <div
        key={index}
        className="flex flex-wrap gap-3 py-3 border-b border-slate-200 items-center justify-between"
      >
        <h2 className="text-sm font-semibold text-slate-600 flex items-center gap-1">
          <FaUser className="text-primary" />
          {traveler.PersonName.NameTitle} {traveler.PersonName.GivenName}{" "}
          {traveler.PersonName.Surname}
        </h2>
        <h2 className="text-sm font-semibold text-slate-500">
          Passport: {traveler.Document.DocID || "N/A"}
        </h2>
        <h2 className="text-sm font-semibold text-slate-500">
          E-Ticket No: {traveler.ETicketInfos[0]?.ETicketNo || "Not Available"}
        </h2>
      </div>
    ));

  return (
    <>
      <Toaster />
      <div className="w-full flex flex-col gap-5">
        <CardLayoutContainer>
          <CardLayoutHeader
            heading={`Booking Reference: ${bookingReferenceID.Id}`}
          />
          <CardLayoutBody>
            <div className="flex items-center justify-between flex-wrap gap-5">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-2">
                  Departure
                </h2>
                <p>
                  {flightSegment.DepartureAirport.Terminal} (
                  {flightSegment.DepartureAirport.LocationCode})
                </p>
                <p>{flightSegment.DepartureDateTime}</p>
              </div>
              <FaPlane className="text-primary text-2xl" />
              <div>
                <h2 className="text-xl font-semibold text-primary mb-2">
                  Arrival
                </h2>
                <p>
                  {flightSegment.ArrivalAirport.Terminal} (
                  {flightSegment.ArrivalAirport.LocationCode})
                </p>
                <p>{flightSegment.ArrivalDateTime}</p>
              </div>
            </div>
          </CardLayoutBody>
        </CardLayoutContainer>

        <CardLayoutContainer>
          <CardLayoutHeader heading="Pricing Details" />
          <CardLayoutBody>{renderPassengerDetails()}</CardLayoutBody>
          <CardLayoutFooter>
            <h2 className="text-xl font-semibold text-slate-600">
              Total Fare: {ItinTotalFare.TotalFare.Amount}
            </h2>
          </CardLayoutFooter>
        </CardLayoutContainer>

        <CardLayoutContainer>
          <CardLayoutHeader heading="Traveler Information" />
          <CardLayoutBody>{renderTravelerInfo()}</CardLayoutBody>
        </CardLayoutContainer>

        <div className="flex items-center justify-end gap-3">
          <div>
            <Button
              text="Go Back"
              onClick={() => {navigate(-1)}}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketDetails;
