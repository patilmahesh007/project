import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const GenerateQR = () => {
  const [generatedQR, setGeneratedQR] = useState(null);

  const localUser = JSON.parse(localStorage.getItem("user")) || {};

  const generateQRCode = async () => {
    if (!localUser._id) {
      toast.error("User not logged in or user ID not found in local storage!");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/qr/generate`,
        { userId: localUser._id }
      );

      if (response.data.qrCode && response.data.qrId) {
        setGeneratedQR(response.data);
        toast.success("QR Code generated successfully!");
      } else {
        toast.error("Failed to generate QR code.");
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
      toast.error(err.response?.data?.message || "Error generating QR code");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <Toaster position="top-center" />
      <h1 className="text-4xl font-bold mb-8">Generate QR Code</h1>
      <button
        onClick={generateQRCode}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded shadow transition-colors mb-4"
      >
        Generate QR
      </button>
      {generatedQR && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-2xl font-semibold mb-4">Your QR Code</h3>
          <img
            src={generatedQR.qrCode}
            alt="Generated QR Code"
            className="w-48 h-48 mb-4 object-contain"
          />
          <p className="text-lg">
            <strong>QR ID:</strong> {generatedQR.qrId}
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerateQR;
