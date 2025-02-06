import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast, Toaster } from "react-hot-toast";

const ScanQR = () => {
  const [scanningComplete, setScanningComplete] = useState(false);
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState("");

  const localUser = JSON.parse(localStorage.getItem("user")) || {};
  const localUserId = localUser._id || "";

  const scannerRef = useRef(null);

  const processScanResult = async (decodedText) => {
    try {
      const parsedData = JSON.parse(decodedText);
      const { qrId, userId } = parsedData;
      const finalUserId = localUserId || userId;
      await scanQRCode(qrId, finalUserId);
    } catch (err) {
      console.error("Failed to parse QR data:", err);
      toast.error("Invalid QR code format.");
    }
  };

  const scanQRCode = async (qrId, userId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/qr/scan`,
        { qrId, userId }
      );
      setScanResult(response.data.message);
      toast.success(response.data.message);
      setScanningComplete(true);
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) =>
          console.error("Failed to clear scanner:", error)
        );
      }
    } catch (err) {
      console.error("Error scanning QR code:", err);
      const errMsg = err.response?.data?.message || "Error scanning QR code";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    if (!scanningComplete) {
      const config = { fps: 10, qrbox: 250 };
      const scanner = new Html5QrcodeScanner("reader", config, false);
      scanner.render(
        (decodedText) => {
          console.log("QR Code Scanned:", decodedText);
          if (!scanningComplete) {
            processScanResult(decodedText);
          }
        },
        (scanError) => {
          console.warn("QR Scan Error:", scanError);
        }
      );
      scannerRef.current = scanner;
      return () => {
        scanner.clear().catch((error) =>
          console.error("Failed to clear html5-qrcode scanner:", error)
        );
      };
    }
  }, [scanningComplete]);

  return (
    <div className=" h-[65vh] flex flex-col items-center justify-center bg-black p-6">
      <Toaster position="top-center" />
      <h1 className="text-4xl font-bold text-emerald-400 mb-8">Scan QR Code</h1>
      {scanningComplete ? (
        <div className="flex flex-col items-center">
          <img
            src="https://cdn.dribbble.com/users/4358240/screenshots/14825308/media/84f51703b2bfc69f7e8bb066897e26e0.gif"
            alt="Scan Successful"
            className="w-64 h-auto mb-4"
          />
          <p className="text-emerald-400 text-xl font-medium">
            Entry granted. No further scans.
          </p>
        </div>
      ) : (
        <div
          id="reader"
          className="w-full max-w-md mx-auto border-4 border-dashed border-gray-300 rounded-lg p-4 bg-white shadow-lg"
        ></div>
      )}
      {scanResult && (
        <p className="mt-4 text- font-semibold">{scanResult}</p>
      )}
      {error && (
        <p className="mt-4 text-red-600 font-semibold">{error}</p>
      )}
    </div>
  );
};

export default ScanQR;
