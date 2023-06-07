"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TabBody from "@/app/components/tab/TabBody";
import TabHead from "@/app/components/tab/TabHead";

//constants
import { tabScript } from "@/app/constants/tabScript";
import Input from "@/app/components/inputs/inputLabelUseForm";

const ScriptForm = () => {
  const [openTab, setOpenTab] = useState("padraoEmail");
  console.log(openTab);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <>
      <div className="container bg-gray-800 bg-opacity-90 w-11/12 mx-auto mt-8">
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
        <div className="grid grid-cols-[30%,70%]">
          <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="CLIENTE"
              placeholder="Nome e código"
              id="client"
              register={register}
              required
            />
            <Input
              label="PROTOCOLO"
              placeholder="N20230000000000"
              id="protocol"
              register={register}
              required
            />
            <Input
              label="ENDEREÇO"
              placeholder="Endereço"
              id="addres"
              register={register}
              required
            />
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
            <div>
              {/* <Controller
                control={control}
                name="ReactDatepicker"
                //render={({ field: { onChange, onBlur, value, ref } }) => (
                //)}
              /> */}
            </div>
          </form>

          <textarea className="m-4 bg-gray-900"></textarea>
        </div>
      </div>
    </>
  );
};

export default ScriptForm;
