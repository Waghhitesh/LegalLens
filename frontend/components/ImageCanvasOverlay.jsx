"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ImageCanvasOverlay — right-hand column of the Single SKU Inspector.
 * Renders the physical package image, then draws red bounding boxes on an
 * overlaid <canvas> for every violation's bounding_box_coordinates
 * ([x, y, w, h] in the *original image's pixel space*).
 *
 * The canvas is kept the same rendered size as the <img>, and box
 * coordinates are scaled by the ratio between the image's natural size
 * and its displayed size, so boxes stay aligned at any container width.
 */
export default function ImageCanvasOverlay({ imageUrl, violations = [] }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredViolationId, setHoveredViolationId] = useState(null);

  const boxes = violations
    .filter((v) => v.bounding_box_coordinates)
    .map((v) => ({ id: v.id, rule_type: v.rule_type, ...v.bounding_box_coordinates }));

  function draw() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !img.naturalWidth) return;

    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    const scaleX = displayWidth / img.naturalWidth;
    const scaleY = displayHeight / img.naturalHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boxes.forEach((box) => {
      const isHovered = box.id === hoveredViolationId;
      ctx.strokeStyle = isHovered ? "#f59e0b" : "#dc2626";
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.strokeRect(box.x * scaleX, box.y * scaleY, box.w * scaleX, box.h * scaleY);

      // small label chip above the box
      const label = box.rule_type?.replace(/_/g, " ") || "Violation";
      ctx.font = "10px sans-serif";
      const textWidth = ctx.measureText(label).width;
      const labelY = Math.max(box.y * scaleY - 14, 0);
      ctx.fillStyle = isHovered ? "#f59e0b" : "#dc2626";
      ctx.fillRect(box.x * scaleX, labelY, textWidth + 8, 14);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, box.x * scaleX + 4, labelY + 10);
    });
  }

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, violations, hoveredViolationId]);

  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">
        Physical Package Evidence
      </h2>

      <div ref={containerRef} className="relative w-full rounded-lg overflow-hidden bg-slate-100">
        {imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Physical package"
              className="w-full h-auto block"
              onLoad={draw}
            />
            <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none" />
          </>
        ) : (
          <div className="aspect-square flex items-center justify-center text-slate-400 text-sm">
            No package image available
          </div>
        )}
      </div>

      {boxes.length > 0 && (
        <ul className="mt-4 space-y-1">
          {boxes.map((box) => (
            <li
              key={box.id}
              onMouseEnter={() => setHoveredViolationId(box.id)}
              onMouseLeave={() => setHoveredViolationId(null)}
              className="text-xs text-slate-600 hover:text-red-600 cursor-default px-2 py-1 rounded hover:bg-red-50"
            >
              • {box.rule_type?.replace(/_/g, " ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
