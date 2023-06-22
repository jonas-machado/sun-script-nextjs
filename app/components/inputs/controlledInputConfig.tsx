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
const ControlledInputConfig = ({
  id,
  name,
  control,
  onChange,
  array,
}: input) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <RadioGroup {...field} className="w-full">
              <div className="flex items-center justify-between">
                {array.map((arr: any) => (
                  <RadioGroup.Option
                    key={arr.name}
                    value={field.value}
                    className={({ active, checked }) =>
                      `relative flex border border-gray-900 cursor-pointer rounded-lg lg:first:rounded-none first:rounded-r-none last:rounded-l-none px-3 py-3 shadow-sm shadow-black focus:outline-none w-full transition-all ${
                        checked
                          ? "bg-gray-700 bg-opacity-60 text-white shadow-md shadow-black"
                          : "bg-gray-900 bg-opacity-60"
                      }`
                    }
                  >
                    {({ checked }) => (
                      <div className="flex w-full justify-between ">
                        <div className="w-full text-center text-sm">
                          <span className={`text-gray-300`}>{arr.name}</span>
                        </div>
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

export default ControlledInputConfig;
