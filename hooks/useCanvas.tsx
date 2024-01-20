import { useRef } from "react";

const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CanvasComponent = (
    <canvas
      ref={canvasRef}
      className="absolute z-10 top-0 left-0 w-full h-full object-cover"
    />
  );

  return { canvasRef, CanvasComponent };
};

export default useCanvas;
