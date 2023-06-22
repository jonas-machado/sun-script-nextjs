"use client";

import { FieldValues, UseFormRegister, Controller } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

interface input {
  id: string;
  name: string;
  control: any;
  array: any;
  selectedRadio: any;
  onChange: any;
}
const ControlledInputDescription = ({
  id,
  name,
  control,
  array,
  selectedRadio,
  onChange,
}: input) => {
  return (
    <>
      <RadioGroup value={selectedRadio} onChange={onChange}>
        <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
        <div className="flex space-x-2">
          {array.map((arr: any) => (
            <RadioGroup.Option
              key={arr.name}
              value={arr}
              className={({ active, checked }) =>
                `
                  ${
                    checked
                      ? "bg-gray-700 bg-opacity-75 text-white"
                      : "bg-gray-900 "
                  }
                    relative flex cursor-pointer rounded-lg px-3 py-2 shadow-md focus:outline-none w-full transition-all`
              }
            >
              {({ active, checked }) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium text-white`}
                        >
                          {arr.name}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className={`inline ${
                            checked ? "text-sky-100" : "text-gray-400"
                          }`}
                        >
                          <span>{arr.description}</span>
                        </RadioGroup.Description>
                      </div>
                    </div>
                    {checked && (
                      <div className="shrink-0 text-white">
                        <CheckIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </>
  );
};

export default ControlledInputDescription;
