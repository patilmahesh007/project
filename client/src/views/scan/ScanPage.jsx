import QRScanner from "../../components/QRScanner";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import React from "react";
const ScanPage = () => {
  const handleScanSuccess = (scanData) => {
    console.log("Scan Success:", scanData);
    alert(`Entry granted at: ${scanData.scanTime}`);
  };

  return (
    <div>
      <Navbar
      bg="black"
      />
      <h1>QR Code Scanner</h1>
      <QRScanner onScanSuccess={handleScanSuccess} />
      <Footer/>
    </div>
  );
};

export default ScanPage;
