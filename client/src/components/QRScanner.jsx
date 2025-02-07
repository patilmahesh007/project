import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast, Toaster } from "react-hot-toast";
import api from "../utils/api";

const ScanQR = () => {
  const [scanningComplete, setScanningComplete] = useState(false);
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState("");
  
  const isScanning = useRef(false);
  const scannerRef = useRef(null);

  const processScanResult = async (decodedText) => {
    if (isScanning.current) return; 
    isScanning.current = true;
    try {
      const parsedData = JSON.parse(decodedText);
      const { qrId } = parsedData;
      await scanQRCode(qrId);
    } catch (err) {
      console.error("Failed to parse QR data:", err);
      toast.dismiss();
      toast.error("Invalid QR code format.", { duration: 3000 });
      isScanning.current = false;
    }
  };

  const scanQRCode = async (qrId) => {
    try {
      const response = await api.post("/qr/scan", { qrId });
      setScanResult(response.data.message);
      toast.dismiss();
      toast.success(response.data.message, { duration: 3000 });
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
      toast.dismiss();
      toast.error(errMsg, { duration: 3000 });
      isScanning.current = false;
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
    <div className="min-h-[65vh] flex flex-col items-center justify-center bg-black p-4">
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
      {scanResult && <p className="mt-4 font-semibold">{scanResult}</p>}
      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
    </div>
  );
};

export default ScanQR;
