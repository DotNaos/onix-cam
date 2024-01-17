"use client";
import { LandmarkInfo } from "./../components/LandmarkInfo";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { IoVideocamOff } from "react-icons/io5";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { motion } from "framer-motion";
import { DetectorContext } from "./providers";
import ConnectionModal from "@/components/ConnectionModal";
import { Detector } from "@/utils/detector";


export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [results, setResults] = useState<HandLandmarkerResult>({} as HandLandmarkerResult);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    getVideo();
  }, [webcamRef]);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        let video = webcamRef.current;
        if (video) {
          // @ts-ignore
          video.srcObject = stream;
          // @ts-ignore
          // video.play();
          // console.log(video);
          setIsCameraOn(true);
        }
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

    useEffect(() => {
      Detector.init({ webcamRef, canvasRef });
    }, [webcamRef, canvasRef]);

    setInterval(() => {
      setResults(Detector.getResults());
    }
    , 1000 / 60);

  return (
    <DetectorContext.Provider value={results}>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* Background image */}
        <div className="z-6 bg-red-gradient w-full h-full absolute rotate-180 opacity-50"></div>
        <div className="z-6 bg-blue-gradient w-full h-full absolute opacity-50"></div>

        {/* Video Source */}
        <div className="relative h-full bg-opacity-50 backdrop-blur-2xl z-10 w-full">
          <Webcam
            audio={false}
            width={1920}
            height={1080}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "user",
            }}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute z-10 top-0 left-0 w-full h-full object-cover"
          />

          {isCameraOn ? null : (
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
            >
              <IoVideocamOff className="text-9xl text-white" />
            </motion.div>
          )}
        </div>

        <LandmarkInfo landmarkerRef={results} />
        <ConnectionModal landmarkerRef={results} />
      </div>
    </DetectorContext.Provider>
  );
}
