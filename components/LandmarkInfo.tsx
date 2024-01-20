"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { IoLocate } from "react-icons/io5";
import LandmarkTable from "./LandmarkTable";



export function LandmarkInfo() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();


  return (
    <div className={"absolute h-full w-full bottom-0"}>
      <Button
        variant="faded"
        radius="full"
        color="warning"
        aria-label="Show Data"
        onPress={onOpen}
        isIconOnly
        className="absolute bottom-0 h-16 w-16 left-0 m-5 z-20"
      >
        <IoLocate className="text-2xl" />
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
        className="absolute bottom-10 left-0 w-full "
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
            <LandmarkTable aria-label="Show Data"/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
