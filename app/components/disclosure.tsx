"use client";

import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

interface disclosure {
  title: string;
  children: React.ReactNode;
}

export default function DisclosureBank({ title, children }: disclosure) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-900 px-4 py-2 text-left text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none">
            <span>{title}</span>
            <ChevronUpIcon
              className={`${
                open ? "rotate-180 transform" : ""
              } h-5 w-5 text-gray-300`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-4 text-sm text-gray-300 bg-gray-800 bg-opacity-70 rounded-xl ">
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
