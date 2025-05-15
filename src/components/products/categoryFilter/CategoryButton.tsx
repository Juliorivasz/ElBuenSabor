import React from "react";

type CategoryButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export const CategoryButton: React.FC<CategoryButtonProps> = ({ label, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={selected ? { boxShadow: "0px 6px 4px #00000040" } : undefined}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer border-2 border-orange-500 ${
        selected ? "bg-orange-500 text-white" : "bg-white text-orange-500"
      }`}>
      {label.toUpperCase()}
    </button>
  );
};
