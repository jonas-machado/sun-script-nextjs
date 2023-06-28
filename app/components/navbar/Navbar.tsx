"use client";

import { Fragment, useState } from "react";
import { Popover, Transition, Menu, Disclosure } from "@headlessui/react";
import {
  MapIcon,
  BellIcon,
  Bars3Icon,
  CalendarIcon,
  XMarkIcon,
  TableCellsIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@prisma/client";
import Modal from "../modals/Modal";

//constants

import { mapas } from "@/app/constants/mapas";
import { utilitarios } from "@/app/constants/utilitarios";
import { empresasParceiras } from "@/app/constants/empresasParceiras";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface NavbarProps {
  currentUser?: User | null;
  schedules: any;
}

function Navbar({ currentUser, schedules }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const date = new Date();
  const month = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return (
    <header>
      <nav>
        <Popover className="relative bg-black bg-opacity-75 shadow-black shadow-lg ">
          <div className="flex items-center justify-between border-black border-b-2 py-4 mx-auto max-w-7xl px-8 ">
            <div className="flex lg:flex-1">
              <span className="sr-only">Your Company</span>
              <Image
                className="w-auto cursor-pointer"
                src="/images/Sun.png"
                alt=""
                width={40}
                height={40}
                priority={true}
                onClick={() => {
                  router.push("/ss/config/manual");
                }}
              />
            </div>
            <div className="-my-2 -mr-2 lg:hidden">
              <Popover.Button className="border-transparent focus:border-transparent focus:ring-offset-0 inline-flex items-center justify-center rounded-md bg-transparent p-2 text-white hover:bg-transparent hover:text-gray-500 focus:outline-none">
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="false" />
              </Popover.Button>
            </div>
            <Popover.Group className="hidden lg:gap-x-12 pr-10 lg:flex">
              <Link
                href="/ss/solutionBank"
                className="text-base font-medium text-gray-300 hover:text-white"
              >
                Banco de soluções
              </Link>

              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={classNames(
                        open ? "text-gray-300" : "text-gray-300",
                        "border-transparent focus:border-transparent focus:ring-0 group inline-flex items-center rounded-md bg-transparent text-base font-medium hover:text-white focus:outline-none"
                      )}
                    >
                      <span>Agendas</span>
                      <ChevronDownIcon
                        className={classNames(
                          open ? "text-white" : "text-gray-300",
                          "ml-2 h-5 w-5 group-hover:text-white"
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute left-1/2 z-50 mt-3 -translate-x-1/2 transform px-2 sm:px-0">
                        <div className=" overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className=" relative grid gap-6 shadow-xl bg-black opacity-90 border-gray-900 border-2 rounded-lg px-5 py-6 sm:gap-8 sm:p-8">
                            {schedules.map((item: any) =>
                              item.month > date.getMonth() ? (
                                <a
                                  key={item.id}
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-900"
                                >
                                  <CalendarIcon
                                    className="h-6 w-6 flex-shrink-0 text-indigo-200"
                                    aria-hidden="true"
                                  />
                                  <div className="ml-4">
                                    <p className="text-base font-medium text-gray-200 whitespace-nowrap">
                                      {`Agenda ${item.company} ${
                                        month[item.month - 1]
                                      }`}
                                    </p>
                                  </div>
                                </a>
                              ) : (
                                ""
                              )
                            )}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={classNames(
                        open ? "text-white" : "text-gray-300",
                        "border-transparent focus:border-transparent focus:ring-offset-0 group inline-flex items-center rounded-md bg-transparent text-base font-medium hover:text-white focus:outline-none"
                      )}
                    >
                      <span>Mapas</span>
                      <ChevronDownIcon
                        className={classNames(
                          open ? "text-white" : "text-gray-300",
                          "ml-2 h-5 w-5 group-hover:text-white"
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute z-50 -ml-4 mt-3 w-screen max-w-[15rem] transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="relative grid gap-6 bg-black opacity-90 border-gray-900 border-2 rounded-lg px-5 py-6 sm:gap-8 sm:p-8">
                            {mapas.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-900"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <item.icon
                                  className="h-6 w-6 flex-shrink-0 text-indigo-200"
                                  aria-hidden="true"
                                />
                                <div className="ml-4">
                                  <p className="text-base font-medium text-white whitespace-nowrap">
                                    {item.name}
                                  </p>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={classNames(
                        open ? "text-white" : "text-gray-300",
                        "border-transparent focus:border-transparent focus:ring-offset-0 group inline-flex items-center rounded-md bg-transparent text-base font-medium hover:text-white focus:outline-none"
                      )}
                    >
                      <span>Utilitários</span>
                      <ChevronDownIcon
                        className={classNames(
                          open ? "text-white" : "text-gray-300",
                          "ml-2 h-5 w-5 group-hover:text-white"
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute z-50 -ml-4 mt-3 w-screen max-w-[13rem] transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="relative grid gap-6 bg-black opacity-90 border-gray-900 border-2 rounded-lg px-5 py-6 sm:gap-8 sm:p-8">
                            {utilitarios.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-900"
                                target="_blank"
                              >
                                <item.icon
                                  className="h-6 w-6 flex-shrink-0 text-indigo-200"
                                  aria-hidden="true"
                                />
                                <div className="ml-4">
                                  <p className="text-base font-medium text-gray-200 whitespace-nowrap">
                                    {item.name}
                                  </p>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={classNames(
                        open ? "text-white" : "text-gray-300",
                        "border-transparent focus:border-transparent focus:ring-offset-0 group inline-flex items-center rounded-md bg-transparent text-base font-medium hover:text-white focus:outline-none"
                      )}
                    >
                      <span>Empresas</span>
                      <ChevronDownIcon
                        className={classNames(
                          open ? "text-white" : "text-gray-300",
                          "ml-2 h-5 w-5 group-hover:text-white"
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute z-50 -ml-4 mt-3 transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="relative grid gap-6 bg-black opacity-90 border-gray-900 border-2 rounded-lg px-5 py-6 sm:gap-8 sm:p-8">
                            {empresasParceiras.map((item) => (
                              <a
                                key={item.name}
                                href={item.link}
                                className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-900"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <TableCellsIcon
                                  className="h-6 w-6 flex-shrink-0 text-indigo-200"
                                  aria-hidden="true"
                                />
                                <div className="ml-4">
                                  <p className="text-base font-medium text-gray-200 whitespace-nowrap">
                                    {item.name}
                                  </p>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </Popover.Group>
            <div className="hidden items-center justify-end lg:flex md:flex-1 lg:w-0">
              <button
                type="button"
                className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-lg bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <Image
                      className="h-8 w-8 rounded-lg "
                      src={
                        currentUser?.image
                          ? currentUser?.image!
                          : `/images/Default-user-picture.webp`
                      }
                      height={30}
                      width={30}
                      alt="user picture"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black border-gray-900 border-2 opacity-90 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-900" : "",
                            "block px-4 py-2 text-sm text-gray-200"
                          )}
                        >
                          Meu Perfil
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? "bg-gray-900 " : "",
                            "block px-4 py-2 text-sm text-gray-200"
                          )}
                        >
                          Configurações
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: "/" });
                          }}
                          className={classNames(
                            active ? "bg-gray-900 w-full" : "",
                            "block px-4 py-2 text-sm text-gray-200 w-full text-start"
                          )}
                        >
                          Sair
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute z-50 inset-x-0 top-0 origin-top-right transform p-2 transition lg:hidden"
            >
              <div className=" rounded-lg bg-black shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-5 pt-5 pb-4 ">
                  <div className="flex items-center justify-between border-b-2 border-gray-900 w-auto pb-4">
                    <div className="flex items-center ">
                      <Image
                        className="h-10 w-auto rounded-lg border-2 border-gray-800"
                        src={
                          currentUser?.image
                            ? currentUser?.image!
                            : `/images/Default-user-picture.webp`
                        }
                        height={30}
                        width={50}
                        alt="user picture"
                      />
                      <span className="pl-3 text-xl font-bold text-white">
                        {currentUser?.name}
                      </span>
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="border-transparent focus:border-transparent focus:ring-0 inline-flex items-center justify-center rounded-md bg-transparent p-2 text-gray-400 hover:bg-gray-900 hover:text-gray-500 focus:outline-none">
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <nav className="grid gap-y-8 border-b-2 border-gray-900 pb-6">
                      <Link
                        href="/ss/solutionBank"
                        className="px-2 text-base font-medium text-gray-300 hover:text-white"
                      >
                        Banco de soluções
                      </Link>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="rounded-md flex w-full items-center justify-between px-2 text-left font-medium text-gray-200 focus:outline-none">
                              Agendas
                              <ChevronRightIcon
                                className={
                                  open
                                    ? "rotate-90 transform h-8 w-auto"
                                    : "h-8 w-auto"
                                }
                              />
                            </Disclosure.Button>
                            <Transition
                              enter="transition duration-100 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Disclosure.Panel className="text-gray-200 bg-gray-900 px-2 rounded-md mr-2 ">
                                {schedules.map((item: any) =>
                                  item.month > date.getMonth() ? (
                                    <a
                                      key={item.id}
                                      href={item.link}
                                      className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-700"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <CalendarIcon
                                        className="h-6 w-6 flex-shrink-0 text-white"
                                        aria-hidden="true"
                                      />
                                      <span className="ml-3 text-base font-medium text-gray-200">
                                        {`Agenda ${item.company} ${
                                          month[item.month - 1]
                                        }`}
                                      </span>
                                    </a>
                                  ) : (
                                    ""
                                  )
                                )}
                              </Disclosure.Panel>
                            </Transition>
                          </>
                        )}
                      </Disclosure>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full items-center justify-between px-2 text-left font-medium text-gray-200 focus:outline-none">
                              Mapas
                              <ChevronRightIcon
                                className={
                                  open
                                    ? "rotate-90 transform h-8 w-auto"
                                    : "h-8 w-auto"
                                }
                              />
                            </Disclosure.Button>
                            <Transition
                              enter="transition duration-100 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Disclosure.Panel className="text-gray-200 bg-gray-900 px-2 rounded-md mr-2 ">
                                {mapas.map((item) => (
                                  <a
                                    key={item.name}
                                    href={item.href}
                                    className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-700"
                                    target="_blank"
                                  >
                                    <item.icon
                                      className="h-6 w-6 flex-shrink-0 text-white"
                                      aria-hidden="true"
                                    />
                                    <span className="ml-3 text-base font-medium text-gray-200">
                                      {item.name}
                                    </span>
                                  </a>
                                ))}
                              </Disclosure.Panel>
                            </Transition>
                          </>
                        )}
                      </Disclosure>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full items-center justify-between px-2 text-left font-medium text-gray-200 focus:outline-none">
                              Utilitários
                              <ChevronRightIcon
                                className={
                                  open
                                    ? "rotate-90 transform h-8 w-auto"
                                    : "h-8 w-auto"
                                }
                              />
                            </Disclosure.Button>
                            <Transition
                              enter="transition duration-100 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Disclosure.Panel className="text-gray-200 bg-gray-900 px-2 rounded-md mr-2 ">
                                {utilitarios.map((item) => (
                                  <a
                                    key={item.name}
                                    href={item.href}
                                    className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-700"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <item.icon
                                      className="h-6 w-6 flex-shrink-0 text-white"
                                      aria-hidden="true"
                                    />
                                    <span className="ml-3 text-base font-medium text-gray-200">
                                      {item.name}
                                    </span>
                                  </a>
                                ))}
                              </Disclosure.Panel>
                            </Transition>
                          </>
                        )}
                      </Disclosure>
                      <Disclosure>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full items-center justify-between px-2 text-left font-medium text-gray-200 focus:outline-none">
                              Empresas
                              <ChevronRightIcon
                                className={
                                  open
                                    ? "rotate-90 transform h-8 w-auto"
                                    : "h-8 w-auto"
                                }
                              />
                            </Disclosure.Button>
                            <Transition
                              enter="transition duration-100 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Disclosure.Panel className="text-gray-200 bg-gray-900 px-2 rounded-md mr-2 ">
                                {empresasParceiras.map((item) => (
                                  <a
                                    key={item.name}
                                    href={item.link}
                                    className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-700"
                                    target="_blank"
                                  >
                                    <TableCellsIcon
                                      className="h-6 w-6 flex-shrink-0 text-white"
                                      aria-hidden="true"
                                    />
                                    <span className="ml-3 text-base font-medium text-gray-200">
                                      {item.name}
                                    </span>
                                  </a>
                                ))}
                              </Disclosure.Panel>
                            </Transition>
                          </>
                        )}
                      </Disclosure>
                    </nav>
                  </div>
                </div>
                <div className="pb-6 px-5">
                  <div>
                    <a
                      href="#"
                      className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-600"
                    >
                      Meu perfil
                    </a>
                    <a
                      href="#"
                      className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-600"
                    >
                      Configurações
                    </a>
                    <a
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                      }}
                      href="#"
                      className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-600"
                    >
                      Sair
                    </a>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </nav>
    </header>
  );
}

export default Navbar;
