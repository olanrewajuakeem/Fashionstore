const PromoBanner = () => {
  return (
    <div className="relative my-12 max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-lg bg-gray-800">
      {/* Overlay Content */}
      <div className="flex flex-col items-center justify-center text-center text-white p-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Buy 1 Get 1 Free
        </h2>
        <p className="mb-6 text-sm md:text-base">
          On all accessories this weekend only
        </p>
        <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
