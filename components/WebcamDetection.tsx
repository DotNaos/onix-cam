import { HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { IoVideocamOff } from "react-icons/io5";
import Webcam from "react-webcam";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";

export const WebcamDetection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  let handLandmarker: HandLandmarker;
  let results : HandLandmarkerResult = {} as HandLandmarkerResult;

  const [loopID, setloopID] = useState<number>(0);


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
          console.log(video);
          setIsCameraOn(true);

        }
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  let lastVideoTime = -1;


  const CreateHandLandmarker = async () => {
    useEffect(() => {
      const initVision = async () => {
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

        setInterval(predictWebcam, 10);
      };
      initVision();
    }, []);
  };

  CreateHandLandmarker();


function predictWebcam() {
  if (handLandmarker == null || typeof handLandmarker == "undefined") return;

  if (
    typeof webcamRef.current == "undefined" ||
    webcamRef.current == null ||
    webcamRef.current.video!.readyState !== 4
  )
    return;

  if (canvasRef.current == null || typeof canvasRef.current == "undefined")
    return;

  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement.getContext("2d");

  const video = webcamRef.current.video;

  // console.log(video)

  // console.log(canvasCtx);
  canvasElement.width = video!.videoWidth;
  canvasElement.height = video!.videoHeight;

  let startTimeMs = performance.now();
  if (lastVideoTime !== video!.currentTime) {
    lastVideoTime = video!.currentTime;
    results = handLandmarker.detectForVideo(video!, startTimeMs);
  }

  if (results == null || typeof results == "undefined") return;


  canvasCtx!.save();
  canvasCtx!.clearRect(0, 0, canvasElement!.width, canvasElement!.height);
  if (results!.landmarks) {
    for (const landmarks of results!.landmarks) {
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

  console.log(results);
}

  return (
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
  );
}
