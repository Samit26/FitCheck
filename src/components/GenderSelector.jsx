import React from "react";

const GenderSelector = ({ onSelectGender }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Choose Your Style
      </h2>
      <p className="text-gray-500 mb-10 text-center max-w-md">
        Select your preference to see outfits curated just for you
      </p>

      <div className="flex gap-4 sm:gap-8">
        {/* Male Card */}
        <button
          onClick={() => onSelectGender("male")}
          className="group relative w-40 sm:w-56 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border border-gray-100"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=530&fit=crop&crop=top"
              alt="Male fashion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
            <p className="text-white text-xl font-bold">Male</p>
            <p className="text-white/70 text-sm mt-1">
              Explore men's collection
            </p>
          </div>
          <div className="absolute inset-0 rounded-3xl ring-2 ring-transparent group-hover:ring-violet-500 transition-all pointer-events-none" />
        </button>

        {/* Female Card */}
        <button
          onClick={() => onSelectGender("female")}
          className="group relative w-40 sm:w-56 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white border border-gray-100"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=530&fit=crop&crop=top"
              alt="Female fashion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
            <p className="text-white text-xl font-bold">Female</p>
            <p className="text-white/70 text-sm mt-1">
              Explore women's collection
            </p>
          </div>
          <div className="absolute inset-0 rounded-3xl ring-2 ring-transparent group-hover:ring-fuchsia-500 transition-all pointer-events-none" />
        </button>
      </div>
    </div>
  );
};

export default GenderSelector;
