"use client";
import { WebcamDetection } from "@/components/WebcamDetection";
import { LandmarkInfo } from "./../components/LandmarkInfo";

import ConnectionModal from "@/components/ConnectionModal";


export default function Home() {


  return (
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* Background image */}
        <div className="z-6 bg-red-gradient w-full h-full absolute rotate-180 opacity-50"></div>
        <div className="z-6 bg-blue-gradient w-full h-full absolute opacity-50"></div>

        <WebcamDetection />

      </div>
  );
}
