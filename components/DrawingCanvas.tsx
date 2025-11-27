"use client";
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";

interface DrawingCanvasProps {
  onSubmit: (dataUrl: string) => void;
  disabled?: boolean;
}

const COLORS = [
  "#ff9966", // Orange
  "#d4a5ff", // Lavender (darker)
  "#8ec9ff", // Pastel Blue (darker)
  "#ffe680", // Pastel Yellow (darker)
  "#ff6b6b", // Red
];

const DrawingCanvasComponent = forwardRef<
  { clear: () => void; submit: () => void },
  DrawingCanvasProps
>(function DrawingCanvas({ onSubmit, disabled }, ref) {
  const brushWidth = 4;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [prevPos, setPrevPos] = useState<{ x: number; y: number } | null>(null);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      setCtx(context);
    }
  }, [canvasRef]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    },
    submit: () => {
      if (canvasRef.current) {
        const url = canvasRef.current.toDataURL("image/png");
        onSubmit(url);
      }
    },
  }));

  function getPos(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: ((touch.clientX - rect.left) / rect.width) * canvas.width,
        y: ((touch.clientY - rect.top) / rect.height) * canvas.height,
      };
    } else {
      return {
        x: ((e as React.MouseEvent).clientX - rect.left) / rect.width * canvas.width,
        y: ((e as React.MouseEvent).clientY - rect.top) / rect.height * canvas.height,
      };
    }
  }

  function startDrawing(e: React.MouseEvent | React.TouchEvent) {
    if (disabled) return;
    setDrawing(true);
    setPrevPos(getPos(e));
  }
  function stopDrawing() {
    setDrawing(false);
    setPrevPos(null);
  }
  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing || !ctx) return;
    const pos = getPos(e);
    if (prevPos) {
      ctx.strokeStyle = COLORS[currentColorIndex];
      ctx.lineWidth = brushWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(prevPos.x, prevPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    setPrevPos(pos);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-[280px] h-[280px] bg-white rounded-2xl shadow-sm border border-[#F5D9C5] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={260}
          height={260}
          className="rounded-xl"
          style={{ touchAction: "none", cursor: disabled ? 'not-allowed' : 'crosshair' }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          onTouchMove={draw}
        />
      </div>
      <div className="flex gap-3">
        {COLORS.map((color, index) => (
          <button
            key={color}
            className={
              "w-8 h-8 rounded-full border-2 transition-all " +
              (currentColorIndex === index
                ? "border-gray-600 scale-110"
                : "border-transparent opacity-70 hover:scale-105 hover:opacity-100")
            }
            style={{ backgroundColor: color }}
            type="button"
            onClick={() => setCurrentColorIndex(index)}
            disabled={disabled}
            aria-label={`Color ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

DrawingCanvasComponent.displayName = 'DrawingCanvas';

export { DrawingCanvasComponent as DrawingCanvas };
