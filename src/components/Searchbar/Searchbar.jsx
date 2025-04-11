import React, { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";

const Searchbar = ({ 
  placeholder = "Search",
  data = [],
  onFilteredData,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Your search function (unchanged)
  const searchObjects = (data, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return data;
    }

    const term = searchTerm.toString().toLowerCase();
    
    return data.filter(item => {
      return Object.values(item).some(value => {
        if (value === null || value === undefined) {
          return false;
        }
        return value.toString().toLowerCase().includes(term);
      });
    });
  };

  // Call this effect whenever search term or data changes
  useEffect(() => {
    const filteredData = searchObjects(data, searchTerm);
    onFilteredData && onFilteredData(filteredData);
  }, [searchTerm, data]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className={`relative flex items-center border border-gray text-text rounded-md my-3 w-full ${className}`}>
      <input
        type="text"
        className="w-full p-4 outline-none rounded-md"
        placeholder={placeholder}
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