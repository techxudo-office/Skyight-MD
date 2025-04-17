import React from "react";
import {
  FaTimes,
  FaCreditCard,
  FaFileInvoice,
  FaRegCheckCircle,
} from "react-icons/fa";
import { IoMdWallet } from "react-icons/io";
import {
  MdAirplaneTicket,
  MdCreditCard,
  MdCreditScore,
  MdCurrencyExchange,
} from "react-icons/md";

const CreditsDropdown = ({ onClose, credits }) => {
  return (
    <div className="relative p-4 shadow-xl w-72 bg-neutral-100 text-text rounded-2xl">
      {/* Header */}
      <button
        onClick={onClose}
        className="absolute text-gray-500 hover:text-gray-700 top-3 right-3"
      >
        <FaTimes size={18} />
      </button>

      <h2 className="text-sm font-semibold text-center text-gray-700">
        PKR {credits?.Balence.toLocaleString()}
      </h2>

      <p className="text-xs text-gray-500">Net Available Limit</p>

      {/* Status */}
      <div className="flex justify-center mt-2">
        <span className="px-3 py-1 text-greenColor bg-greenbg border-[1px] border-greenColor rounded-lg text-xs font-medium">
          Active
        </span>
      </div>

      {/* Information List */}
      <div className="mt-2 bg-white rounded-2xl">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
          <MdCreditScore className="text-2xl text-gray-600 " />

          <div className="flex flex-col items-start text-sm leading-4">
            <span className="text-xs font-semibold text-gray-900 ">
              PKR {credits?.Balence.toLocaleString()}
            </span>
            <span className="text-[10px] font-light text-gray-700">
              Available Limit
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
          <IoMdWallet className="text-2xl text-gray-600 " />

          <div className="flex flex-col items-start text-sm leading-4">
            <span className="text-xs font-semibold text-gray-900 ">
              PKR -{credits?.Balence.toLocaleString()}
            </span>
            <span className="text-[10px] font-light text-gray-700">
              Total Payable Amount
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
          <MdCreditCard className="text-2xl text-gray-600 " />

          <div className="flex flex-col items-start text-sm leading-4">
            <span className="text-xs font-semibold text-gray-900">PKR 1</span>
            <span className="text-[10px] font-light text-gray-700">
              Permenent Credit Limit
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
          <MdCurrencyExchange className="text-2xl text-gray-600 " />

          <div className="flex flex-col items-start text-sm leading-4">
            <span className="text-xs font-semibold text-gray-900 ">PKR 0</span>
            <span className="text-[10px] font-light text-gray-700">
              Temporary Credits Limit
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 ">
          <MdAirplaneTicket className="text-2xl text-gray-600 " />

          <div className="flex flex-col items-start text-sm leading-4">
            <span className="text-xs font-semibold text-gray-900 ">
              PKR {credits?.Balence.toLocaleString()}
            </span>
            <span className="text-[10px] font-light text-gray-700">
              Total not Invoiced Ticket
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsDropdown;
