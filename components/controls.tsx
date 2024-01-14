"use client";
import { DetectorContext } from "@/app/providers";
import { HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import { PiPlugsBold, PiPlugsConnectedBold } from "react-icons/pi";

export function Controls() {
  const [ip_adress, setIpAdress] = React.useState<string>("");
  const [port, setPort] = React.useState<string>("");
  const [isConnected, setIsConnected] = React.useState(false);
  const landmarkerRef = useContext(DetectorContext);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const connectToServer = (ip_address: string, port: string) => {
    // validate input
    const ipValid = new RegExp(
      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    ).test(ip_adress);

    const portValid = new RegExp(
      /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/
    ).test(port);

    if (!ipValid) {
      alert(`IP-Address invalid: ${ip_adress}`);
      return;
    }

    if (!portValid) {
      alert(`Port invalid: ${port}`);
      return;
    }
    try {
     const ws = new WebSocket(`ws://${ip_address}:${port}`);

      ws.onopen = () => {
        console.log("connected to websocket");
        setIsConnected(true);
      };

      ws.onclose = () => {
        console.log("disconnected from websocket");
        setIsConnected(false);
        ws.close();
      };

      ws.onmessage = (event) => {
        console.log(event.data);
      };

      ws.onerror = (err) => {
        console.log("error:", err);
      };

      setSocket(ws);

    } catch (error) {
      console.log("error:", error);
      return;
    }
  };

  useEffect(() => {
    const isReady = socket && landmarkerRef && socket.readyState == socket.OPEN;
    if (isReady) {
      const data = JSON.stringify(landmarkerRef);
      socket.send(data);
    }
  }, [landmarkerRef, socket]);

  return (
    <div className="flex flex-col justify-start max-w-2xl flex-wrap  h-full gap-5">
      <Tabs
        classNames={{
          tabList: "flex gap-0 bg-default-50 p-0 m-0 inset-0 font-semibold",
          tab: "flex px-6 py-6 text-lg",
          panel: "m-0 p-0 w-min-content",
        }}
        color="primary"
        radius="lg"
      >
        <Tab key={"Connections"} title="Connections">
          <Card className="bg-[#1E1E20] sm:w-[50%]">
            <CardHeader
              title="Connection"
              className="p-4 flex gap-3 justify-start items-center"
            >
              <Button
                variant="flat"
                color={isConnected ? "success" : "danger"}
                onClick={() => {
                  connectToServer(ip_adress, port);
                }}
                isIconOnly
              >
                {isConnected ? (
                  <PiPlugsConnectedBold size={24} />
                ) : (
                  <PiPlugsBold size={24} />
                )}
              </Button>
              <span className="flex text-xl font-bold">Robot</span>
            </CardHeader>
            <CardBody className="grid px-4 pt-2 pb-4 gap-3 grid-cols-2 h-full">
              <Input
                label="IP-Adresse"
                labelPlacement="outside"
                value={ip_adress}
                onChange={(e) => {
                  setIpAdress(e.target.value);
                }}
                placeholder="127.0.0.1"
                className="h-full"
                classNames={{
                  label: "text-[#DEDCFF80] font-bold",
                  input: [
                    "bg-transparent",
                    "text-black/90 dark:text-[#DEDCFF]/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                  ],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "shadow-xl",
                    "bg-[#151516]",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focused=true]:bg-default-200/50",
                    "dark:group-data-[focused=true]:bg-default/60",
                    "!cursor-text",
                  ],
                }}
              />
              <Input
                label="Port"
                labelPlacement="outside"
                value={port}
                onChange={(e) => {
                  setPort(e.target.value);
                }}
                placeholder="8765"
                classNames={{
                  label: "text-[#DEDCFF80] font-bold",
                  input: [
                    "bg-transparent",
                    "text-black/90 dark:text-[#DEDCFF]/90",
                    "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                  ],
                  innerWrapper: "bg-transparent",
                  inputWrapper: [
                    "shadow-xl",
                    "bg-[#151516]",
                    "backdrop-blur-xl",
                    "backdrop-saturate-200",
                    "hover:bg-default-200/70",
                    "dark:hover:bg-default/70",
                    "group-data-[focused=true]:bg-default-200/50",
                    "dark:group-data-[focused=true]:bg-default/60",
                    "!cursor-text",
                  ],
                }}
              />
            </CardBody>
          </Card>
        </Tab>
        <Tab key={"Settings"} title="Settings" />
      </Tabs>
    </div>
  );
}
