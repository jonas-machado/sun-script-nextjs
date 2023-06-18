"use client";

import { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import TabBody from "@/app/components/tab/TabBody";
import TabHead from "@/app/components/tab/TabHead";
import TextAreaUseForm from "../inputs/textAreaLabelUseForm";
import ControlledInput from "../inputs/controlledInput";
import Input from "@/app/components/inputs/inputLabelUseForm";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
//constants

const tabNames = ["Verificar posição livre", "Aferir CTO"];

interface ConfigProps {
  oltZteChimaData: any;
  oltIntelbrasData: any;
  oltDatacomData: any;
}

const PonVerificationForm = ({
  oltZteChimaData,
  oltIntelbrasData,
  oltDatacomData,
}: ConfigProps) => {
  const [openTab, setOpenTab] = useState("Verificar posição livre");
  const [text, setText] = useState("");

  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");

  const session = useSession();
  const router = useRouter();

  const olts = oltZteChimaData.concat(oltIntelbrasData, oltDatacomData);
  console.log(olts);

  useEffect(() => {
    if (session?.status == "unauthenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = ({
    base,
    client,
    protocol,
    addres,
    sla,
    name,
    tel,
    description,
    cda,
    loc,
    clientLost,
  }: any) => {
    if (openTab == "Verificar posição livre") {
      setText("");
    }
    if (openTab == "Aferir CTO") {
      setText("");
    }
  };

  const filteredOlt =
    query === ""
      ? olts
      : olts.filter((olt: any) =>
          olt.olt
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <>
      <div className="container bg-black backdrop-blur bg-opacity-80 w-11/12 mx-auto rounded-xl">
        <TabBody>
          {tabNames.map((tab) => (
            <TabHead
              key={tab}
              state={openTab}
              id={tab}
              onClick={() => setOpenTab(tab)}
            >
              {tab}
            </TabHead>
          ))}
        </TabBody>
        <div className="grid lg:grid-cols-1">
          <form className="p-4 space-y-1" onSubmit={handleSubmit(onSubmit)}>
            {openTab == "Verificar posição livre" && (
              <>
                <Combobox value={selected} onChange={setSelected}>
                  <div className="relative mt-1">
                    <div className="flex relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none sm:text-sm">
                      <label
                        htmlFor="olt"
                        className="inline-flex items-center rounded-l-md border border-r-0 border-gray-900 bg-gray-700 bg-opacity-70 px-3 text-sm text-gray-200"
                      >
                        OLT
                      </label>
                      <Combobox.Input
                        id="olt"
                        placeholder="Selecione a OLT"
                        className="w-full border-none outline-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-300 bg-gray-900 bg-opacity-70"
                        displayValue={(olt: any) => olt}
                        onChange={(event) => setQuery(event.target.value)}
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
                      afterLeave={() => setQuery("")}
                    >
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredOlt.length === 0 && query !== "" ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-300">
                            Nothing found.
                          </div>
                        ) : (
                          filteredOlt.map((olt: any) => (
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
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
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
                <Input
                  label="PON"
                  placeholder="x/x/x"
                  id="pon"
                  register={register}
                  required
                />
              </>
            )}
            {openTab == "padraoManutencao" && <></>}
            <div className="w-full rounded-md border border-gray-900 bg-gray-900 py-2 px-3 text-sm font-medium leading-4 text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none">
              <button type="submit" className="flex w-full justify-center ">
                GERAR
              </button>
            </div>
          </form>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="m-4 mt-0 overflow-hidden min-h-[20rem] bg-gray-900 bg-opacity-70 outline-none p-4 rounded-md text-gray-300"
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default PonVerificationForm;
