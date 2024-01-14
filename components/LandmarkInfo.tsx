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
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import * as net from 'net';


export function LandmarkInfo({ landmarkerRef }: { landmarkerRef: HandLandmarkerResult }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

let verbindung: WebSocket;

function daten_uebermitteln(daten: HandLandmarkerResult): void {
    try {
        const datenString = JSON.stringify(daten);

        // Überprüfen Sie den Status der Verbindung, bevor Sie Daten senden
        if (verbindung && verbindung.readyState === WebSocket.OPEN) {
            verbindung.send(datenString);
            console.log('Daten erfolgreich übermittelt.');
        } else {
            console.error('Verbindung ist nicht geöffnet. Daten wurden nicht gesendet.');
        }
    } catch (e) {
        console.error(`Fehler bei der Datenübermittlung: ${e}`);
    }
}


function verbindung_herstellen(ip_adresse: string, port: number): WebSocket {
    const verbindung = new WebSocket(`ws://${ip_adresse}:${port}`);

    verbindung.addEventListener('open', () => {
        console.log('Verbindung hergestellt.');

        // Beispiel-HandLandmarkerResult erstellen

        // Daten übermitteln, nachdem die Verbindung geöffnet ist
        daten_uebermitteln(landmarkerRef);
    });

    verbindung.addEventListener('close', () => {
        console.log('Verbindung geschlossen.');
    });

    return verbindung;
}

  return (
    <div className={"absolute h-full w-full bottom-0"}>
      <Button
        variant="flat"
        radius="full"
        color={!isOpen ? "danger" : "success"}
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
            <LandmarkTable aria-label="Show Data" data={landmarkerRef} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
