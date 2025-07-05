import { utils, writeFile } from "xlsx"; // Utilities to create sheets and export files
import { SiGooglesheets } from "react-icons/si";
import SecondaryButton  from "../../components/SecondaryBtn/SecondaryBtn";

const ExcelExportButton = ({
  data, // Array of objects to be exported to Excel
  fileName = "export", // Base name for the exported file
  buttonText = "Export", // Text to display on the export button
  buttonProps = {}, // Additional props to pass to the button (e.g., styles, disabled)
  excludeKeys = [], // Keys to exclude from export (e.g., internal IDs, metadata)
  className = "", // Optional CSS class for styling the button
}) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      console.warn("No data to export"); // Guard clause to handle empty or undefined data
      return;
    }

    // Filter out excluded keys and serialize objects (e.g., nested data)
    const exportData = data.map((item) => {
      const row = {};

      Object.keys(item).forEach((key) => {
        if (!excludeKeys.includes(key)) {
          const value = item[key];
          // Convert objects to JSON strings to prevent Excel format issues
          row[key] = typeof value === "object" ? JSON.stringify(value) : value;
        }
      });

      return row;
    });

    // Convert JSON data to worksheet
    const ws = utils.json_to_sheet(exportData);
    // Create a new workbook
    const wb = utils.book_new();
    // Append the worksheet to the workbook
    utils.book_append_sheet(wb, ws, "Sheet1");

    // Append current date to filename (e.g., export_2025-06-04.xlsx)
    const formattedFileName = `${fileName}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Export the Excel file
    writeFile(wb, formattedFileName);
  };

  return (
    <div className="flex items-center justify-end w-full">
      <SecondaryButton
        className={className}
        text={buttonText} // Set button label
        onClick={handleExport} // Trigger export on click
        {...buttonProps} // Spread any extra props (like disabled, loading)
        icon={<SiGooglesheets />} // Display icon inside button
      />
    </div>
  );
};

export default ExcelExportButton;
