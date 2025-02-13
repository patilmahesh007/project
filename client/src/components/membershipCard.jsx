import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Dumbbell } from "lucide-react";

const membershipPlans = [
  {
    id: 1,
    title: "Trial",
    price: 0,
    duration: 1,
    description: "Try the gym for 1 day",
  },
  {
    id: 2,
    title: "Monthly",
    price: 1300,
    duration: 1,
    description: "Monthly membership at ₹1300 per month",
  },
  {
    id: 3,
    title: "Yearly",
    price: 12000,
    duration: 12,
    description: "Annual membership at ₹12000 per year",
  },
];

const MembershipPurchase = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const handlePlanSelect = async (plan) => {
    setSelectedPlan(plan);
    if (plan.price > 0) {
      try {
        const orderResponse = await api.post("/membership/order", { amount: plan.price });
        const orderData = orderResponse.data.data || orderResponse.data;
        if (orderData && orderData.orderId) {
          openRazorpay(orderData.orderId, plan);
        } else {
          toast.error("Failed to create payment order.");
        }
      } catch (error) {
        console.error("Error creating order:", error.response || error);
        toast.error(error.response?.data?.message || "Error creating order");
      }
    } else {
      finalizeMembership(plan, "free_trial");
    }
  };

  const openRazorpay = (orderId, plan) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
      amount: plan.price * 100,
      currency: "INR",
      name: "Muscle Mansion",
      description: plan.title,
      order_id: orderId,
      handler: function (response) {
        finalizeMembership(plan, response.razorpay_payment_id);
      },
      prefill: { name: "", email: "", contact: "" },
      notes: { planName: plan.title },
      theme: { color: "#F37254" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const finalizeMembership = async (plan, paymentId) => {
    try {
      const response = await api.post("/membership/buy", {
        planName: plan.title,
        price: plan.price,
        duration: plan.duration,
        paymentId,
      });
      const membershipData = response.data.membership || { isActive: true };
      localStorage.setItem("membershipActive", String(membershipData.isActive));
      if (membershipData.expiryDate) {
        localStorage.setItem("membershipExpiry", membershipData.expiryDate);
      }
      toast.success(response.data.message || "Membership activated!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error("Error finalizing membership:", error.response || error);
      toast.error(error.response?.data?.message || "Error finalizing membership");
    }
  };

  return (
    <div className="antialiased w-full h-full bg-black text-gray-400 font-inter p-10">
      <Toaster position="top-center" />
      <div className="container px-4 mx-auto">
        <div className="text-center my-10">
          <h1 className="font-bold text-4xl text-white">Membership Plans</h1>
          <p className="text-light text-gray-500 text-xl">Choose a plan to get started</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-10">
          {membershipPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg text-center overflow-hidden w-full transform hover:shadow-2xl hover:scale-105 transition duration-200 ease-in bg-black bg-opacity-10 p-6"
            >
              <h2 className="font-bold text-3xl text-white mb-4">{plan.title}</h2>
              <h3 className="font-normal text-orange-500 text-xl mb-4">
                {plan.price > 0 ? `₹${plan.price}` : "Free"}{" "}
                <hr className="w-full mx-auto border-dashed border-gray-600 py-3 mt-3" />
                <Dumbbell className="w-20 h-20 object-contain text-orange-500 rounded-full mx-auto mb-4" />
                {plan.title === "Trial" ? "for 1 Day" : plan.title === "Monthly" ? "per Month" : "per Year"}
              </h3>
              <p className="text-gray-300 mb-4">{plan.description}</p>
              <button
                onClick={() => handlePlanSelect(plan)}
                className="w-full block bg-gray-900 font-medium text-xl py-4 rounded-xl hover:shadow-lg transition duration-200 ease-in-out hover:bg-orange-800 brightness-75 hover:text-white"
              >
                Buy Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipPurchase;
