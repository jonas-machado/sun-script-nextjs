"use client";

import { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import TabBody from "@/components/tab/TabBody";
import TabHead from "@/components/tab/TabHead";
import Input from "@/components/inputs/inputLabelUseForm";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { socket } from "@/lib/socket";
import ComboboxInput from "../inputs/comboboxInput";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyPon from "../ponVerification/VerifyZTE";
import VerifyCTO from "../ponVerification/VerifyCTO";

//constants
const tabNames = [
  "Verificar posição livre",
  "Aferir CTO",
  "Diagnosticar ONT",
  "Diagnosticar Rádio",
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
  const [response, setResponse] = useState<any>();
  const [selected, setSelected] = useState<any>();

  const session = useSession();
  const router = useRouter();

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

  const notify = (text: any) => {
    console.log("toast running");
    toast.error(text, {
      theme: "dark",
      pauseOnFocusLoss: false,
      pauseOnHover: false,
    });
  };

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

  useEffect(() => {
    // Handle connection event
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    // Handle disconnection event
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    function onTelnetResponse(value: any) {
      setResponse(value);
    }

    socket.on("telnet response", onTelnetResponse);

    return () => {
      socket.off("telnet response", onTelnetResponse);
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const onDetail = (ont: any, todos?: boolean) => {
    setText("");

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

    if (selected?.brand == "ZTE") {
      // Handle "chat message" event
      console.log(response);
      const res = response.replace(//g, "");
      setText((prev) => prev + res);
      if (todos) {
        if (i == ont.length) {
          socket.disconnect();
        }
        i++;
      }
    }
    if (selected?.brand == "DATACOM") {
    }
  };

  const onSubmit = async ({ pon }: any) => {
    setText("");
    setIdLivre([]);
    setResponse("");

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
        command: `do show interface gpon ${pon} onu`,
        brand: selected.brand,
      });
    }
    if (openTab == "Verificar posição livre") {
      // Handle "chat message" event
      if (selected.brand == "ZTE") {
        console.log(response);
        if (response.includes("Error")) {
          return notify("Pon vazia");
        }
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
      }
      if (selected.brand == "DATACOM") {
        console.log(response);
        setText(response);
        const res = response
          .split("\n")
          .filter((el: any) => el.includes(`${pon}`));

        const include = (value: any, find: any, not?: boolean) => {
          return value
            .filter((onu: any) =>
              not ? !onu.includes(find) : onu.includes(find)
            )
            .map((el: any) => el.split(" ").filter((str: any) => str != "")[1]);
        };
        setQuantidadeOnu(res.length);

        setOnuDown(include(res, "Down"));
        setText(res.join("\n"));

        for (let i = 1; i <= 128; i++) {
          const idToCheck = ` ${i} `;
          const verify: any = response.includes(idToCheck);
          console.log(verify);
          if (!verify) {
            setIdLivre((prevState) => [...prevState, i]);
          }
        }
        socket.disconnect();
      }
      socket.off("telnet response");
    }
    if (openTab == "Aferir CTO") {
      const res = response.replace(//g, "").split("\n");
      const onuTotal = res.filter((el: any) => el.includes(`${pon}:`));

      setText(onuTotal.join("\n"));
      socket.disconnect();
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
        <div className="h-full w-full">
          <AnimatePresence mode="wait">
            {openTab == "Verificar posição livre" && (
              <motion.div
                key="pon"
                initial={{ opacity: 0.5, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <VerifyPon olt={olt} />
              </motion.div>
            )}
            {openTab == "Aferir CTO" && (
              <motion.div
                key="cto"
                initial={{ opacity: 0.5, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <VerifyCTO key={`cto`} olt={olt} />
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
      <ToastContainer />
    </>
  );
};

export default PonVerificationForm;
