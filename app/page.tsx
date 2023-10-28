// page.tsx
"use client";

import { drawConnectors, drawLandmarks, drawRectangle } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { useRef, useEffect, useState } from "react";
import  Webcam  from "react-webcam";
import {
  Chip,
  Divider,
  Image,
  Input,
  Spacer,
  CheckboxGroup,
  Checkbox,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import {IoVideocamOff} from "react-icons/io5";

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
          console.log(video);
          setIsCameraOn(true);
        }
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  let handLandmarker: any = undefined;

  const CreateHandLandmarker = async () => {
      useEffect(() => {
        const initVision = async () => {
          const { FilesetResolver, HandLandmarker } = await import(
            "@mediapipe/tasks-vision"
          );
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          );
          // Add logic with `term`
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
  let results: any = undefined;

  async function predictWebcam() {
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
    const canvasCtx = canvasElement?.getContext("2d");

    const video = webcamRef.current.video;

    // console.log(video)

    // console.log(canvasCtx);
    canvasElement.width = video!.videoWidth;
    canvasElement.height = video!.videoHeight;

    let startTimeMs = performance.now();
    if (lastVideoTime !== video!.currentTime) {
      lastVideoTime = video!.currentTime;
      results = handLandmarker.detectForVideo(video, startTimeMs);
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

    // console.log(results);
  }

  setInterval(predictWebcam, 10);




  return (
    // @ts-ignore
    <div className="w-screen h-screen flex flex-col ">
      {/* Background image */}
      <div className="-z bg-red-gradient w-screen h-screen absolute rotate-180 opacity-50"></div>
      <div className="-z bg-blue-gradient w-screen h-screen absolute opacity-50"></div>

      <div className="flex flex-[2]">
        {/* Video Source */}
        <div className="flex-[5] bg-opacity-50 backdrop-blur-2xl z-10 relative  overflow-hidden border-r border-default-400 border-opacity-20">
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
          {
            isCameraOn ? null : (
                        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <IoVideocamOff className="text-9xl text-white" />
                <p className="text-white text-4xl font-bold">Camera is off</p>
              </div>
            </div>
            )
          }

        </div>

        {/* Video / Data Controls */}
        <div className="flex flex-col h-full  flex-[2] p-5 gap-5">
          <h1>
            <span className="text-4xl font-bold">Connection</span>
          </h1>

          <Card isBlurred className="outline-1 outline outline-default-200/50">
            <CardBody className="flex justify-between items-center flex-row gap-5">
              <Chip className="px-3" variant="faded" color="success">
                Raspi IP
              </Chip>

              <Input
                type="number"
                defaultValue=""
                className=""
                variant="faded"
              />
            </CardBody>
          </Card>
          <Card isBlurred className="outline-1 outline outline-default-200/50">
            <CardBody className="flex justify-between items-center flex-row gap-5">
              <CheckboxGroup label="Send Values">
                <Checkbox value="Hand">Hand</Checkbox>
                <Checkbox value="Landmarks">Landmarks</Checkbox>
                <Checkbox value="Debug">Debug</Checkbox>
              </CheckboxGroup>
            </CardBody>
          </Card>
          <h1>
            <span className="text-4xl font-bold">Video</span>
          </h1>
        </div>
      </div>
      <div className="flex flex-1 border-t border-default-400 border-opacity-20"></div>
    </div>
  );
}

