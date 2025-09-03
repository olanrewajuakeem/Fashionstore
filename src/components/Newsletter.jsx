
import { assets } from "../assets/assets";

const Newsletter = () => {
  return (
    <div className="py-12 px-6 bg-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
        <p className="text-gray-600 mb-6">
          Subscribe & get <span className="text-red-500">10% off</span> your first order
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-gray-400 outline-none"
          />
          <button className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
