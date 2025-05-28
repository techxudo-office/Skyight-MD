import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { skyightLogo } from "../../assets/Index";
import { IoIosAirplane } from "react-icons/io";
import { BsFillSuitcaseFill } from "react-icons/bs";
import { GiMeal } from "react-icons/gi";
import { GoDownload } from "react-icons/go";

const DownloadButton = () => {
  const printRef = useRef();
  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) {
      return;
    } else {
      const canvas = await html2canvas(element, {
        scale: 2,
      });
      const data = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });
      const imageProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight =
        (imageProperties.height * pdfWidth) / imageProperties.width;
      // const pdfHeight = pdf.internal.pageSize.getHeight()
      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("ETicket.pdf");
    }
  };

  const passengers = [
    {
      title: "MR",
      firstName: "MUHAMMAD NAUMAN",
      lastName: "TASHFEEN",
      type: "ADT",
      birthDate: "Feb 01, 1980",
      nationalID: "3210274304327",
      passport: "-",
      ticket: "2470791785",
    },
    {
      title: "MRS",
      firstName: "AYSHA HAMEED",
      lastName: "GHAURI",
      type: "ADT",
      birthDate: "Apr 10, 1987",
      nationalID: "3210244014434",
      passport: "-",
      ticket: "2470791785",
    },
    {
      title: "MS",
      firstName: "AYRA",
      lastName: "TASHFEEN",
      type: "CNN",
      birthDate: "Apr 09, 2015",
      nationalID: "3210244014434",
      passport: "-",
      ticket: "2470791786",
    },
    {
      title: "MS",
      firstName: "MAHASIN",
      lastName: "TASHFEEN",
      type: "CNN",
      birthDate: "Sep 23, 2021",
      nationalID: "3210244014434",
      passport: "-",
      ticket: "2470791786",
    },
  ];
  return (
    <>
      <div
        ref={printRef}
        className="absolute -left-[999px] mx-auto bg-white shadow-lg text-text rounded-md p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-10 pb-2 text-lg font-bold text-center">
          <img src={skyightLogo} className="w-24" alt="" />
          E-Ticket Receipt & Itinerary
        </div>

        {/* Airline Info */}
        <div className="flex items-center justify-between py-4 border-t border-b border-gray px-9">
          <div className="flex items-center space-x-2">
            {/* <img src="/pia-logo.svg" alt="PIA Logo" className="h-10" /> */}
            <span className="text-lg font-bold">PIA</span>
          </div>
          <div className="font-mono text-2xl font-bold leading-5 text-primary text-end">
            <p className="text-gray text-[11px] font-normal">
              Booking Reference PNR:
            </p>
            95UH6
          </div>
        </div>

        {/* Booking & Flight Details */}
        <div className="grid grid-cols-3 gap-2 p-2 text-sm uppercase bg-gray-100 rounded-md">
          <div className="flex flex-col justify-between h-20 p-2 py-4 text-sm rounded-lg bg-bluebg">
            <p className="text-xs font-semibold">Agency</p>
            <p className="text-sm font-semibold">
              C&M TRAVEL & TOURISM(PVT)LTD
            </p>
          </div>
          <div className="flex flex-col justify-between h-20 p-2 py-4 text-sm rounded-lg bg-bluebg">
            <p className="text-xs font-semibold">PNR Number</p>
            <p className="font-semibold">95UH6</p>
          </div>
          <div className="flex flex-col justify-between h-20 p-2 py-4 text-sm rounded-lg bg-bluebg">
            <p className="text-xs font-semibold">AIRLINE</p>
            <p className="font-semibold">95UH6</p>
          </div>
          <div className="flex flex-col justify-between h-20 p-2 py-4 text-sm rounded-lg bg-bluebg">
            <p className="text-xs font-semibold">Booking Date</p>
            <p className="font-semibold">PIA / PK</p>
          </div>
          <div className="flex flex-col justify-between h-20 p-2 py-4 text-sm rounded-lg bg-bluebg">
            <p className="text-xs font-semibold">Status</p>
            <p className="font-semibold">TICKET ISSUED</p>
          </div>
        </div>

        {/* Flight Details */}
        <div className="p-2 mt-4 font-semibold text-white bg-primary rounded-t-md">
          FLIGHT DETAILS
        </div>
        <div className="p-3 py-5 border-gray">
          <p className="font-bold">Karachi [KHI] → Multan [MUX]</p>
          <p className="pb-4">Fri, Mar 28, 2025</p>
          <div className="flex items-center justify-between pt-3 border-t border-lightgray">
            <div className="flex items-center mt-2 space-x-2">
              {/* <img src="/pia-plane.svg" alt="Flight Icon" className="h-5" /> */}
              <p className="font-semibold">Pakistan International Airlines</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="text-center">
                <p className="font-semibold leading-4 text-text">13:30</p>
                <p className="font-semibold text-gray">KHI</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <p className="font-semibold text-primary">2 hrs 10 mins</p>
                <div className="flex items-center gap-2">
                  <span className="h-0.5 w-8 bg-primary"></span>
                  <IoIosAirplane className="text-2xl text-primary" />
                  <span className="h-0.5 w-8 bg-primary"></span>
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold leading-4 text-text">15:40</p>
                <p className="font-semibold text-gray">ISB</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Flight Time: 1 Hour 25 minutes | PK-330
            </p>
          </div>
          <div className="flex items-center gap-3 p-2 mt-3 text-sm font-semibold border-l-4 text-gray bg-bluebg border-primary ">
            <p className="flex items-center gap-3">
              <BsFillSuitcaseFill className="text-lg text-text" />
              Baggage Allowance: Total 20.0 KG (As per airline policy){" "}
            </p>
            <p className="flex items-center gap-3 px-4 border-l border-r border-lightgray">
              {" "}
              <GiMeal className="text-xl text-text" /> Meal Included{" "}
            </p>
            <p>ECONOMY</p>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="p-3 mt-8 font-semibold text-white bg-primary rounded-t-md">
          PASSENGER DETAILS
        </div>
        <div className="p-2 py-3 bg-bluebg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-lightgray">
                <th className="p-2">Title</th>
                <th className="p-2">First Name</th>
                <th className="p-2">Last Name</th>
                <th className="p-2">Passenger Type</th>
                <th className="p-2">Birth Date</th>
                <th className="p-2">National ID</th>
                <th className="p-2">Passport</th>
                <th className="p-2">Ticket Number</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, index) => (
                <tr
                  key={index}
                  className="text-center border-b border-lightgray"
                >
                  <td className="p-2">{passenger.title}</td>
                  <td className="p-2">{passenger.firstName}</td>
                  <td className="p-2">{passenger.lastName}</td>
                  <td className="p-2">{passenger.type}</td>
                  <td className="p-2">{passenger.birthDate}</td>
                  <td className="p-2">{passenger.nationalID}</td>
                  <td className="p-2">{passenger.passport}</td>
                  <td className="p-2">{passenger.ticket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        className="p-2 border rounded-full hover:bg-slate-200 bg-bluebg border-primary text-primary "
        onClick={handleDownloadPdf}
      >
        <GoDownload className="text-lg" />
      </button>
    </>
  );
};

export default DownloadButton;
