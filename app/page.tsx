"use client";
import { useState, useEffect } from "react";
import { Garden } from "../components/Garden";
import { DrawingPanel } from "../components/DrawingPanel";
import type { Flower } from "./api/flowers/route";

export default function Home() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [drawingOpen, setDrawingOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Fetch flowers on mount
  useEffect(() => {
    fetch('/api/flowers')
      .then(res => res.json())
      .then(data => setFlowers(data))
      .catch(err => console.error('Failed to fetch flowers:', err));
  }, []);
  
  function handlePlanted(flower: Flower) {
    setFlowers(f => [...f, flower]);
  }
  
  function handleFlowerRemove(id: string) {
    if (confirm('Remove this flower?')) {
      fetch(`/api/flowers?id=${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          setFlowers(f => f.filter(flower => flower.id !== id));
        })
        .catch(err => console.error('Failed to remove flower:', err));
    }
  }
  
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <main className="flex flex-col items-center gap-6">
        <Garden 
          flowers={flowers} 
          onPlantClick={() => setDrawingOpen(true)}
          onFlowerRemove={editMode ? handleFlowerRemove : undefined}
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDrawingOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-[#CFE3D5] px-6 py-2 text-sm text-[#314537] hover:bg-[#B8D4BE] transition-colors"
          >
            plant a flower
          </button>
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className={`inline-flex items-center justify-center rounded-full px-6 py-2 text-sm transition-colors ${
              editMode 
                ? 'bg-[#E8B4B8] text-[#5A2C2E] hover:bg-[#D9A5A9]' 
                : 'bg-[#E5E5E5] text-[#333] hover:bg-[#D5D5D5]'
            }`}
          >
            {editMode ? 'done editing' : 'remove flowers'}
          </button>
        </div>
        <DrawingPanel
          open={drawingOpen}
          onClose={() => setDrawingOpen(false)}
          onPlanted={handlePlanted}
        />
      </main>
    </div>
  );
}
