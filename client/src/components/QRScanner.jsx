import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-scanner-container",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        setError("");
        setMessage("🔍 Verifying QR code...");

        console.log("Scanned QR Code:", decodedText);

        const [extractedUserId] = decodedText.split("-");
        console.log("Extracted userId:", extractedUserId);

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/qr/scan`,
            { userId: extractedUserId, qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATaSURBVO3BQY4cSRIEQdNA/f/Lujz6KYBEevU2hyaCf6RqyUnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXok5eA/CQ1N0AmNROQSc0TQG7U3ACZ1NwA+Ulq3jipWnRSteikatEny9RsAvIGkE1q3lDzhppNQDadVC06qVp0UrXoky8D8oSaJ4BMam6ATEAmNROQSc0EZFIzAZnUTEAmNU8AeULNN51ULTqpWnRSteiTf4yaJ9TcqJmAPKHmv+SkatFJ1aKTqkWf/McB+SY1N2omIDdq/mYnVYtOqhadVC365MvU/CQgk5oJyDepmYBMaiYgb6j5TU6qFp1ULTqpWvTJMiD/T2omIJOaCcikZgIyqZmATGq+CchvdlK16KRq0UnVok9eUvObAHkDyKRmAjKpuVHzhpq/yUnVopOqRSdViz55CcikZgKySc2kZgIyqZmA3KiZgDwB5EbNpOYGyCY133RSteikatFJ1SL8I4uA3Kj5SUAmNROQSc0bQH4TNROQGzVvnFQtOqladFK16JOXgHwTkCfU3ACZ1DwB5EbNE0Bu1NwAmdRMQCY133RSteikatFJ1aJPlqmZgExAbtRMam6ATEAmNROQJ4BMar5JzQ2QGyCTmgnIjZo3TqoWnVQtOqlahH/kBSBvqJmA3Kh5Asik5g0gk5obIJOaGyCTmgnIpOYGyKTmm06qFp1ULTqpWvTJD1MzAZnU3AC5UfMGkE1qJiA3aiYgk5oJyKRmUvOTTqoWnVQtOqla9MlLam6ATEBugDyhZgJyA+QnAZnU3ACZ1LwB5EbNppOqRSdVi06qFn3yEpBJzY2aN4BMQG7UPAFkUjMB+SY1T6iZgExqJiDfdFK16KRq0UnVok9eUjMBmdRMQCY1N0AmNTdAngAyqZmATGpugDwB5EbNBGRSM6mZgExqvumkatFJ1aKTqkWfvATkCTUTkBs1T6iZgExqnlAzAblRcwNkUnMDZFIzAblRcwNkUvPGSdWik6pFJ1WLPlmmZgJyo+YGyG+iZgLyhJoJyKRmUjMBuVEzAZnUTGo2nVQtOqladFK16JMvUzMBuQEyqZmATGpugNyouQFyo2YCcqPmCSBPAJnUTEBu1LxxUrXopGrRSdWiT345IJOaGyA3QG7UTGomIBOQTUDeUDMB+UknVYtOqhadVC3CP/IXA/KGmgnIE2omIG+oeQLIpOYGyI2aN06qFp1ULTqpWvTJS0B+kppJzQ2QTWomIJOaGyBPAJnUPAFkUjMB2XRSteikatFJ1aJPlqnZBOQGyI2aCcgTap4AMqmZ1ExAbtQ8AWRSMwGZ1Gw6qVp0UrXopGrRJ18G5Ak1b6h5AsikZgIyqZnUbALyhpoJyE86qVp0UrXopGrRJ/8YNU+omYA8oeZGzRNAJjU3aiYg33RSteikatFJ1aJP/jFAJjUTkE1AbtRMQG7UTEB+k5OqRSdVi06qFn3yZWq+Sc0E5Akgk5obIDdqJiCTmgnIjZoJyKTmNzmpWnRSteikahH+kReA/CQ1E5AbNROQSc0bQN5Q8wSQTWo2nVQtOqladFK1CP9I1ZKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0f8Ao6k7QypeajIAAAAASUVORK5CYII=" }
          );

          console.log("Full Server Response:", response);

          if (!response.data || !response.data.scanTime) {
            throw new Error("Invalid server response format");
          }

          setMessage(`✅ Entry granted at: ${response.data.scanTime}`);
          onScanSuccess(response.data);
        } catch (err) {
          console.error("Scan Error:", err);

          if (err.response) {
            console.log("Error Response from Server:", err.response);
            setError(err.response.data?.message || "❌ Invalid QR Code");
          } else if (err.request) {
            console.log("No response received from the server:", err.request);
            setError("⚠️ No response from server. Please check your connection.");
          } else {
            console.log("Unexpected Error:", err.message);
            setError("⚠️ Unexpected error. Please try again.");
          }
        }
      },
      (err) => {
        setError("⚠️ Scanning failed. Try again.");
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onScanSuccess]);

  return (
    <div>
      <h2>Scan QR Code</h2>
      <div id="qr-scanner-container"></div>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default QRScanner;
