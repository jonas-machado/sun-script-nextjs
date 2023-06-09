"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import TabBody from "@/components/tab/TabBody";
import TabHead from "@/components/tab/TabHead";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import TextAreaUseForm from "../inputs/textAreaLabelUseForm";
import ControlledInput from "../inputs/controlledInput";
import Input from "@/components/inputs/inputLabelUseForm";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
//constants
import { tabScript } from "@/constants/tabScript";
import { bases } from "@/constants/bases";
import { sla } from "@/constants/sla";
import { AnimatePresence, motion } from "framer-motion";

const ScriptForm = ({ currentUser }: { currentUser?: User | null }) => {
  const [openTab, setOpenTab] = useState("padraoEmail");

  const [text, setText] = useState("");

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
    control,
    reset,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inputs",
  });

  useEffect(() => {
    reset();
    setText("");
  }, [openTab]);

  const handleAddInput = () => {
    append({ input: "" });
  };

  const handleRemoveInput = (index: number) => {
    remove(index);
  };

  const onSubmit = (value: any) => {
    console.log(value);
    if (openTab == "padraoEmail") {
      setText(`\
Chamado aberto: ${value.base} ${value.client} - SLA ${value.sla}

Cliente: ${value.client}
Protocolo: ${value.protocol}
Endereço: ${value.addres}
SLA: ${value.sla}
Responsável pelo atendimmento: ${value.name} // ${value.tel}

Qualquer dúvida entrar em contato.
Mais informações na O.S.

att,

${currentUser?.name.split(" ").slice(0, 2).join(" ")}.
      `);
    }
    if (openTab == "padraoManutencao") {
      const filtered = bases.filter((bs: any) => bs.name.includes(value.base));
      setText(`\
Protocolo: ${value.protocol}
Motivo: ${value.description}
Cliente afetado: ${value.clientLost}
${value.inputs.map((input: any) => `${input.cda}\n${input.loc}`).join("\n")}
Chamado aberto: ${value.base} ${filtered[0].maintenance}
      `);
    }
  };
  return (
    <div className="container bg-black bg-opacity-80 backdrop-blur w-11/12 mx-auto rounded-xl">
      <TabBody>
        {tabScript.map((tab) => (
          <TabHead
            key={tab.id}
            state={openTab}
            id={tab.id}
            onClick={() => setOpenTab(tab.id)}
          >
            {tab.name}
          </TabHead>
        ))}
      </TabBody>
      <div className="grid lg:grid-cols-[40%,60%]">
        <form
          className="flex flex-col gap-2 p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <AnimatePresence mode="wait">
            {openTab == "padraoEmail" && (
              <motion.div
                key={`email`}
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div>
                  <ControlledInput
                    name="base"
                    array={bases}
                    control={control}
                  />
                </div>
                <Input
                  label="CLIENTE"
                  placeholder="Nome e código"
                  id="client"
                  register={register}
                  required
                />

                <Input
                  label="PROTOCOLO"
                  placeholder="20230000000000"
                  id="protocol"
                  register={register}
                  required
                />
                <TextAreaUseForm
                  label="ENDEREÇO"
                  placeholder="Endereço"
                  id="addres"
                  register={register}
                  required
                />
                <div>
                  <ControlledInput name="sla" array={sla} control={control} />
                </div>
                <Input
                  label="RESPONSÁVEL"
                  placeholder="Nome"
                  id="name"
                  register={register}
                  required
                />
                <Input
                  label="TELEFONE"
                  placeholder="(xx) xxxxx-xxxx"
                  id="tel"
                  register={register}
                  required
                />
              </motion.div>
            )}
            {openTab == "padraoManutencao" && (
              <motion.div
                key={`manutencao`}
                className="flex flex-col gap-2"
                initial={{ opacity: 0.5, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div>
                  <ControlledInput
                    name="base"
                    array={bases}
                    control={control}
                  />
                </div>
                <Input
                  label="PROTOCOLO"
                  placeholder="20230000000000"
                  id="protocol"
                  register={register}
                  required
                />
                <TextAreaUseForm
                  label="MOTIVO"
                  id="description"
                  register={register}
                  required
                />
                <Input
                  label="CLIENTE"
                  placeholder="Código e nome"
                  id="clientLost"
                  register={register}
                  required
                />
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 w-full">
                    <div className="flex flex-col gap-2 w-full">
                      <Input
                        label="CDA"
                        placeholder="PON, CDA e OLT"
                        id={`inputs.${index}.cda`}
                        register={register}
                        required
                      />
                      <Input
                        label="LOCALIZAÇÃO"
                        placeholder="XX.XXXXXX,XX.XXXXXX"
                        id={`inputs.${index}.loc`}
                        register={register}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveInput(index)}
                      className="text-gray-300 flex items-center"
                    >
                      <XMarkIcon height={40} width={40} />
                    </button>
                  </div>
                ))}
                <div className="w-full rounded-md border border-gray-900 bg-gray-900 py-2 px-3 text-sm font-medium leading-4 text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none">
                  <button
                    onClick={handleAddInput}
                    type="button"
                    className="flex w-full justify-center "
                  >
                    ADICIONAR CDA
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-full rounded-md border border-gray-900 bg-gray-900 py-2 px-3 text-sm font-medium leading-4 text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none">
            <button type="submit" className="flex w-full justify-center ">
              GERAR
            </button>
          </div>
        </form>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="m-4 ml-0 overflow-hidden min-h-[20rem] bg-gray-900 bg-opacity-60 outline-none p-4 rounded-md text-gray-300"
        />
      </div>
    </div>
  );
};

export default ScriptForm;
