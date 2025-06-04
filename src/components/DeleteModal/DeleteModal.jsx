const DeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Confirm Delete</h2>
        <p className="mb-6 text-sm text-gray-600">Are you sure you want to delete this bank?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
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