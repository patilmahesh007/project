import QRScanner from "../../components/QRScanner";

const ScanPage = () => {
  const handleScanSuccess = (scanData) => {
    console.log("Scan Success:", scanData);
    alert(`Entry granted at: ${scanData.scanTime}`);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QRScanner onScanSuccess={handleScanSuccess} />
    </div>
  );
};

export default ScanPage;
