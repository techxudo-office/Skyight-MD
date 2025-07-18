import { useState, useEffect, useCallback } from "react";
import { MdCancel } from "react-icons/md";

const Searchbar = ({
  placeholder,
  data = [],
  onFilteredData,
  className,
  searchFields = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized utility to safely access nested object properties using a dot-separated string path
  const getNestedValue = useCallback((obj, path) => {
    return path.split(".").reduce((acc, part) => {
      return acc && acc[part];
    }, obj);
  }, []);

  // Memoized search function that filters objects based on nested fields and search term
  const searchObjects = useCallback(
    (data, term, fields) => {
      if (!term || term.trim() === "") return data;

      const lowerTerm = term.toLowerCase();

      return data.filter((item) => {
        if (fields.length === 0) {
          // If no specific fields are defined, search entire object as JSON string
          return JSON.stringify(item).toLowerCase().includes(lowerTerm);
        }

        // Search only in defined fields (including nested ones)
        return fields.some((field) => {
          const value = getNestedValue(item, field);
          return value?.toString().toLowerCase().includes(lowerTerm);
        });
      });
    },
    [getNestedValue]
  );

  useEffect(() => {
    const filteredData = searchObjects(data, searchTerm, searchFields);

    // Only update parent state if filtered data actually changed
    onFilteredData?.((prev) => {
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
        className="w-full p-4 rounded-md outline-none"
        placeholder={
          placeholder ||
          `Search ${searchFields
            .map((field) => field.charAt(0).toUpperCase() + field.slice(1))
            .join(", ")
            .replaceAll(/[_\.]/g, " ")}`
        } // Auto-generates placeholder from search fields
        value={searchTerm}
        onChange={handleChange} // Controlled input
      />
      {searchTerm && (
        <button
          className="absolute right-3 text-text hover:text-gray-700"
          onClick={handleClear}
          type="button" // Prevents accidental form submission
        >
          <MdCancel size={20} />
        </button>
      )}
    </div>
  );
};

export default Searchbar;
