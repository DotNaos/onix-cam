/* eslint-disable react/display-name */
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS, Results } from "@mediapipe/hands";
import { HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { useAsyncList } from "@react-stately/data";
import { get } from "http";
import {
  Dispatch,
  MutableRefObject,
  RefObject,
  forwardRef,
  use,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";

export function Detector({
  webcamRef,
  canvasRef,
}: {
  webcamRef: RefObject<Webcam>;
  canvasRef: RefObject<HTMLCanvasElement>;
}): HandLandmarkerResult{
  let handLandmarker: HandLandmarker;

  const [resultState, setResults] = useState<HandLandmarkerResult>({} as HandLandmarkerResult);

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
      };
      initVision();
    }, []);
  };

  CreateHandLandmarker();

  let lastVideoTime = -1;
  let results: HandLandmarkerResult = {} as HandLandmarkerResult;

  setInterval(predictWebcam, 10);

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

    setResults(results);

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

    // console.log(results);
  }

  return resultState;
}
