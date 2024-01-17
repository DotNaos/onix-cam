/* eslint-disable react/display-name */
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS, Results } from "@mediapipe/hands";
import { HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import {
  RefObject,
  useEffect,
} from "react";
import Webcam from "react-webcam";

export class Detector
{

  static webcamRef: RefObject<Webcam>;
  static canvasRef: RefObject<HTMLCanvasElement>;
  static handLandmarker: HandLandmarker;
  static lastVideoTime = -1;
  static results: HandLandmarkerResult = {} as HandLandmarkerResult;

  public static init({
  webcamRef,
  canvasRef    }: {
      webcamRef: RefObject<Webcam>;
      canvasRef: RefObject<HTMLCanvasElement>;
    }) {

        if (Detector.handLandmarker) return;

        Detector.webcamRef = webcamRef;
        Detector.canvasRef = canvasRef;

        const initVision = async () => {
            const { FilesetResolver, HandLandmarker } = await import(
              "@mediapipe/tasks-vision"
            );
            const vision = await FilesetResolver.forVisionTasks(
              "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            Detector.handLandmarker = await HandLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                delegate: "GPU",
              },
              runningMode: "VIDEO",
              numHands: 2,
            });
          };
          initVision();

          setInterval(Detector.predict, 1000 / 60);
      };

    public static getResults(): HandLandmarkerResult {
        return Detector.results;
    }


     static predict(){
      if (Detector.handLandmarker == null || typeof Detector.handLandmarker == "undefined") return;

      if (
        typeof Detector.webcamRef.current == "undefined" ||
        Detector.webcamRef.current == null ||
        Detector.webcamRef.current.video!.readyState !== 4
      )
        return;

      if (Detector.canvasRef.current == null || typeof Detector.canvasRef.current == "undefined")
        return;

      const canvasElement = Detector.canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");

      const video = Detector.webcamRef.current.video;

      // console.log(video)

      // console.log(canvasCtx);
      canvasElement.width = video!.videoWidth;
      canvasElement.height = video!.videoHeight;

      let startTimeMs = performance.now();
      if (Detector.lastVideoTime !== video!.currentTime) {
        Detector.lastVideoTime = video!.currentTime;
        Detector.results = Detector.handLandmarker.detectForVideo(video!, startTimeMs);
      }

      if (Detector.results == null || typeof Detector.results == "undefined") return;

      canvasCtx!.save();
      canvasCtx!.clearRect(0, 0, canvasElement!.width, canvasElement!.height);
      if (Detector.results!.landmarks) {
        for (const landmarks of Detector.results!.landmarks) {
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
    }
}
