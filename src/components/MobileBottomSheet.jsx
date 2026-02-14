import React, { useState, useRef } from "react";
import { Check } from "lucide-react";
import { maleClothingItems, femaleClothingItems } from "@/data/clothingData";

// -- Mobile Carousel Row --
const MobileCarouselRow = ({
  title,
  items,
  selectedClothing,
  onSelectClothing,
}) => {
  const scrollRef = useRef(null);

  if (!items.length) return null;

  return (
    <div className="mb-4">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
        {title}
      </h4>
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
      >
        {items.map((item) => {
          const isSelected = selectedClothing[item.category] === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectClothing(item.id, item.category)}
              className={`flex-shrink-0 cursor-pointer relative w-[100px] h-[100px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                isSelected
                  ? "border-violet-600 ring-2 ring-violet-200 shadow-md scale-105"
                  : "border-gray-100 shadow-sm active:scale-95"
              }`}
            >
              <img
                src={item.image}
                className="w-full h-full object-cover"
                alt={item.name}
                loading="lazy"
              />
              {isSelected && (
                <>
                  <div className="absolute inset-0 bg-violet-600/20" />
                  <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -- Main Mobile Bottom Sheet Component --
const MobileBottomSheet = ({ selectedClothing, onSelectClothing, gender }) => {
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
    <div className="bg-white rounded-t-3xl shadow-[0_-4px_30px_rgba(0,0,0,0.08)] border-t border-gray-100">
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-gray-200" />
      </div>

      <div className="px-5 pb-2">
        <h3 className="text-base font-bold text-gray-900">Select Outfit</h3>
      </div>

      <div className="flex gap-1.5 px-5 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                : "bg-gray-100 text-gray-600 active:bg-gray-200"
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5 pb-3 max-h-[300px] overflow-y-auto scrollbar-hide">
        {sections.map((section) => (
          <MobileCarouselRow
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

export default MobileBottomSheet;
