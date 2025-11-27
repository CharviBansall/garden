import Image from "next/image";
import React from "react";
import type { Flower } from "../app/api/flowers/route";

interface GardenProps {
  flowers: Flower[];
  onPlantClick: () => void;
  onFlowerRemove?: (id: string) => void;
}
export function Garden({ flowers, onPlantClick, onFlowerRemove }: GardenProps) {
  return (
    <div className="relative mx-auto w-full max-w-2xl flex items-center justify-center">
      <Image
        src="/garden.png"
        alt="charvs' secret garden illustration"
        width={1200}
        height={700}
        priority
        className="w-full h-auto"
      />
      {/* Overlay all planted flowers as sticker-like images */}
      <div className="absolute inset-0 select-none">
        {flowers.map((flower) => (
          <img
            key={flower.id}
            src={flower.imageUrl}
            alt="flower"
            onClick={() => onFlowerRemove && onFlowerRemove(flower.id)}
            className={onFlowerRemove ? "cursor-pointer hover:scale-110" : "pointer-events-none"}
            style={{
              left: `${flower.x}%`,
              top: `${flower.y}%`,
              width: 48,
              height: 48,
              zIndex: 2,
              position: "absolute",
              transform: 'translate(-50%, -50%)',
              filter: "drop-shadow(0 2px 4px #0002)",
              transition: "all 0.4s cubic-bezier(.37,1.14,.51,.98)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
