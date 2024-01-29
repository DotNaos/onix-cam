"use client";
import { LandmarkInfo } from "./../components/LandmarkInfo";
import { useEffect, useRef, useState } from "react";
import { IoVideocamOff } from "react-icons/io5";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { motion } from "framer-motion";
import ConnectionModal from "@/components/ConnectionModal";
import { WebcamDetection } from "@/components/WebcamDetection";


export default function Home() {
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="z-6 bg-red-gradient w-full h-full absolute rotate-180 opacity-50"></div>
      <div className="z-6 bg-blue-gradient w-full h-full absolute opacity-50"></div>

      {/* Video Source */}
      <WebcamDetection />

      {/* <LandmarkInfo /> */}
      {/* <ConnectionModal /> */}
    </div>
  );
}
