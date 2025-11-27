"use client";
import { useState, useEffect } from "react";
import { Garden } from "../components/Garden";
import { DrawingPanel } from "../components/DrawingPanel";
import type { Flower } from "./api/flowers/route";

export default function Home() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [drawingOpen, setDrawingOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
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
  
  function handleAdminToggle() {
    if (!isAdmin) {
      const password = prompt('Enter admin password:');
      if (password) {
        // Check password with API
        fetch('/api/flowers/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        })
          .then(res => res.json())
          .then(data => {
            if (data.authenticated) {
              setIsAdmin(true);
              setEditMode(true);
              // Store token in sessionStorage
              sessionStorage.setItem('adminToken', data.token);
            } else {
              alert('Incorrect password');
            }
          })
          .catch(err => console.error('Auth failed:', err));
      }
    } else {
      setIsAdmin(false);
      setEditMode(false);
      sessionStorage.removeItem('adminToken');
    }
  }
  
  function handleFlowerRemove(id: string) {
    if (confirm('Remove this flower?')) {
      const token = sessionStorage.getItem('adminToken');
      fetch(`/api/flowers?id=${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then((data) => {
          if (data.status === 'ok') {
            setFlowers(f => f.filter(flower => flower.id !== id));
          } else {
            alert('Failed to remove flower');
          }
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
            onClick={handleAdminToggle}
            className={`inline-flex items-center justify-center rounded-full px-6 py-2 text-sm transition-colors ${
              isAdmin 
                ? 'bg-[#E8B4B8] text-[#5A2C2E] hover:bg-[#D9A5A9]' 
                : 'bg-[#E5E5E5] text-[#333] hover:bg-[#D5D5D5]'
            }`}
          >
            {isAdmin ? 'done editing' : 'admin'}
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
