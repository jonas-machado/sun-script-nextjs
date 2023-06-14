"use client";

import React, { useState, useRef, Fragment, Children } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { User } from "@prisma/client";
import Image from "next/image";

interface ModalProp {
  isOpen?: boolean;
  currentUser?: User | null;
  make?: any;
  cancel?: any;
  children: React.ReactNode;
}

const Modal = ({ isOpen, currentUser, make, cancel, children }: ModalProp) => {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex w-full min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 bg-opacity-80 text-left shadow-xl transition-all sm:my-8 w-2/3">
                <div className="px-4 py-3 sm:px-6">
                  <div className="w-full">{children}</div>
                  <div className=" flex flex-row-reverse mt-4 gap-2">
                    <button
                      type="button"
                      className="inline-flex mt-3 justify-center rounded-md bg-purple-800
                    px-10 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-600 sm:ml-3 "
                      onClick={make}
                    >
                      Enviar
                    </button>
                    <button
                      type="button"
                      className="mt-3 px-10 inline-flex justify-center rounded-md bg-black py-2 text-sm font-semibold text-gray-100 shadow-sm hover:bg-gray-900 transition"
                      onClick={cancel}
                      ref={cancelButtonRef}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
