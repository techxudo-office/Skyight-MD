import  { useState, useEffect, useCallback } from "react";
import { MdCancel } from "react-icons/md";

const Searchbar = ({
  placeholder,
  data = [],
  onFilteredData,
  className,
  searchFields = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized helper function
  const getNestedValue = useCallback((obj, path) => {
    return path.split('.').reduce((acc, part) => {
      return acc && acc[part];
    }, obj);
  }, []);

  // Optimized search function
  const searchObjects = useCallback((data, term, fields) => {
    if (!term || term.trim() === '') return data;

    const lowerTerm = term.toLowerCase();

    return data.filter(item => {
      if (fields.length === 0) {
        return JSON.stringify(item).toLowerCase().includes(lowerTerm);
      }
      return fields.some(field => {
        const value = getNestedValue(item, field);
        return value?.toString().toLowerCase().includes(lowerTerm);
      });
    });
  }, [getNestedValue]);

  useEffect(() => {
    const filteredData = searchObjects(data, searchTerm, searchFields);
    onFilteredData?.((prev) => {
      // Prevent infinite loop by checking if result actually changed
      const prevStr = JSON.stringify(prev);
      const newStr = JSON.stringify(filteredData);
      return prevStr !== newStr ? filteredData : prev;
    });

  }, [searchTerm, data, searchFields, onFilteredData]);


  const handleClear = () => {
    setSearchTerm("");
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      className={`relative flex items-center border border-gray text-text rounded-md my-3 w-full ${className}`}
    >
      <input
        type="text"
        className="w-full p-4 outline-none rounded-md"
        placeholder={placeholder || `Search ${searchFields.map((field) =>
          field.charAt(0).toUpperCase() + field.slice(1)
        ).join(", ").replaceAll(/[_\.]/g, " ")}`}
        value={searchTerm}
        onChange={handleChange}  // Fixed handler
      />
      {searchTerm && (
        <button
          className="absolute right-3 text-text hover:text-gray-700"
          onClick={handleClear}
          type="button"  // Important for buttons in forms
        >
          <MdCancel size={20} />
        </button>
      )}
    </div>
  );
};

export default Searchbar;
