import { Table, TableBody, TableCell, TableColumn, TableHeader } from "@nextui-org/react";
import React from "react";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";

export default function LandmarkTable({data}: {data: HandLandmarkerResult}) {
  console.log(data);
  return (
    <Table
      removeWrapper
      className="p-5"
      isHeaderSticky
      classNames={{
        base: "max-h-[520px] overflow-scroll",
      }}
    >
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>ROLE</TableColumn>
        <TableColumn>STATUS</TableColumn>
      </TableHeader>
      <TableBody
      // loadingContent={<Spinner color="white" />}
      >
        <TableCell>
          <div></div>
        </TableCell>
        {/* {(
          item // <TableRow key={item.res}>
        ) => (
          //   {(columnKey) => (
          //     <TableCell>{getKeyValue(item, columnKey)}</TableCell>
          //   )}
          // </TableRow>
          <div></div>
        )} */}
      </TableBody>
    </Table>
  );
}
