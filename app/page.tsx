// page.tsx
"use client";
import { useRef, useState } from "react";
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
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
  getKeyValue,
} from "@nextui-org/react";
import {IoVideocamOff} from "react-icons/io5";
import { useAsyncList } from "@react-stately/data";
import LandmarkTable from "@/components/LandmarkTable";

export default function Home() {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <IoVideocamOff className="text-9xl text-white" />
                <p className="text-white text-4xl font-bold">Camera is off</p>
              </div>
            </div>
        </div>

        {/* Video / Data Controls */}
        <div className="sm:flex flex-col h-full  flex-[2] p-5 gap-5 hidden">
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
      <div className="flex flex-1 border-t border-default-400 border-opacity-20">
        <LandmarkTable data={result}   />
      </div>
    </div>
  );
}

