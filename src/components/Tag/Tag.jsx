import React from "react";

const statusClasses = {
  booked: "text-yellowColor border-yellowColor bg-yellowbg",
  "in-progress": "text-yellowColor border-yellowColor bg-yellowbg",
  pending: "text-yellowColor border-yellowColor bg-yellowbg",
  "requested-cancellation": "text-redColor border-redColor bg-redbg",
  cancelled: "text-redColor border-redColor bg-redbg",
  expired: "text-redColor border-redColor bg-redbg",
  "requested-refund": "text-blueColor border-blueColor bg-bluebg",
  Refunded: "text-blueColor border-blueColor bg-bluebg",
  rejected: "text-redColor border-redColor bg-redbg",
  inactive: "text-redColor border-redColor bg-redbg",
  closed: "text-redColor border-redColor bg-redbg",
};

export default function Tag({ value }) {
  const defaultClass = "text-greenColor bg-greenbg border-greenColor";

  return (
    <p
      className={` text-center text-sm w-full  mx-auto border-[1px] tracking-tight px-2 py-1 rounded-lg 
        ${statusClasses[value] || defaultClass} font-semibold capitalize`}
    >
      {value}
    </p>
  );
}
