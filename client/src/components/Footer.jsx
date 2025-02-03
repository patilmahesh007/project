import { Facebook, Instagram, Twitter, Youtube, MapPin } from "lucide-react";
import gymLogo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-8 px-10 md:px-20">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-center md:text-left">
          
          <div className="flex flex-col items-center justify-start md:items-start">
            <img src={gymLogo} alt="Gym Logo" className="w-20 h-20 object-contain" />
            <p className="text-lg font-semibold mt-2">"Train Hard. Stay Strong. Conquer Limits!"</p>
          </div>

          <div className="flex flex-col  items-start">
            <p className="text-xl font-semibold mb-2">Follow Us</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-6 h-6 text-white hover:text-orange-500 transition" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-6 h-6 text-white hover:text-orange-500 transition" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-6 h-6 text-white hover:text-orange-500 transition" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <Youtube className="w-6 h-6 text-white hover:text-orange-500 transition" />
              </a>
            </div>
          </div>

          
          <div className="flex flex-col items-start ">
            <p className="text-xl font-semibold mb-2 ">Visit Us</p>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              <p className="text-sm">
                A404, Laxmi Heights, Above Lotus Multi-Speciality Hospital,<br />
                Shewalewadi (Hadapsar), Pune - 412307
              </p>
            </div>
          </div>
          
        </div>
      </div>

      <div className="text-center mt-6 border-t border-gray-700 pt-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} Gym Name. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
