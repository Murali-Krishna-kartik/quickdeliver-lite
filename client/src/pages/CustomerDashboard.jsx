// CustomerDashboard.js
import DeliveryList from "../components/DeliveryList";

export default function CustomerDashboard({ user }) {
  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        background: "linear-gradient(to right top, #eef2f3, #8ec5fc)",
      }}
    >
      <div className="relative z-10 w-full h-full p-4 animate-fade-in">
        <DeliveryList user={user} />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}