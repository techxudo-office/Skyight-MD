import React from 'react';

const DeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Confirm Delete</h2>
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this bank?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;