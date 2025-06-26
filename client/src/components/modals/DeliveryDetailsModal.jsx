import { Dialog } from "@headlessui/react";
import { getStatusColor } from "../utils/deliveryUtils";
import { useState } from "react";
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

const DeliveryDetailsModal = ({
  isOpen,
  onClose,
  delivery,
  onCancelClick,
  onSubmitFeedback
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!delivery) return null;

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (rating === 0) {
      setSubmitError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitFeedback(delivery._id, { rating, comment });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose(); // Optionally close the modal after success
      }, 1500);
    } catch (error) {
      setSubmitError(error.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmitFeedback = 
    delivery.status === "Completed" && 
    !delivery.feedback &&
    !submitSuccess;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg my-8">
          <div className="space-y-4">
            <div className="flex justify-between items-start sticky top-0 bg-white py-2 z-10">
              <Dialog.Title className="text-2xl font-bold text-gray-800">
                Delivery Details
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              <div>
                <div className="mb-4">
                  <img
                    src={
                      delivery.itemImage
                        ? `http://localhost:5000/uploads/deliveries/${delivery.itemImage}`
                        : "/default-box.png"
                    }
                    alt="Item"
                    className="rounded-lg w-full h-48 object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        delivery.status
                      )}`}
                    >
                      {delivery.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Delivery ID:</span>
                    <span className="font-mono text-sm">{delivery._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Created:</span>
                    <span>
                      {new Date(delivery.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {delivery.completedAt && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Completed:</span>
                      <span>
                        {new Date(delivery.completedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Package Details
                  </h3>
                  <p>
                    <strong>Note:</strong>{" "}
                    {delivery.packageNote || "No note provided"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Pickup Location
                  </h3>
                  <p className="whitespace-pre-line">{delivery.pickupAddress}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Dropoff Location
                  </h3>
                  <p className="whitespace-pre-line">{delivery.dropoffAddress}</p>
                </div>

                {delivery.acceptedBy && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Driver Information
                    </h3>
                    <p>
                      <strong>Name:</strong>{" "}
                      {delivery.acceptedBy.name}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {delivery.acceptedBy.email}
                    </p>
                    <p>
                      <strong>Accepted At:</strong>{" "}
                      {delivery.acceptedAt
                        ? new Date(
                            delivery.acceptedAt
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                )}

                {/* Feedback Section */}
                {delivery.status === "Completed" && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-lg mb-2">
                      Delivery Feedback
                    </h3>
                    {delivery.feedback || submitSuccess ? (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        {submitSuccess ? (
                          <div className="flex items-center text-green-600 mb-2">
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <span>Thank you for your feedback!</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center mb-1">
                              <span className="font-medium mr-2">Rating:</span>
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${i < (delivery.feedback?.rating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            {(delivery.feedback?.comment || comment) && (
                              <div>
                                <span className="font-medium">Comment:</span>
                                <p className="mt-1 text-gray-600 whitespace-pre-line">
                                  {delivery.feedback?.comment || comment}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                        {delivery.feedback?.createdAt && (
                          <p className="text-sm text-gray-500 mt-2">
                            Submitted on {new Date(delivery.feedback.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitFeedback}>
                        <div className="mb-3">
                          <label className="block font-medium mb-1">
                            Rating (required)
                          </label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                                disabled={isSubmitting}
                              >
                                <svg
                                  className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${isSubmitting ? 'opacity-50' : ''}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="block font-medium mb-1">
                            Comment (optional)
                          </label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={200}
                            rows={3}
                            className={`w-full px-3 py-2 border ${submitError ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'bg-gray-50' : ''}`}
                            placeholder="Share your experience (max 200 characters)"
                            disabled={isSubmitting}
                          />
                          <p className="text-xs text-gray-500 text-right">
                            {comment.length}/200
                          </p>
                        </div>
                        
                        {submitError && (
                          <div className="flex items-center text-red-500 text-sm mb-3">
                            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                            <span>{submitError}</span>
                          </div>
                        )}
                        
                        <button
                          type="submit"
                          disabled={!canSubmitFeedback || isSubmitting}
                          className={`px-4 py-2 rounded-md text-white flex items-center justify-center ${
                            canSubmitFeedback && !isSubmitting
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-gray-400 cursor-not-allowed'
                          } transition min-w-[150px]`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            'Submit Feedback'
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
            

            <div className="pt-4 flex justify-end space-x-3 border-t sticky bottom-0 bg-white py-4">
              {delivery.status === "Pending" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelClick(delivery._id);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel Delivery
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                disabled={isSubmitting}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeliveryDetailsModal;
