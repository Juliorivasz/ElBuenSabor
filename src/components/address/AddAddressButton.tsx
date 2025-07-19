"use client"

import type React from "react"
import { motion } from "framer-motion"
import { AddOutlined } from "@mui/icons-material"

interface AddAddressButtonProps {
  onClick: () => void
  disabled?: boolean
}

export const AddAddressButton: React.FC<AddAddressButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
        disabled
          ? "border-gray-200 text-gray-400 cursor-not-allowed"
          : "border-orange-300 text-orange-600 hover:border-orange-500 hover:bg-orange-50"
      }`}
    >
      <div className="flex flex-col items-center space-y-2">
        <AddOutlined sx={{ fontSize: 32 }} />
        <span className="text-sm font-medium">Agregar nueva dirección</span>
      </div>
    </motion.button>
  )
}
