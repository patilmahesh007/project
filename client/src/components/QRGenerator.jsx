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
        `${import.meta.env.VITE_BASE_URL}/qr/generate`,
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
    <div className="min-h-[70vh] overflow-hidden bg-black flex flex-col items-center justify-center p-4">
      <Toaster position="top-center" />

      {!generatedQR && (
        <button
          onClick={generateQRCode}
          className="bg-orange-500 text-white px-12 py-5 rounded-lg font-semibold text-lg transition duration-300 hover:bg-orange-600 active:bg-orange-700"
        >
          Generate QR
        </button>
      )}

      {generatedQR ? (
        <div className="relative w-[500px] h-[800px] flex items-center justify-center">
          <img
            src={generatedQR.qrCode}
            alt="Generated QR Code"
            className="w-[50%] h-[50%] object-contain"
          />
        </div>
      ):<h1>asddad</h1> }
    </div>
  );
};

export default GenerateQR;
