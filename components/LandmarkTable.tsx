import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { Dispatch, useState } from "react";
import { HandLandmarkerResult, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useAsyncList } from "@react-stately/data";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";

export default function LandmarkTable({
  data,
}: {
  data: HandLandmarkerResult;
}) {
  const detections = data?.landmarks;
  // console.log(data);

  if (!(
    detections === undefined ||
    detections.length === 0 ||
    detections === null ||
    detections[0] === undefined ||
    detections[0].length === 0)
  ) {
    var landmarks = detections[0];
  } else {
    var landmarks = [] as NormalizedLandmark[];
  }



  // landmarks.forEach((landmark) => {
  //   console.log(landmark);
  // });

  // if(landmarks.length > 0){
  //   console.log(landmarks[0]);
  // }

  return (
    <Table removeWrapper className="p-5" isHeaderSticky aria-label="">
      <TableHeader>
        <TableColumn className="w-1/4">Joint</TableColumn>
        <TableColumn className="w-1/4">X</TableColumn>
        <TableColumn className="w-1/4">Y</TableColumn>
        <TableColumn className="w-1/4">Z</TableColumn>
      </TableHeader>
      <TableBody items={landmarks}>
        {landmarks.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{index}</TableCell>
            <TableCell>{item.x}</TableCell>
            <TableCell>{item.y}</TableCell>
            <TableCell>{item.z}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

