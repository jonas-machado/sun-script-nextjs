import React from "react";

const Search = ({ onChange, value }: { onChange?: any; value?: string }) => {
  return (
    <div className="w-1/3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          onChange={onChange}
          value={value}
          type="search"
          id="default-search"
          className="block w-full p-2 pl-10 outline-none text-sm text-gray-300 border border-gray-900 rounded-lg bg-gray-900"
          placeholder="Search"
          required
        />
      </div>
    </div>
  );
};

export default Search;
