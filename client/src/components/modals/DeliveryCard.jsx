import { getStatusColor } from "../utils/deliveryUtils";

const DeliveryCard = ({ delivery, onCardClick, onCancelClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all cursor-pointer hover:shadow-lg"
      onClick={() => onCardClick(delivery)}
    >
      <div className="relative">
        <img
          src={
            delivery.itemImage
              ? `http://localhost:5000/uploads/deliveries/${delivery.itemImage}`
              : "/default-box.png"
          }
          alt="Item"
          className="rounded-t w-full h-40 object-cover"
        />
        <span
          className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            delivery.status
          )}`}
        >
          {delivery.status}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-blue-700 truncate">
          #{delivery._id.slice(-8)}
        </h3>

        <p className="text-sm">
          <strong>Pickup:</strong> {delivery.pickupAddress}
        </p>
        <p className="text-sm">
          <strong>Dropoff:</strong> {delivery.dropoffAddress}
        </p>
        <p className="text-sm">
          <strong>Created:</strong>{" "}
          {new Date(delivery.createdAt).toLocaleString()}
        </p>

        {delivery.acceptedBy && (
          <p className="text-sm">
            <strong>Assigned to:</strong> {delivery.acceptedBy.name}
          </p>
        )}

        {delivery.status === "Pending" && (
          <button
            onClick={(e) => onCancelClick(delivery._id, e)}
            className="w-full mt-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
};

export default DeliveryCard;