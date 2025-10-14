"use client";

import { motion } from "framer-motion";

export default function MapPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto h-96 rounded-2xl shadow-lg bg-gradient-to-r from-maroon via-chili to-saffron flex items-center justify-center"
    >
      <div className="text-center text-cream">
        <h3 className="text-3xl font-bold mb-2">🗺️ Interactive Map</h3>
        <p className="text-lg opacity-90">Coming Soon...</p>
      </div>
      {/* TODO: Replace with actual Google Map iframe or Mapbox integration */}
    </motion.div>
  );
}
