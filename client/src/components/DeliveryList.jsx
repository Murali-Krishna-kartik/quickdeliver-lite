import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import DeliveryDetailsModal from "./modals/DeliveryDetailsModal";
import CancelConfirmationModal from "./modals/CancelConfirmationModal";
import DeliveryCard from "./modals/DeliveryCard";

const statuses = ["All", "Pending", "Accepted", "In-Transit", "Completed"];

// Export this as it's used in the modal components
export const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Accepted":
      return "bg-blue-100 text-blue-800";
    case "In-Transit":
      return "bg-purple-100 text-purple-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const DeliveryList = ({ user }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [deliveryToCancel, setDeliveryToCancel] = useState(null);

  const fetchDeliveries = async () => {
    try {
      let url = `/deliveries?createdBy=${user._id}`;
      if (selectedStatus !== "All") {
        url += `&status=${selectedStatus}`;
      }
      const res = await api.get(url, { withCredentials: true });
      setDeliveries(res.data);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      toast.error("Failed to fetch deliveries");
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [selectedStatus, user._id]);

  const handleCancelDelivery = async () => {
    try {
      console.log('Attempting to cancel delivery:', deliveryToCancel);
      const response = await api.delete(`/deliveries/${deliveryToCancel}`);
      
      if (response.status === 200) {
        fetchDeliveries();
        setIsModalOpen(false);
        setIsCancelConfirmOpen(false);
        toast.success(response.data.message || 'Delivery cancelled successfully');
      }
    } catch (err) {
      console.error('Full error details:', {
        url: err.config?.url,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.config?.headers
      });
      
      toast.error(
        err.response?.data?.message || 
        `Failed to cancel delivery (${err.response?.status || 'no response'})`
      );
    }
  };
  const submitFeedback = async (deliveryId, feedbackData) => {
  try {
    const response = await api.post(
      `/deliveries/${deliveryId}/feedback`,
      feedbackData,
      { withCredentials: true }
    );
    
    // Update the local state to reflect the new feedback
    setDeliveries(prevDeliveries =>
      prevDeliveries.map(delivery =>
        delivery._id === deliveryId
          ? { ...delivery, feedback: response.data.feedback }
          : delivery
      )
    );
    
    toast.success("Feedback submitted successfully!");
    return response.data;
  } catch (err) {
    console.error("Error submitting feedback:", err);
    throw err.response?.data?.message || "Failed to submit feedback";
  }
};

  const openCancelConfirmation = (deliveryId, event) => {
    event?.stopPropagation();
    setDeliveryToCancel(deliveryId);
    setIsCancelConfirmOpen(true);
  };

  const openDeliveryDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const search = searchTerm.toLowerCase();
    return (
      delivery.pickupAddress.toLowerCase().includes(search) ||
      delivery.dropoffAddress.toLowerCase().includes(search) ||
      delivery.packageNote?.toLowerCase().includes(search) ||
      delivery._id.toLowerCase().includes(search) ||
      delivery.acceptedBy?.name?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="h-full w-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Your Delivery History
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search deliveries..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              selectedStatus === status
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredDeliveries.length === 0 ? (
        <div className="flex-grow bg-white p-8 rounded-lg shadow text-gray-500 flex items-center justify-center">
          No {selectedStatus.toLowerCase()} deliveries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {filteredDeliveries.map((delivery) => (
            <DeliveryCard
              key={delivery._id}
              delivery={delivery}
              onCardClick={openDeliveryDetails}
              onCancelClick={openCancelConfirmation}
            />
          ))}
        </div>
      )}

      <DeliveryDetailsModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  delivery={selectedDelivery}
  onCancelClick={openCancelConfirmation}
  onSubmitFeedback={submitFeedback}  // Add this line
/>

      <CancelConfirmationModal
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleCancelDelivery}
      />
    </div>
  );
};

export default DeliveryList;