import { HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { motion } from "framer-motion";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { IoVideocamOff } from "react-icons/io5";
import Webcam from "react-webcam";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import ConnectionModal from "./ConnectionModal";
import { LandmarkInfo } from "./LandmarkInfo";
import RosConnection from "./RosConnection";
import { DetectorContext } from "@/app/providers";

export const WebcamDetection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [loopID, setloopID] = useState(0);

  let handLandmarker: HandLandmarker;

  const [results, setResults] = useState<HandLandmarkerResult>({} as HandLandmarkerResult);

  useEffect(() => {
    getVideo();
    CreateHandLandmarker();
    startAnimationLoop();
    return () => cancelAnimationFrame(loopID); // Cleanup the animation frame when the component unmounts
  }, []);

  const startAnimationLoop = () => {
    let animationFrameID: number = 0;

    const updateInformation = () => {
      predictWebcam();
      animationFrameID = requestAnimationFrame(updateInformation);
    };

    updateInformation(); // Start the animation loop
    setloopID(animationFrameID);
  };

  let lastVideoTime = -1;

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        let video = webcamRef.current;
        if (video) {
          // @ts-ignore
          video.srcObject = stream;
          setIsCameraOn(true);
        }
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };


  const CreateHandLandmarker = async () => {
    const { FilesetResolver, HandLandmarker } = await import(
      "@mediapipe/tasks-vision"
    );
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });
  };

  const predictWebcam = () => {
    if (
      handLandmarker == null ||
      typeof handLandmarker == "undefined" ||
      typeof webcamRef.current == "undefined" ||
      webcamRef.current == null ||
      webcamRef.current.video!.readyState !== 4 ||
      canvasRef.current == null ||
      typeof canvasRef.current == "undefined"
    ) {
      return;
    }

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    const video = webcamRef.current.video;

    canvasElement.width = video!.videoWidth;
    canvasElement.height = video!.videoHeight;

    let startTimeMs = performance.now();

    let res : HandLandmarkerResult = results;
    if (lastVideoTime !== video!.currentTime) {
      lastVideoTime = video!.currentTime;

      res = handLandmarker.detectForVideo(video!, startTimeMs);
      if (res.landmarks == null) return;

      setResults(res);
    }


    canvasCtx!.save();
    canvasCtx!.clearRect(
      0,
      0,
      canvasElement!.width,
      canvasElement!.height
    );
    if (res.landmarks) {
      for (const landmarks of res.landmarks) {
        drawConnectors(canvasCtx!, landmarks, HAND_CONNECTIONS, {
          color: "#FFFFFF",
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx!, landmarks, {
          color: "#4FF2BF",
          lineWidth: 1,
        });
      }
    }
    canvasCtx!.restore();
  };

  return (
    <DetectorContext.Provider value={results}>
      <div className="relative h-full bg-opacity-50 backdrop-blur-2xl z-10 w-full">
        {/* Video Source */}
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

        {/* Visualization */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-10"
        />

        {/* Misc */}
        {/* <ConnectionModal /> */}
        <RosConnection />
      </div>
    </DetectorContext.Provider>
  );
};



