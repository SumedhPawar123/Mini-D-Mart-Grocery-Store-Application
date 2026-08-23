import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-white text-xl font-extrabold"
            >
              <span className="bg-brand p-2 rounded-xl">
                <ShoppingCart size={20} />
              </span>

              Mini D-Mart
            </Link>

            <p className="text-sm text-gray-400 mt-4 leading-6">
              Your everyday grocery store for fresh products,
              easy ordering, store pickup, and convenient home
              delivery.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-brand hover:text-white flex items-center justify-center transition"
                aria-label="FaFacebook"
              >
                <FaFacebook size={16} />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-brand hover:text-white flex items-center justify-center transition"
                aria-label="FaInstagram"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-brand hover:text-white flex items-center justify-center transition"
                aria-label="FaTwitter"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">
              Quick Links
            </h3>

            <div className="space-y-3 text-sm">
              <Link
                to="/"
                className="block hover:text-white transition"
              >
                Products
              </Link>

              <Link
                to="/cart"
                className="block hover:text-white transition"
              >
                Shopping Cart
              </Link>

              <Link
                to="/orders"
                className="block hover:text-white transition"
              >
                My Orders
              </Link>

              <Link
                to="/returns"
                className="block hover:text-white transition"
              >
                Returns & Exchanges
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">
              Customer Service
            </h3>

            <div className="space-y-3 text-sm">
              <p className="hover:text-white transition cursor-pointer">
                Help Center
              </p>

              <p className="hover:text-white transition cursor-pointer">
                Delivery Information
              </p>

              <p className="hover:text-white transition cursor-pointer">
                Return Policy
              </p>

              <p className="hover:text-white transition cursor-pointer">
                Privacy Policy
              </p>

              <p className="hover:text-white transition cursor-pointer">
                Terms & Conditions
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm">

              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="text-brand mt-0.5 flex-shrink-0"
                />

                <span>
                  Pune, Maharashtra,
                  <br />
                  India
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={17}
                  className="text-brand flex-shrink-0"
                />

                <span>
                  +91 98765 43210
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={17}
                  className="text-brand flex-shrink-0"
                />

                <span>
                  support@minidmart.com
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Mini D-Mart.
            All rights reserved.
          </p>

          <p>
            Fresh groceries. Easy shopping. Happy customers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;