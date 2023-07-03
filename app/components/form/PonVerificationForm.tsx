"use client";

import { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import TabBody from "@/app/components/tab/TabBody";
import TabHead from "@/app/components/tab/TabHead";
import Input from "@/app/components/inputs/inputLabelUseForm";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import io from "socket.io-client";
import ComboboxInput from "../inputs/comboboxInput";
import { AnimatePresence, motion } from "framer-motion";
import ControlledInputDescription from "../inputs/controlledInputDescription";
//constants

const tabNames = ["Verificar posição livre", "Aferir CTO"];
const oltSelect = [
  {
    name: "ZTE",
    description: `Aferir pon\nZTE`,
  },
  {
    name: "DATACOM",
    description: "Aferir pon\nDATACOM",
  },
];

interface ConfigProps {
  olt: any;
}

const PonVerificationForm = ({ olt }: ConfigProps) => {
  const [openTab, setOpenTab] = useState("Verificar posição livre");
  const [text, setText] = useState<string>("");
  const [quantidadeOnu, setQuantidadeOnu] = useState<string>("");
  const [idLivre, setIdLivre] = useState<number[]>([]);
  const [onuDown, setOnuDown] = useState<string[]>([]);
  const [onuLos, setOnuLos] = useState<string[]>([]);
  const [onuDyingGasp, setOnuDyingGasp] = useState<string[]>([]);
  const [onuOff, setOnuOff] = useState<string[]>([]);

  const [selected, setSelected] = useState<any>();

  const session = useSession();
  const router = useRouter();

  const olts = olt;

  useEffect(() => {
    if (session?.status == "unauthenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset();
    setText("");
    setQuantidadeOnu("");
    setIdLivre([]);
    setOnuDown([]);
    setOnuLos([]);
    setOnuDyingGasp([]);
    setOnuOff([]);
  }, [openTab]);

  let i = 1;

  const onDetail = (ont: any, todos?: boolean) => {
    setText("");
    const socket = io("http://localhost:3001");

    // Handle connection event
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    // Handle disconnection event
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Handle "chat message" event
    socket.on("telnet response", (response) => {
      console.log(response);
      const res = response.replace(//g, "");
      setText((prev) => prev + res);
      if (todos) {
        if (i == ont.length) {
          socket.disconnect();
        }
        i++;
      }
    });
    if (!todos) {
      socket.emit("connectTelnet", {
        ip: selected.ip,
        command: `show gpon onu detail-info gpon-onu_${ont}`,
      });
    } else {
      socket.emit("multipleCommands", {
        ip: selected.ip,
        commands: ont.map(
          (el: any) => `show gpon onu detail-info gpon-onu_${el}`
        ),
      });
    }
  };

  const onSubmit = async ({ pon }: any) => {
    setText("");
    setIdLivre([]);
    const socket = io("http://localhost:3001");

    // Handle connection event
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    // Handle disconnection event
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    if (selected.brand == "ZTE") {
      socket.emit("connectTelnet", {
        ip: selected.ip,
        command: `show gpon onu state gpon-olt_${pon}`,
        brand: selected.brand,
      });
    }
    if (selected.brand == "DATACOM") {
      socket.emit("connectTelnetDatacom", {
        ip: selected.ip,
        commands: [`conf t`, `do show interface gpon ${pon} onu`],
        brand: selected.brand,
      });
    }
    if (openTab == "Verificar posição livre") {
      // Handle "chat message" event
      if (selected.brand == "ZTE") {
        socket.on("telnet response", (response) => {
          const res = response.replace(//g, "").split("\n");
          const toMatch = res.filter((el: any) => el.includes("ONU Number"));
          const onuTotal = res.filter((el: any) => el.includes(`${pon}:`));
          const startString = "ONU Number: ";

          // Create a regular expression pattern using the start and end strings
          const pattern = `${startString}(.*)`;

          // Execute the regular expression and retrieve the captured substring
          const match = toMatch[0]?.match(new RegExp(pattern));
          if (match && match.length > 1) {
            const capturedSubstring = match[1];
            setQuantidadeOnu(capturedSubstring);
          }

          const exception = [
            "BS02",
            "ITAPOA",
            "ITINGA",
            "MIRANDA",
            "ITACOLOMI",
            "VILA NOVA",
          ];
          const include = (value: any, find: any, not?: boolean) => {
            if (exception.includes(selected.olt)) {
              return value
                .filter((onu: any) =>
                  not ? !onu.includes(find) : onu.includes(find)
                )
                .map(
                  (el: any) =>
                    el
                      .split(" ")
                      .filter((str: any) => str != "")[0]
                      .split("_")[1]
                );
            } else {
              return value
                .filter((onu: any) =>
                  not ? !onu.includes(find) : onu.includes(find)
                )
                .map(
                  (el: any) => el.split(" ").filter((str: any) => str != "")[0]
                );
            }
          };
          setOnuDown(include(onuTotal, "working", true));
          setOnuDyingGasp(include(onuTotal, "DyingGasp"));
          setOnuOff(include(onuTotal, "OffLine"));
          setOnuLos(include(onuTotal, "LOS"));
          setText(onuTotal.join("\n"));

          for (let i = 1; i <= 128; i++) {
            const idToCheck = `${pon}:${i} `;
            const verify = response.includes(idToCheck);
            if (verify) {
            } else {
              setIdLivre((prevState) => [...prevState, i]);
            }
          }
          socket.disconnect();
        });
      }
      if (selected.brand == "DATACOM") {
        socket.on("telnet response", async (response) => {
          console.log(response);
          setText(response);
          // const res = response.replace(//g, "").split("\n");
          // const toMatch = res.filter((el: any) => el.includes("ONU Number"));
          // const onuTotal = res.filter((el: any) => el.includes(`${pon}:`));
          // const startString = "ONU Number: ";

          // // Create a regular expression pattern using the start and end strings
          // const pattern = `${startString}(.*)`;

          // // Execute the regular expression and retrieve the captured substring
          // const match = toMatch[0]?.match(new RegExp(pattern));
          // if (match && match.length > 1) {
          //   const capturedSubstring = match[1];
          //   setQuantidadeOnu(capturedSubstring);
          // }

          // const exception = [
          //   "BS02",
          //   "ITAPOA",
          //   "ITINGA",
          //   "MIRANDA",
          //   "ITACOLOMI",
          //   "VILA NOVA",
          // ];
          // const include = (value: any, find: any, not?: boolean) => {
          //   if (exception.includes(selected.olt)) {
          //     return value
          //       .filter((onu: any) =>
          //         not ? !onu.includes(find) : onu.includes(find)
          //       )
          //       .map(
          //         (el: any) =>
          //           el
          //             .split(" ")
          //             .filter((str: any) => str != "")[0]
          //             .split("_")[1]
          //       );
          //   } else {
          //     return value
          //       .filter((onu: any) =>
          //         not ? !onu.includes(find) : onu.includes(find)
          //       )
          //       .map(
          //         (el: any) => el.split(" ").filter((str: any) => str != "")[0]
          //       );
          //   }
          // };
          // setOnuDown(include(onuTotal, "working", true));
          // setOnuDyingGasp(include(onuTotal, "DyingGasp"));
          // setOnuOff(include(onuTotal, "OffLine"));
          // setOnuLos(include(onuTotal, "LOS"));
          // setText(onuTotal.join("\n"));

          // for (let i = 1; i <= 128; i++) {
          //   const idToCheck = `${pon}:${i} `;
          //   const verify = response.includes(idToCheck);
          //   if (verify) {
          //   } else {
          //     setIdLivre((prevState) => [...prevState, i]);
          //   }
          // }
          socket.disconnect();
        });
      }
    }
    if (openTab == "Aferir CTO") {
      socket.on("telnet response", (response) => {
        const res = response.replace(//g, "").split("\n");
        const onuTotal = res.filter((el: any) => el.includes(`${pon}:`));

        setText(onuTotal.join("\n"));
        socket.disconnect();
      });
    }
  };

  return (
    <>
      <div className="container relative bg-black backdrop-blur bg-opacity-80 w-11/12 mx-auto rounded-xl z-20">
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
        <div className="grid lg:grid-cols-4">
          <div>
            <form
              className="p-4 space-y-1 row-span-2"
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
            >
              <ComboboxInput
                id="olt"
                selected={selected}
                onChange={setSelected}
                label="OLT"
                placeHolder="Selecione a OLT"
                oltCompanyArray={olts}
              />
              <Input
                label="PON"
                placeholder="x/x/x"
                id="pon"
                register={register}
                required
              />
              <div className="w-full ">
                <button
                  type="submit"
                  className="flex w-full justify-center py-2 px-3 rounded-md border border-gray-900 bg-gray-900  text-sm font-medium leading-4 text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none"
                >
                  GERAR
                </button>
              </div>
            </form>
            <AnimatePresence mode="wait">
              {openTab == "Verificar posição livre" && (
                <motion.div
                  initial={{ opacity: 0.5, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-900 bg-opacity-60 rounded-xl py-2 m-4 mt-0"
                >
                  <div className="m-4 ">
                    <h1 className="text-gray-300 text-md font-bold">
                      INFORMAÇÕES
                    </h1>
                    <div className="mt-4">
                      <p className="text-gray-300">
                        ONTs configuradas: {quantidadeOnu}
                      </p>
                      <p className="text-gray-300">
                        Quantidade DOWN: {onuDown?.length}
                      </p>
                      <p className="text-gray-300">
                        Equipamentos em LOS: {onuLos?.length}
                      </p>
                      <p className="text-gray-300">
                        Equipamentos em DYINGGASP: {onuDyingGasp?.length}
                      </p>
                      <p className="text-gray-300">
                        Equipamentos OFFLINE: {onuOff?.length}
                      </p>
                    </div>
                  </div>
                  <div className="m-4">
                    <h1 className="text-gray-300 text-xl font-bold">
                      ID Livres
                    </h1>
                    <div className="mt-4">
                      <p className="text-gray-300">{idLivre?.join(" // ")}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            {openTab == "Verificar posição livre" && (
              <motion.div
                key={`pon`}
                className="grid w-full col-span-3 grid-cols-3"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="my-2">
                  <h1 className="text-gray-300 text-xl font-bold text-center">
                    DETAIL OFFLINE
                  </h1>
                  <div className="flex flex-col gap-1 m-4">
                    {onuOff?.map((onu: any) => (
                      <>
                        <button
                          key={onu}
                          onClick={() => onDetail(onu)}
                          className="text-gray-300 bg-gray-900 bg-opacity-80 p-1 hover:bg-gray-700 transition-all rounded-md"
                        >
                          {onu}
                        </button>
                      </>
                    ))}
                    <button
                      onClick={() => onDetail(onuOff, true)}
                      className="text-gray-300 bg-gray-900 bg-opacity-80 p-1 hover:bg-gray-700 transition-all rounded-md"
                    >
                      TODOS
                    </button>
                  </div>
                </div>
                <div className="my-2">
                  <h1 className="text-gray-300 text-xl font-bold text-center">
                    DETAIL LOS
                  </h1>
                  <div className="flex flex-col gap-1 m-4">
                    {onuLos?.map((onu: any) => (
                      <>
                        <button
                          key={onu}
                          onClick={() => onDetail(onu)}
                          className="text-gray-300 bg-gray-900 bg-opacity-80 p-1 hover:bg-gray-700 transition-all rounded-md"
                        >
                          {onu}
                        </button>
                      </>
                    ))}
                    <button
                      onClick={() => onDetail(onuLos, true)}
                      className="text-gray-300 bg-gray-900 bg-opacity-80 p-1 hover:bg-gray-700 transition-all rounded-md"
                    >
                      TODOS
                    </button>
                  </div>
                </div>
                <div className="my-2">
                  <h1 className="text-gray-300 text-xl font-bold text-center">
                    DETAIL DYINGGASP
                  </h1>
                  <div className="flex flex-col gap-1 m-4">
                    {onuDyingGasp?.map((onu: any) => (
                      <>
                        <button
                          key={onu}
                          onClick={() => onDetail(onu)}
                          className="text-gray-300 bg-gray-900 bg-opacity-80 p-1 hover:bg-gray-700 transition-all rounded-md"
                        >
                          {onu}
                        </button>
                      </>
                    ))}
                    <button
                      onClick={() => onDetail(onuDyingGasp, true)}
                      className="text-gray-300 bg-gray-900 bg-opacity-80 p-1 hover:bg-gray-700 transition-all rounded-md"
                    >
                      TODOS
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            {openTab == "Aferir CTO" && (
              <motion.div
                key={`cto`}
                className="mt-4 col-span-2"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-gray-300">ONU COM QUEDA RECENTEMENTE</h1>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempora eos delectus soluta expedita eligendi dolore debitis.
                  Dicta, libero magnam excepturi sequi, voluptatum ullam
                  quibusdam blanditiis optio eaque nulla numquam vero?
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex justify-center">
        <textarea
          readOnly
          value={text}
          className="container mt-2 p-4 h-screen scrollbar-corner-transparent resize-none scrollbar-thumb-rounded-md scrollbar-thin scrollbar-thumb-gray-800 outline-none scrollbar-track-transparent text-gray-300 bg-black backdrop-blur bg-opacity-80 w-11/12 mx-auto rounded-xl whitespace-pre-line"
        />
      </div>
    </>
  );
};

export default PonVerificationForm;
