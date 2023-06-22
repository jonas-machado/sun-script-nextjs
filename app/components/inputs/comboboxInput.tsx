"use client";

import { Fragment } from "react";
import { FieldValues, UseFormRegister, Controller } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Label } from "@headlessui/react/dist/components/label/label";

interface input {
  id: string;
  selected: string;
  onChange?: any;
  displayValue?: any;
  onChangeInput: any;
  filtered: string[];
  query: string;
  label: string;
  placeHolder: string;
}
const ComboboxInput = ({
  id,
  label,
  placeHolder,
  selected,
  onChange,
  onChangeInput,
  filtered,
  query,
}: input) => {
  return (
    <>
      <Combobox value={selected} onChange={onChange}>
        <div className="relative w-full">
          <div className="flex relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none sm:text-sm">
            <label
              htmlFor={id}
              className="inline-flex items-center rounded-l-md border border-r-0 border-gray-900 bg-gray-700 bg-opacity-70 px-3 text-sm text-gray-200"
            >
              {label}
            </label>
            <Combobox.Input
              id={id}
              placeholder={placeHolder}
              className="w-full border-none outline-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-300 bg-gray-900 bg-opacity-70"
              displayValue={(olt?: any) => olt.olt}
              onChange={onChangeInput}
            />
            <Combobox.Button className="rounded-lg absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={onChangeInput}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filtered.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-300">
                  Nothing found.
                </div>
              ) : (
                filtered.map((olt: any) => (
                  <Combobox.Option
                    key={olt.olt}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? "bg-purple-600 text-white"
                          : "text-gray-300 bg-gray-900"
                      }`
                    }
                    value={olt}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {olt.olt}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </>
  );
};

export default ComboboxInput;
