import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import image from "../assets/image.webp";
import api from "../utils/api";

const GenerateQR = () => {
  const [generatedQR, setGeneratedQR] = useState(null);
  const localUser = JSON.parse(localStorage.getItem("user")) || {};

  const generateQRCode = async () => {
    if (!localUser._id) {
      toast.error("User not logged in or user ID not found in local storage!");
      return;
    }

    try {
      const response = await api.post("/qr/generate", {});

      if (
        response.data.success &&
        response.data.data &&
        response.data.data.qrCode &&
        response.data.data.qrId
      ) {
        setGeneratedQR(response.data.data);
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

      {!generatedQR ? (
        <button
          onClick={generateQRCode}
          className="bg-orange-500 text-white px-12 py-5 rounded-lg font-semibold text-lg transition duration-300 hover:bg-orange-600 active:bg-orange-700"
        >
          Generate QR
        </button>
      ) : (
        <div className="relative w-[500px] h-[800px] flex items-center justify-center">
          <img
            src={image}
            alt="Boxer holding Mona Lisa frame"
            className="w-full h-full object-cover"
          />
          <img
            src={generatedQR.qrCode}
            alt="Generated QR Code"
            className="absolute top-[0%] left-[26%] w-[50%] h-[50%] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default GenerateQR;
