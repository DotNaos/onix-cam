// page.tsx
"use client";

import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useRef, useEffect } from "react";
import Webcam from "react-webcam";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        }
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

   let handLandmarker: any = undefined;

  const createHandLandmarker = async () => {
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

  createHandLandmarker();



let lastVideoTime = -1;
let results: any = undefined;

async function predictWebcam() {
  if(
    typeof webcamRef.current == "undefined" ||
    webcamRef.current == null ||
    webcamRef.current.video!.readyState !== 4
  ) return;

  if (canvasRef.current == null || typeof canvasRef.current == "undefined" ) return;
  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement?.getContext("2d");

  const video = webcamRef.current.video;

  console.log(video)

  console.log(canvasCtx);
  canvasElement.width = video!.videoWidth;
  canvasElement.height = video!.videoHeight;

    let startTimeMs = performance.now();
  if (lastVideoTime !== video!.currentTime) {
    lastVideoTime = video!.currentTime;
    results = handLandmarker.detectForVideo(video, startTimeMs);
  }

  canvasCtx!.save();
  canvasCtx!.clearRect(0, 0, canvasElement!.width, canvasElement!.height);
  if (results!.landmarks) {
    for (const landmarks of results!.landmarks) {
      drawConnectors(canvasCtx!, landmarks, HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 5
      });
      drawLandmarks(canvasCtx!, landmarks, { color: "#FF0000", lineWidth: 2 });
    }
  }
  canvasCtx!.restore();

  console.log(results);


}

  // Call this function again to keep predicting when the browser is ready.

  setInterval(predictWebcam, 10);




  return (
    // @ts-ignore
    <div className="relative w-screen h-screen rounded-2xl bg-white overflow-hidden border-2 border-default-50 border-opacity-10">
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
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>
  );
}

