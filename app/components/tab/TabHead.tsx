import React, { useState } from "react";

interface tabHead {
  children: React.ReactNode;
  onClick?: any;
  className?: any;
  state?: string;
  id: string;
}

const TabHead = ({ onClick, children, className, state, id }: tabHead) => {
  return (
    <>
      <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
        <a
          className={`transition-all cursor-pointer text-xs font-bold rounded-none uppercase px-5 py-3 shadow-lg block leading-normal text-gray-200 ${
            state == id
              ? "text-gray-300 rounded-xl shadow-lg shadow-black bg-gray-900 bg-opacity-70"
              : "text-gray-200"
          } ${className}`}
          onClick={onClick}
          id={id}
          data-toggle="tab"
          role="tablist"
        >
          {children}
        </a>
      </li>
    </>
  );
};

export default TabHead;
