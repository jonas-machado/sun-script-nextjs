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
  const [text, setText] = useState<string>();
  const [quantidadeOnu, setQuantidadeOnu] = useState<string>();
  const [textPl, setTextPl] = useState<number>();
  const [idLivre, setIdLivre] = useState<number[]>([]);
  const [onuDown, setOnuDown] = useState<string[]>();
  const [onuLos, setOnuLos] = useState<string[]>();
  const [onuDyingGasp, setOnuDyingGasp] = useState<string[]>();
  const [onuOff, setOnuOff] = useState<string[]>();

  const [selected, setSelected] = useState<any>();
  const [query, setQuery] = useState("");

  const session = useSession();
  const router = useRouter();

  const olts = oltZteChimaData.concat(oltIntelbrasData, oltDatacomData);

  useEffect(() => {
    if (session?.status == "unauthenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onDetail = (ont: any, todos?: boolean) => {
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
      const res = response.replace(//g, "");
      setText(res);
      socket.disconnect();

      // Do something with the received data in the frontend
    });
    if (!todos) {
      socket.emit("connectTelnet", {
        ip: selected.ip,
        command: `show gpon onu detail-info gpon-onu_${ont}`,
        //command: `show clock`,
      });
    } else {
      for (let i = 0; i < ont.length; i++) {
        socket.emit("connectTelnet", {
          ip: selected.ip,
          command: `show gpon onu detail-info gpon-onu_${ont}`,
          //command: `show clock`,
        });
      }
    }
  };

  const onSubmit = ({ pon }: any) => {
    setIdLivre([]);
    if (openTab == "Verificar posição livre") {
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
        const res = response.replace(//g, "").split("\n");
        const toMatch = res.filter((el: any) => el.includes("ONU Number"));
        const onuTotal = res.filter((el: any) => el.includes(`${pon}:`));
        const startString = "ONU Number: ";
        const teste = res
          .filter((onu: any) => onu.includes("OffLine"))
          .map((el: any) => el.split(" ")[0]);
        console.log(teste);
        // Create a regular expression pattern using the start and end strings
        const pattern = `${startString}(.*)`;

        // Execute the regular expression and retrieve the captured substring
        const match = toMatch[0].match(new RegExp(pattern));
        if (match && match.length > 1) {
          const capturedSubstring = match[1];
          console.log(`${pon}:`);
          setQuantidadeOnu(capturedSubstring);
        }
        setOnuDown(
          res
            .filter((onu: any) => !onu.includes("working"))
            .map((el: any) => el.split(" ")[0])
        );
        setOnuDyingGasp(
          res
            .filter((onu: any) => onu.includes("DyingGasp"))
            .map((el: any) => el.split(" ")[0])
        );
        setOnuOff(
          res
            .filter((onu: any) => onu.includes("OffLine"))
            .map((el: any) => el.split(" ")[0])
        );
        setOnuLos(
          res
            .filter((onu: any) => onu.includes("LOS"))
            .map((el: any) => el.split(" ")[0])
        );
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

        // Do something with the received data in the frontend
      });

      socket.emit("connectTelnet", {
        ip: selected.ip,
        command: `show gpon onu state gpon-olt_${pon}`,
        //command: `show clock`,
      });

      // Disconnect from the server
    }
    if (openTab == "Aferir CTO") {
      setText("");
    }
  };

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
              <div className="w-full rounded-md border border-gray-900 bg-gray-900 py-2 px-3 text-sm font-medium leading-4 text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none">
                <button type="submit" className="flex w-full justify-center ">
                  GERAR
                </button>
              </div>
            </form>
            {openTab == "Verificar posição livre" && (
              <div className="bg-gray-900 bg-opacity-60 rounded-xl py-2 m-4">
                <div className="m-4 ">
                  <h1 className="text-gray-300 text-md font-bold">
                    INFORMAÇÕES DA PON
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
                  <h1 className="text-gray-300 text-xl font-bold">ID Livres</h1>
                  <div className="mt-4">
                    <p className="text-gray-300">{idLivre?.join(" // ")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {openTab == "Verificar posição livre" && (
            <>
              <div className="my-2">
                <h1 className="text-gray-300 text-xl font-bold text-center">
                  DETAIL DAS ONUS OFFLINE
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
                  <button className="text-gray-300 bg-gray-900 bg-opacity-80 p-1 hover:bg-gray-700 transition-all rounded-md">
                    TODOS
                  </button>
                </div>
              </div>
              <div className="my-2">
                <h1 className="text-gray-300 text-xl font-bold text-center">
                  DETAIL DAS ONUS EM LOS
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
                  DETAIL DAS ONUS EM DYINGGASP
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
                  <button className="text-gray-300 bg-gray-900 bg-opacity-80 p-1 hover:bg-gray-700 transition-all rounded-md">
                    TODOS
                  </button>
                </div>
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
      <div className="container mt-2 p-4 text-gray-300 bg-black backdrop-blur bg-opacity-80 w-11/12 mx-auto rounded-xl whitespace-pre-line">
        {text}
      </div>
    </>
  );
};

export default PonVerificationForm;
