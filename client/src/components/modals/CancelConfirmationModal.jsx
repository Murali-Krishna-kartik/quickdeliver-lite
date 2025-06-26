import { Dialog } from "@headlessui/react";

const CancelConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">
            Confirm Cancellation
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 mb-6">
            Are you sure you want to cancel this delivery? This action cannot be undone.
          </Dialog.Description>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              No, Keep It
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Yes, Cancel Delivery
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CancelConfirmationModal;