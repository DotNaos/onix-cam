import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { Dispatch, useContext, useState } from "react";
import {
  HandLandmarkerResult,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { useAsyncList } from "@react-stately/data";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { DetectorContext } from "@/app/providers";

export default function LandmarkTable() {
  const results = useContext(DetectorContext);
  const detections = results?.landmarks;

  if (
    !(
      detections === undefined ||
      detections.length === 0 ||
      detections === null ||
      detections[0] === undefined ||
      detections[0].length === 0
    )
  ) {
    var landmarks = detections[0];
  } else {
    var landmarks = [
      {
        x: NaN,
        y: NaN,
        z: NaN,
      },
    ] as NormalizedLandmark[];
  }

  // landmarks.forEach((landmark) => {
  //   console.log(landmark);
  // });

  // if(landmarks.length > 0){
  //   console.log(landmarks[0]);
  // }

  const colums = [
    "Joint",
    "X",
    "Y",
    "Z",
  ];

  return (
    <Table removeWrapper className="p-5" isHeaderSticky aria-label="">
      <TableHeader>
        {colums.map((item, index) => (
          <TableColumn
            className={`uppercase bg-default bg-opacity-20 text-base font-black text-center ${
              index === 1
                ? "text-red-500"
                : index === 2
                ? "text-green-500"
                : index === 3
                ? "text-blue-500"
                : "text-white font-bold"
            }`}
            key={index}
          >
            {item}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={landmarks}>
        {landmarks.map((item, index) => (
          <TableRow key={index} className=" text-medium text-center">
            <TableCell className="font-black" width={10}>
              {index}
            </TableCell>
            <TableCell width={10}>{Number(item.x).toFixed(3)}</TableCell>
            <TableCell width={10}>{Number(item.y).toFixed(3)}</TableCell>
            <TableCell width={10}>{Number(item.z).toFixed(3)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
