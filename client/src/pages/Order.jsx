import { useState } from "react";
import CreateDelivery from "../components/CreateDelivery";
import toast from "react-hot-toast";

export default function Order({ user }) {
  const [refresh, setRefresh] = useState(false);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start relative"
      style={{
        background: "linear-gradient(to right top, #eef2f3, #8ec5fc)",
      }}
    >
      <div className="relative z-10 w-full max-w-2xl mx-auto p-6 rounded-xl shadow-2xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-4 text-indigo-700 text-center">
          Create a New Delivery
        </h1>

        {user?.role === "customer" ? (
          <CreateDelivery
            onClose={() => {
              setRefresh((r) => !r);
              toast.success("Delivery request created!");
            }}
          />
        ) : (
          <p className="text-center text-red-500">
            Only customers can create delivery requests.
          </p>
        )}
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
