import React, { useState, useRef } from "react";
import { ShoppingBag, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { maleClothingItems, femaleClothingItems } from "@/data/clothingData";

// -- Horizontal Carousel Row --
const CarouselRow = ({ title, items, selectedClothing, onSelectClothing }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  if (!items.length) return null;

  return (
    <div className="mb-5">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2.5 px-1">
        {title}
      </h4>
      <div className="relative group/carousel">
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
        >
          {items.map((item) => {
            const isSelected = selectedClothing[item.category] === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectClothing(item.id, item.category)}
                className={`flex-shrink-0 cursor-pointer group relative w-[100px] h-[100px] rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-violet-600 ring-2 ring-violet-200 shadow-lg scale-105"
                    : "border-gray-100 hover:border-gray-300 shadow-sm hover:shadow-md"
                }`}
              >
                <img
                  src={item.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  alt={item.name}
                  loading="lazy"
                />
                {isSelected && (
                  <>
                    <div className="absolute inset-0 bg-violet-600/20" />
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center shadow">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

// -- Main Component --
const ClothingSelector = ({ selectedClothing, onSelectClothing, gender }) => {
  const [activeTab, setActiveTab] = useState("clothes");

  const allItems =
    gender === "female" ? femaleClothingItems : maleClothingItems;

  const tabs =
    gender === "female"
      ? [
          { id: "clothes", label: "Clothes", icon: "\uD83D\uDC57" },
          { id: "caps", label: "Caps", icon: "\uD83E\uDDE2" },
          { id: "shoes", label: "Shoes", icon: "\uD83D\uDC60" },
        ]
      : [
          { id: "clothes", label: "Clothes", icon: "\uD83D\uDC54" },
          { id: "caps", label: "Caps", icon: "\uD83E\uDDE2" },
          { id: "shoes", label: "Shoes", icon: "\uD83D\uDC5F" },
        ];

  const getSections = () => {
    if (activeTab === "clothes") {
      const tops = allItems.filter((i) => i.category === "tops");
      const bottoms = allItems.filter((i) => i.category === "bottoms");
      const dresses = allItems.filter((i) => i.category === "dresses");
      const sections = [
        { title: "Tops", items: tops },
        { title: "Bottoms", items: bottoms },
      ];
      if (dresses.length > 0)
        sections.push({ title: "Dresses", items: dresses });
      return sections;
    }
    if (activeTab === "caps") {
      return [
        {
          title: "Caps & Hats",
          items: allItems.filter((i) => i.category === "caps"),
        },
      ];
    }
    if (activeTab === "shoes") {
      return [
        {
          title: "Footwear",
          items: allItems.filter((i) => i.category === "shoes"),
        },
      ];
    }
    return [];
  };

  const sections = getSections();

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 h-full flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-violet-600" />
          Select Outfit
        </h3>
      </div>

      <div className="flex gap-1 px-5 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="h-px bg-gray-100 mx-5" />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-5">
        {sections.map((section) => (
          <CarouselRow
            key={section.title}
            title={section.title}
            items={section.items}
            selectedClothing={selectedClothing}
            onSelectClothing={onSelectClothing}
          />
        ))}
      </div>
    </div>
  );
};

export default ClothingSelector;
