"use client";
import { useState, useEffect } from "react";
import { Garden } from "../components/Garden";
import { DrawingPanel } from "../components/DrawingPanel";
import type { Flower } from "./api/flowers/route";

export default function Home() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [drawingOpen, setDrawingOpen] = useState(false);
  // No flowers loaded
  useEffect(() => {
    setFlowers([]);
  }, []);
  function handlePlanted(flower: Flower) {
    setFlowers(f => [...f, flower]);
  }
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <main className="flex flex-col items-center gap-6">
        <Garden flowers={flowers} onPlantClick={() => setDrawingOpen(true)} />
        <button
          type="button"
          onClick={() => setDrawingOpen(true)}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-[#CFE3D5] px-6 py-2 text-sm text-[#314537]"
        >
          plant a flower
        </button>
        <DrawingPanel
          open={drawingOpen}
          onClose={() => setDrawingOpen(false)}
          onPlanted={handlePlanted}
        />
      </main>
    </div>
  );
}
