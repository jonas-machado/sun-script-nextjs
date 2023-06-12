"use client";

import { FieldValues, UseFormRegister } from "react-hook-form";

interface input {
  label: string;
  placeholder?: string;
  id: string;
  name?: string;
  onChange?: any;
  required: boolean;
  register: UseFormRegister<FieldValues>;
}
const TextAreaUseForm = ({
  label,
  id,
  name,
  onChange,
  register,
  required,
  placeholder,
}: input) => {
  return (
    <div className="flex rounded-md shadow-sm">
      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-900 bg-gray-700 px-3 text-sm text-gray-200">
        {label}
      </span>
      <textarea
        id={id}
        className=" items-center overflow-hidden caret-gray-200 outline-none w-full p-3 rounded-none rounded-r-md bg-gray-900 pl-3 text-gray-200 border-gray-900 sm:text-sm autofill:shadow-[inset_0_0_0px_1000px_rgb(17,24,39,0.7)] border-b-[1px] border-t-[1px]"
        placeholder={placeholder}
        spellCheck="false"
        rows={1}
        {...register(id, { required })}
      />
    </div>
  );
};

export default TextAreaUseForm;