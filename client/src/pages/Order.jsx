import { useState } from "react";
import CreateDelivery from "../components/CreateDelivery";
import toast from "react-hot-toast";

export default function Order({ user }) {
  const [refresh, setRefresh] = useState(false);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start relative"
      style={{
        background: "linear-gradient(to right top, #eef2f3,rgb(22, 101, 181))",
      }}
    >
     <div className="relative z-10 w-full max-w-5xl mx-auto p-8 rounded-xl shadow-2xl animate-fade-in">

        <h1 className="text-3xl font-bold mb-4 text-indigo-700 text-center">
          Create a New Delivery
        </h1>

        {user?.role === "customer" ? (
          <CreateDelivery
            onClose={() => {
              setRefresh((r) => !r);
              
            }}
          />
        ) : (
          <p className="text-center text-red-500">
            Only customers can create delivery requests.
          </p>
        )}
      </div>

     
    </div>
  );
}