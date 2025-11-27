"use client";
import React, { useState, useRef } from "react";
import { DrawingCanvas } from "./DrawingCanvas";

type PanelStatus = "idle" | "planting" | "planted" | "blocked";

interface DrawingPanelProps {
  open: boolean;
  onClose: () => void;
  onPlanted: (flower: any) => void;
}

export function DrawingPanel({ open, onClose, onPlanted }: DrawingPanelProps) {
  const [status, setStatus] = useState<PanelStatus>("idle");
  const [error, setError] = useState("");
  const canvasRef = useRef<{ clear: () => void; submit: () => void } | null>(null);

  async function handlePlant(imageUrl: string) {
    setStatus("planting");
    setError("");
    try {
      const res = await fetch("/api/flowers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      });
      const data = await res.json();
      if (data.status === "ok" && data.flower) {
        setStatus("planted");
        onPlanted(data.flower);
        setTimeout(() => {
          setStatus("idle");
          canvasRef.current?.clear();
          onClose();
        }, 1200);
      } else if(data.status === "blocked") {
        setStatus("blocked");
      } else {
        setError("Something went wrong.");
        setStatus("idle");
      }
    } catch {
      setError("Network error");
      setStatus("idle");
    }
  }

  function handleClear() {
    canvasRef.current?.clear();
  }

  function handlePlantClick() {
    canvasRef.current?.submit();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/15">
      <div className="relative rounded-2xl bg-white p-4 shadow-lg max-w-md w-[95vw] mx-auto flex flex-col items-center gap-4">
        {/* DrawingCanvas */}
        <DrawingCanvas
          ref={canvasRef}
          onSubmit={handlePlant}
          disabled={status === "planting"}
        />
        <div className="flex w-full justify-between gap-2 mt-2">
          <button
            className="px-4 py-2 rounded-full border border-[#B7E3C4] bg-[#CFE3D5] hover:bg-[#C0D9C6] text-sm font-medium text-[#314537] shadow-sm"
            onClick={handleClear}
            disabled={status === "planting"}
          >
            Clear
          </button>
          <button
            className="px-4 py-2 rounded-full border border-[#B7E3C4] bg-[#CFE3D5] hover:bg-[#C0D9C6] text-sm font-medium text-[#314537] shadow-sm"
            onClick={handlePlantClick}
            disabled={status === "planting"}
          >
            Plant
          </button>
          <button
            className="px-4 py-2 rounded-full border border-[#B7E3C4] bg-[#CFE3D5] hover:bg-[#C0D9C6] text-sm font-medium text-[#314537] shadow-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {/* Status area */}
        <div className="min-h-[32px] w-full flex items-center justify-center text-xs text-neutral-600">
          {status === "planting" && (
            <span className="font-mono text-emerald-700">planting</span>
          )}
          {status === "planted" && (
            <span className="font-mono text-green-700">planted</span>
          )}
          {status === "blocked" && (
            <div className="flex flex-col items-center">
              {/* Sticky-note for blocked */}
              <div className="relative bg-[#FFF6DA] border border-amber-300 rounded-xl px-4 py-2 font-mono text-amber-800 mt-2 shadow-sm w-fit">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-2 bg-amber-200 rounded -rotate-2 shadow-sm" />
                <span className="block">Do not try to be funny</span>
              </div>
            </div>
          )}
          {error && (
            <span className="font-mono text-rose-600">{error}</span>
          )}
        </div>
      </div>
    </div>
  );
}
