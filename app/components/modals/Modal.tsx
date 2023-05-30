"use client";

import { useState, useRef, Fragment, Children } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { User } from "@prisma/client";
import Image from "next/image";

interface ModalProp {
  isOpen: boolean,
  currentUser: User | null
}

const Modal = ({ isOpen, currentUser }: ModalProp) => {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
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
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-1/3">
                <div className="bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4 w-full">
                  <div className="sm:flex sm:items-start w-full">
                    <div className="w-full">
                      <div className="px-4 sm:px-0">
                        <h1 className="text-4xl text-center font-semibold leading-7 text-gray-200">Perfil</h1>
                      </div>
                      <div className="mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-400">Nome completo</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-200 sm:col-span-2 sm:mt-0">{currentUser?.name}</dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-400">Cargo</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-200 sm:col-span-2 sm:mt-0">...</dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-400">Email address</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-200 sm:col-span-2 sm:mt-0">{currentUser?.email}</dd>
                          </div>

                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-400">Imagem de perfil</dt>
                            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                              <Image
                                className="rounded-lg "
                                src={
                                  currentUser?.image
                                    ? currentUser?.image!
                                    : `/images/Default-user-picture.webp`
                                }
                                height={250}
                                width={250}
                                alt="user picture"
                              />
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-purple-800
                    px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-600 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm hover:bg-gray-900 transition sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
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
