"use client";

import { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import TabBody from "@/components/tab/TabBody";
import TabHead from "@/components/tab/TabHead";
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
  const [response, setResponse] = useState<any>();
  const [multipleResponse, setMultipleResponse] = useState<string[]>([]);
  console.log(response);
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

    function onMultipleResponse(value: any) {
      setMultipleResponse(value);
    }

    socket.on("telnet response", onTelnetResponse);
    socket.on("multipleResponse", onMultipleResponse);

    return () => {
      socket.off("telnet response", onTelnetResponse);
      socket.off("multipleResponse", onMultipleResponse);
    };
  }, []);

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
                <VerifyPon
                  olt={olt}
                  response={response}
                  multipleResponse={multipleResponse}
                />
              </motion.div>
            )}
            {openTab == "Aferir CTO" && (
              <motion.div
                key="cto"
                initial={{ opacity: 0.5, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <VerifyCTO olt={olt} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default PonVerificationForm;
