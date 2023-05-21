"use client";

import { FieldValues, UseFormRegister } from "react-hook-form";

interface input {
  label: string;
  placeholder?: string;
  id: string;
  name?: string;
  onChange?: any;
  register: UseFormRegister<FieldValues>;
  error?: any;
  required: boolean;
}
const InputUseForm = ({
  label,
  placeholder,
  id,
  name,
  onChange,
  register,
  error,
  required,
}: input) => {
  return (
    <div className={`mt-1 flex rounded-md ${error[id] ? "shadow-[0px_0px_10px] shadow-red-600" : ""}`}>
      <label
        className={`inline-flex items-center rounded-l-md border border-black  px-3 text-sm text-gray-200 bg-black bg-opacity-40 `}
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        className={`focus:shadow-[0px_0px_10px] focus:shadow-black transition duration-300 block caret-gray-200 outline-none w-full h-11 flex-1 rounded-none rounded-r-md  pl-3 text-gray-200 border-gray-900 sm:text-sm border-b-[1px] border-t-[1px] bg-black bg-opacity-60`}
        placeholder={placeholder}
        spellCheck="false"
        {...register(id, { required })}
      />
    </div>
  );
};

export default InputUseForm;
