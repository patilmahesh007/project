import QRGenerator from "../../components/QRGenerator";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
const QRPage = () => {
  return (
    <div>
       <Navbar
      bg="black"
      />
      <h1 style={{ textAlign: "center" }}></h1>
      
      <QRGenerator />
      <Footer/>
    </div>
  );
};

export default QRPage;
