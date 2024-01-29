import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { IoVideocamOff } from "react-icons/io5";
import Webcam from "react-webcam";

export const WebcamDetection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        let video: Webcam | null = webcamRef.current;
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

  useEffect(() => {
    getVideo();
  }, [webcamRef]);
  return (
    <Stack>
        <canvas
        ref={canvasRef}
        className="absolute z-10 top-0 left-0 w-full h-full object-cover"
      />
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
    </Stack>
  );
}

const Stack = ({children} : {children: ReactNode}) => {
  return <div className="relative">
    {children}
  </div>;
}
