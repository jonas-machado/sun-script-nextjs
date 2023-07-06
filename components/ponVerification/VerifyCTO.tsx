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

const VerifyCTO = ({ olt }: any) => {
  const [text, setText] = useState<string>("");
  const [quantidadeOnu, setQuantidadeOnu] = useState<string>("");
  const [idLivre, setIdLivre] = useState<number[]>([]);
  const [onuDown, setOnuDown] = useState<string[]>([]);
  const [onuLos, setOnuLos] = useState<string[]>([]);
  const [onuDyingGasp, setOnuDyingGasp] = useState<string[]>([]);
  const [onuOff, setOnuOff] = useState<string[]>([]);
  const [response, setResponse] = useState<any>();
  const [selected, setSelected] = useState<any>();

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

  const onSubmit = async ({ pon }: any) => {
    const res = response.replace(//g, "").split("\n");
    const onuTotal = res.filter((el: any) => el.includes(`${pon}:`));

    setText(onuTotal.join("\n"));
    socket.disconnect();
  };
  return (
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
            oltCompanyArray={olt}
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
      </div>
      <div className="mt-4 col-span-2">
        <h1 className="text-gray-300">ONU COM QUEDA RECENTEMENTE</h1>
        <p className="text-gray-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora eos
          delectus soluta expedita eligendi dolore debitis. Dicta, libero magnam
          excepturi sequi, voluptatum ullam quibusdam blanditiis optio eaque
          nulla numquam vero?
        </p>
      </div>
    </div>
  );
};

export default VerifyCTO;
