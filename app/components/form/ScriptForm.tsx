"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import TabBody from "@/app/components/tab/TabBody";
import TabHead from "@/app/components/tab/TabHead";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import TextAreaUseForm from "../inputs/textAreaLabelUseForm";
import ControlledInput from "../inputs/controlledInput";
import Input from "@/app/components/inputs/inputLabelUseForm";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
//constants
import { tabScript } from "@/app/constants/tabScript";
import { bases } from "@/app/constants/bases";
import { sla } from "@/app/constants/sla";
import PageWrapper from "@/app/lib/pageWrapper";
import MotionPage from "@/app/lib/motionPage";
import { AnimatePresence } from "framer-motion";

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
    if (openTab == "padraoEmail") {
      setText(`\
Chamado aberto: ${base} ${client} - SLA ${sla}

Cliente: ${client}
Protocolo: ${protocol}
Endereço: ${addres}
SLA: ${sla}
Responsável pelo atendimmento: ${name} // ${tel}

Qualquer dúvida entrar em contato.
Mais informações na O.S.

att,

${currentUser?.name.split(" ").slice(0, 2).join(" ")}.
      `);
    }
    if (openTab == "padraoManutencao") {
      const filtered = bases.filter((bs: any) => bs.name.includes(base));
      setText(`\
Protocolo: ${protocol}
Motivo: ${description}
Cliente afetado: ${clientLost}
${cda}
${loc}
Chamado aberto: ${base} ${filtered[0].maintenance}
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
          <PageWrapper>
            {openTab == "padraoEmail" && (
              <MotionPage id={openTab} className="flex flex-col gap-2">
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
              </MotionPage>
            )}
            {openTab == "padraoManutencao" && (
              <MotionPage id={openTab} className="flex flex-col gap-2">
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
                <Input
                  label="CDA"
                  placeholder="PON, CDA e OLT"
                  id="cda"
                  register={register}
                  required
                />
                <Input
                  label="LOCALIZAÇÃO"
                  placeholder="XX.XXXXXX,XX.XXXXXX"
                  id="loc"
                  register={register}
                  required
                />
              </MotionPage>
            )}
          </PageWrapper>

          <div className="w-full rounded-md border border-gray-900 bg-gray-900 py-2 px-3 text-sm font-medium leading-4 text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none">
            <button type="submit" className="flex w-full justify-center ">
              GERAR
            </button>
          </div>
        </form>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="m-4 overflow-hidden min-h-[20rem] bg-gray-900 bg-opacity-60 outline-none p-4 rounded-md text-gray-300"
        ></textarea>
      </div>
    </div>
  );
};

export default ScriptForm;
