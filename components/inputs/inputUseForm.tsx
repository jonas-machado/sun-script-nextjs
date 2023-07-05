"use client";

import { FieldValues, UseFormRegister } from "react-hook-form";

interface input {
  label: string;
  id: string;
  name?: string;
  onChange?: any;
  register: UseFormRegister<FieldValues>;
  error?: any;
  required?: boolean;
}
const InputUseForm = ({
  label,
  id,
  name,
  onChange,
  register,
  error,
  required,
}: input) => {
  return (
    <div
      className={` mt-1 relative rounded-md ${
        error[id] ? "shadow-[0px_0px_10px] shadow-red-600" : ""
      }`}
    >
      <input
        type="text"
        id={id}
        className={`peer disabled:opacity-70 focus:shadow-[0px_0px_10px] focus:shadow-black duration-300
                disabled:cursor-not-allowed transition caret-gray-200 outline-none w-full pt-[1.2rem] rounded-md pl-4 pb-[0.3rem] text-gray-200 border-gray-900 sm:text-sm border-b-[1px] border-t-[1px] bg-black bg-opacity-50`}
        spellCheck="false"
        {...register(id, { required })}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`
                text-gray-400
                absolute 
                text-md
                duration-150 
                transform 
                top-5 
                z-10 
                origin-[0] 
                left-4
                -translate-y-5
                peer-placeholder-shown:scale-100 
                peer-placeholder-shown:-translate-y-2
                peer-focus:scale-75
                peer-focus:-translate-y-5
                [&:not(peer-placeholder-shown)]:-translate-y-5
                [&:not(peer-placeholder-shown)]:scale-75
                `}
      >
        {label}
      </label>
    </div>
  );
};

export default InputUseForm;
