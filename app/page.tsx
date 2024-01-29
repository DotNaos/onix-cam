"use client";
import { LandmarkInfo } from "./../components/LandmarkInfo";
import { useEffect, useRef, useState } from "react";
import { IoVideocamOff } from "react-icons/io5";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { motion } from "framer-motion";
import { DetectorContext } from "./providers";
import ConnectionModal from "@/components/ConnectionModal";
import useWebcam from "@/hooks/useWebcam";
import useCanvas from "@/hooks/useCanvas";
import useHandLandmarkDetection from "@/hooks/useHandLandmarkDetection";
import { WebcamDetection } from "@/components/WebcamDetection";


export default function Home() {
  const { webcamRef, WebcamComponent } = useWebcam();
  const { canvasRef, CanvasComponent } = useCanvas();

  const results : HandLandmarkerResult = useHandLandmarkDetection({
    canvasRef,
    webcamRef,
  });

  return (
    <DetectorContext.Provider value={results}>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* Background image */}
        <div className="z-6 bg-red-gradient w-full h-full absolute rotate-180 opacity-50"></div>
        <div className="z-6 bg-blue-gradient w-full h-full absolute opacity-50"></div>

        {/* Video Source */}
        {/* <div className="relative h-full bg-opacity-50 backdrop-blur-2xl z-10 w-full">
          {WebcamComponent}
          {CanvasComponent}
        </div> */}

        {/* <LandmarkInfo /> */}
        {/* <ConnectionModal /> */}

        <WebcamDetection />
      </div>
    </DetectorContext.Provider>
  );
}
