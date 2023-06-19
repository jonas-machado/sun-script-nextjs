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
import ComboboxInput from "../inputs/comboboxInput";
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

  const filtered =
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
        <div className="grid lg:grid-cols-[20%,40%,40%]">
          <form
            className="p-4 space-y-1 row-span-2"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <ComboboxInput
              id="olt"
              selected={selected}
              onChange={setSelected}
              onChangeInput={(e: any) =>
                e?.target.value != undefined
                  ? setQuery(e?.target.value)
                  : setQuery("")
              }
              filtered={filtered}
              query={query}
              label="OLT"
              placeHolder="Selecione a OLT"
            />
            <Input
              label="PON"
              placeholder="x/x/x"
              id="pon"
              register={register}
              required
            />
            <div className="w-full rounded-md border border-gray-900 bg-gray-900 py-2 px-3 text-sm font-medium leading-4 text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none">
              <button type="submit" className="flex w-full justify-center ">
                GERAR
              </button>
            </div>
          </form>
          {openTab == "Verificar posição livre" && (
            <>
              <div className="mt-4">
                <h1 className="text-gray-300">POSIÇÕES LIVRES</h1>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempora eos delectus soluta expedita eligendi dolore debitis.
                  Dicta, libero magnam excepturi sequi, voluptatum ullam
                  quibusdam blanditiis optio eaque nulla numquam vero?
                </p>
              </div>
              <div className="mt-4">
                <h1 className="text-gray-300">QUANTIDADE DE POSIÇÕES</h1>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempora eos delectus soluta expedita eligendi dolore debitis.
                  Dicta, libero magnam excepturi sequi, voluptatum ullam
                  quibusdam blanditiis optio eaque nulla numquam vero?
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-gray-300">DETAIL DAS ONUS DOWN</h1>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempora eos delectus soluta expedita eligendi dolore debitis.
                  Dicta, libero magnam excepturi sequi, voluptatum ullam
                  quibusdam blanditiis optio eaque nulla numquam vero?
                </p>
              </div>
              <div className="my-2">
                <h1 className="text-gray-300">DETAIL DAS ONUS EM LOS</h1>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempora eos delectus soluta expedita eligendi dolore debitis.
                  Dicta, libero magnam excepturi sequi, voluptatum ullam
                  quibusdam blanditiis optio eaque nulla numquam vero?
                </p>
              </div>
            </>
          )}
          {openTab == "Aferir CTO" && (
            <>
              <div className="mt-4 col-span-2">
                <h1 className="text-gray-300">ONU COM QUEDA RECENTEMENTE</h1>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempora eos delectus soluta expedita eligendi dolore debitis.
                  Dicta, libero magnam excepturi sequi, voluptatum ullam
                  quibusdam blanditiis optio eaque nulla numquam vero?
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="container mt-2 p-4 text-gray-300 bg-black backdrop-blur bg-opacity-80 w-11/12 mx-auto rounded-xl">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur
        voluptatibus quibusdam adipisci impedit nam reiciendis ad quia corrupti
        facilis optio exercitationem earum, excepturi nemo quas beatae molestiae
        tempora hic ipsum?
      </div>
    </>
  );
};

export default PonVerificationForm;
