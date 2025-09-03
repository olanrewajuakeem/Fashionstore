import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About */}
        <div>
          <h3 className="font-bold text-lg mb-3">FashionStore</h3>
          <p className="text-gray-400 text-sm">
            Your go-to online store for trendy fashion at affordable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#About" className="hover:text-white">About</a></li>
            <li><a href="#Contact" className="hover:text-white">Contact</a></li>
            <li><a href="#FAQ" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-bold text-lg mb-3">Follow Us</h3>
  <div className="flex space-x-4">
    <a href="#" className="text-green-500 hover:text-green-600">
      <Facebook size={20} />
    </a>
    <a href="#" className="text-green-500 hover:text-green-600">
      <Twitter size={20} />
    </a>
    <a href="#" className="text-green-500 hover:text-green-600">
      <Instagram size={20} />
    </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        © 2025 FashionStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
