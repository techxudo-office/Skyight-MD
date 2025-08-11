import dayjs from "dayjs";

export const FILTER_OPTIONS = [
    { label: "All time", value: "all-time" },
    { label: "Past Day", value: "day" },
    { label: "Past Week", value: "week" },
    { label: "Past Month", value: "month" },
    { label: "Past Year", value: "year" },
];

export const computeDates = (filter) => {
    if (filter === "all-time") {
        return {
            fromDate: "",
            toDate: "",
        };
    }

    const toDate = dayjs();
    let fromDate;

    switch (filter) {
        case "day":
            fromDate = toDate.subtract(1, "day");
            break;
        case "week":
            fromDate = toDate.subtract(1, "week");
            break;
        case "month":
            fromDate = toDate.subtract(1, "month");
            break;
        case "year":
            fromDate = toDate.subtract(1, "year");
            break;
        default:
            fromDate = toDate;
    }

    return {
        fromDate: fromDate.format("YYYY-MM-DD"),
        toDate: toDate.format("YYYY-MM-DD"),
    };
};