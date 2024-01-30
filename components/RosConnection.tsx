import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { IoCloseCircle, IoLocate } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { PiPlugsBold, PiPlugsConnectedBold } from "react-icons/pi";
import { DetectorContext } from "@/app/providers";
import ROSLIB from "roslib";

const RosConnection = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isConnected, setConnected] = useState(false);
  const results = useContext(DetectorContext);

  const [url, setURL] = useState<string>(
    "wss://summary-amazing-tetra.ngrok-free.app"
  );


  const connectToServer = async (url: string) => {
    const ros = new ROSLIB.Ros({
      url: url,
    });

    ros.on("connection", function () {
      console.log("Connected to websocket server.");
      setConnected(true);
    }
    );

    useEffect(() => {
      // Send a message to the drone
      const cmdVel = new ROSLIB.Topic({
        ros: ros,
        name: "/cmd_vel",
        messageType: "geometry_msgs/Twist",
      });

      const twist = new ROSLIB.Message({
        linear: {
          x: 0.1,
          y: 0.2,
          z: 0.3,
        },
        angular: {
          x: -0.1,
          y: -0.2,
          z: -0.3,
        },
      });

      cmdVel.publish(twist);

  }, [results]);

    ros.on("error", function (error) {
      console.log("Error connecting to websocket server: ", error);
      setConnected(false);
    });

    ros.on("close", function () {
      console.log("Connection to websocket server closed.");
      setConnected(false);
    });
  };

  return (
    <div className={"absolute h-full w-full bottom-0"}>
      <Button
        variant="flat"
        color={isConnected ? "success" : "danger"}
        onPress={onOpen}
        isIconOnly
        className="absolute bottom-0 h-16 w-16 right-0 m-5 z-20"
      >
        {isConnected ? (
          <PiPlugsConnectedBold size={24} />
        ) : (
          <PiPlugsBold size={24} />
        )}
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="transparent"
        scrollBehavior="inside"
        classNames={{
          closeButton: "hidden",
          body: "p-0",
          base: "bg-opacity-40 backdrop-blur-xl",
        }}
        className="absolute bottom-10 right-0 w-full "
        motionProps={{
          variants: {
            enter: {
              y: -20,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: 0,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          <ModalBody>
            <Card className="bg-[#1E1E20] p-6 bg-transparent">
              <CardHeader
                title="Connection"
                className="p-4 flex flex-col gap-3 justify-center items-center text-center"
              >
                <span className="flex text-2xl font-bold">
                  Set Server Connection
                </span>
              </CardHeader>
              <Divider />
              <CardBody className="flex px-4 pt-2 pb-4 gap-3 h-full">
                <Input
                  label="URL"
                  labelPlacement="outside"
                  value={url}
                  onChange={(e) => {
                    setURL(e.target.value);
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
              </CardBody>
              <CardFooter className="flex grid-cols-2 px-4 pt-2 pb-4 gap-3 h-full w-full">
                <Button
                  variant="shadow"
                  color={isConnected ? "success" : "danger"}
                  className=" text-default-50 text-md font-semibold w-full"
                  onClick={() => {
                    connectToServer(url);
                  }}
                >
                  Connect
                </Button>
                <Button
                  variant="flat"
                  color="warning"
                  className="text-default-50 text-md font-semibold"
                  onClick={() => {
                    // socket?.close();
                  }}
                  isIconOnly
                >
                  <IoCloseCircle size={24} />
                </Button>
              </CardFooter>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RosConnection;
