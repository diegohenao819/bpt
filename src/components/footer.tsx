// Footer.jsx

import Image from "next/image"; // If you're using Next.js
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import UTPLogo from "../images/UTPLogo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-black py-8 mt-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
          <div className="flex justify-center   w-full">
            <Image
              src={UTPLogo} // Adjust the path according to where you saved the logo
              alt="Universidad Tecnológica de Pereira Logo"
              width={100} // Adjust the width as needed
              height={100} // Adjust the height as needed
              className="mb-2"
            />
          </div>
          <h2 className="text-lg font-semibold text-center md:text-left">
            Upper-Intermediate English Course
          </h2>

          <p className="text-center md:text-left font-bold ">
            Page created by
            <span className="font-semibold text-black text-opacity-75 ml-1">
              Professor Diego Henao
            </span>
          </p>
          <p className="text-center md:text-left font-bold">
            Professor at 
            <span className="font-semibold text-black text-opacity-75 ml-1">
              Universidad Tecnológica de Pereira
            </span>
          </p>
        </div>
        {/* Right Section */}
        <div className="flex space-x-4">
          <a href="#" aria-label="Facebook" className="hover:text-blue-500">
            <FaFacebookF size={24} />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-400">
            <FaTwitter size={24} />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-pink-500">
            <FaInstagram size={24} />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-blue-700">
            <FaLinkedinIn size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
