"use client";
import {
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
} from "@nextui-org/react";
import React from "react";

export function Controls() {
  return (
    <div className="flex justify-start max-w-2xl flex-wrap  h-full gap-5">
      <div className="flex flex-col gap-5">
        <h1>
          <span className="text-4xl font-bold">Connections</span>
        </h1>

        <Card isBlurred className="outline-1 outline outline-default-200/50">
          <CardBody className="flex justify-between items-center flex-row gap-5">
            <Chip className="px-3" variant="faded" color="success">
              Raspi IP
            </Chip>

            <Input type="number" defaultValue="" className="" variant="faded" />
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
      </div>


      {/* <h1>
        <span className="text-4xl font-bold">Video</span>
      </h1> */}
    </div>
  );
}
