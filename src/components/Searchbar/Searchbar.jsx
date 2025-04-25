import React, { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";

const Searchbar = ({
  placeholder,
  data = [],
  onFilteredData,
  className,
  searchFields = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to get nested property value
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => {
      return acc && acc[part];
    }, obj);
  };

  // Updated search function to handle nested fields
  const searchObjects = (data, searchTerm, fields) => {
    if (!searchTerm || searchTerm.trim() === "") {
      return data;
    }

    const term = searchTerm.toString().toLowerCase();

    return data.filter((item) => {
      // If no specific fields are provided, search all fields (including nested ones)
      if (fields.length === 0) {
        return JSON.stringify(item).toLowerCase().includes(term);
      }

      return fields.some((field) => {
        const value = getNestedValue(item, field);
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(term);
      });
    });
  };

  useEffect(() => {
    const filteredData = searchObjects(data, searchTerm, searchFields);
    onFilteredData && onFilteredData(filteredData);
  }, [searchTerm, data, searchFields]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div
      className={`relative flex items-center border border-gray text-text rounded-md my-3 w-full ${className}`}
    >
      <input
        type="text"
        className="w-full p-4 rounded-md outline-none"
        placeholder={
          placeholder ||
          `Search ${searchFields
            .map((field) => field.charAt(0).toUpperCase() + field.slice(1))
            .join(", ")
            .replaceAll("_", " ")
            .replaceAll(".", " ")}`
        }
        value={searchTerm}
        onChange={handleInputChange}
      />
      {searchTerm && (
        <button
          className="absolute right-3 text-text hover:text-gray-700"
          onClick={handleClear}
        >
          <MdCancel size={20} />
        </button>
      )}
    </div>
  );
};

export default Searchbar;
