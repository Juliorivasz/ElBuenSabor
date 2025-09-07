import React from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export const EmptyProducts: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 text-gray-700">
      <Inventory2OutlinedIcon style={{ fontSize: 48, marginBottom: 16 }} />
      <h2 className="text-lg font-semibold">Producto no disponible</h2>
      <p className="text-sm">No pudimos encontrar el plato por el momento. Por favor intentalo mas tarde.</p>
    </div>
  );
};
