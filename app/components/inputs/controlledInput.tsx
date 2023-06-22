"use client";

import { FieldValues, UseFormRegister, Controller } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

interface input {
  id: string;
  name: string;
  onChange?: any;
  control: any;
  array: any;
}
const ControlledInput = ({ id, name, control, onChange, array }: input) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <RadioGroup {...field}>
              <div className="flex w-full items-center justify-between gap-2">
                {array.map((arr: any) => (
                  <RadioGroup.Option
                    key={arr.name}
                    value={arr.name}
                    className={({ active, checked }) =>
                      `relative flex cursor-pointer rounded-lg px-3 py-2 shadow-sm shadow-black focus:outline-none w-full transition-all ${
                        checked
                          ? "bg-gray-700 bg-opacity-60 text-white shadow-md shadow-black"
                          : "bg-gray-900 bg-opacity-60"
                      }`
                    }
                  >
                    {({ checked }) => (
                      <div className="flex w-full justify-between ">
                        <div className="w-full text-center">
                          <span className={`text-gray-300`}>{arr.name}</span>
                        </div>
                        {checked && (
                          <div className="shrink-0 text-white">
                            <CheckIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </>
        )}
      />
    </>
  );
};

export default ControlledInput;
