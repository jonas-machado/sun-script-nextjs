"use client";

import React, { Fragment, useState, useEffect, useCallback } from "react";
//import io from "socket.io-client";
import { Listbox, Transition, RadioGroup, Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Input from "../inputs/inputLabelUseForm";
import InputLabel from "../inputs/InputLabel";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import ControlledInputDescription from "../inputs/controlledInputDescription";
import ControlledInput from "../inputs/controlledInput";
import ControlledInputConfig from "../inputs/controlledInputConfig";
import { useForm, Controller, FieldValues } from "react-hook-form";
import ComboboxInput from "../inputs/comboboxInput";

import { cadastro } from "@/app/lib/text/cadastro";
import { valenet } from "@/app/lib/text/valenet";
import { vilaNova } from "@/app/lib/text/vilanova";
import { itapoa } from "@/app/lib/text/itapoa";
import { chima, zte } from "@/app/lib/text/padrão";
import { intelbrasI } from "@/app/lib/text/intelbrasI";
import { intelbrasG } from "@/app/lib/text/intelbrasG";
import { datacom } from "@/app/lib/text/datacom";

//constants
import { plans } from "@/app/constants/plans";
import { brv04, viapiana } from "@/app/constants/ponException";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const ontType = [{ name: "ONU" }, { name: "ONT" }];
const intelbrasModel = [{ name: "ITBS" }, { name: "ZNTS" }];

interface selectedType {
  createdAt: any;
  id: string;
  olt: string;
  updatedAt: any;
  vlan: number;
}

interface ConfigProps {
  currentUser?: User | null;
  oltZteChimaData: any;
  oltIntelbrasData: any;
  oltDatacomData: any;
}

function ConfigForm({
  currentUser,
  oltZteChimaData,
  oltIntelbrasData,
  oltDatacomData,
}: ConfigProps) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.status == "unauthenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  //selections
  const [selected, setSelected] = useState<selectedType>();
  const [selectedRadio, setSelectedRadio] = useState(plans[0]);

  //inputs config
  const [sn, setSn] = useState("");

  //models handlers
  const [oltCompanyArray, setOltCompanyArray] = useState<any[]>([]);
  const [oltCompany, setOltCompany] = useState("");

  //text areas
  const [configText, setConfigText] = useState<string>();
  const [cadastroTextArea, setCadastroText] = useState<string>();
  const [pppoeTextArea, setpppoeText] = useState<string>();
  const [pppoeTextArea2, setpppoeText2] = useState<string>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const resetForm = () => {
    setSn("");
    setConfigText("");
    setCadastroText("");
    setpppoeText("");
    setpppoeText2("");
    reset();
  };

  useEffect(() => {
    if (selectedRadio.name == "ZTE/ITBS" && sn) {
      if (sn.length > 8) {
        setOltCompanyArray(oltZteChimaData);
        setOltCompany("ZTE");
      } else {
        setOltCompanyArray(oltIntelbrasData);
        setOltCompany("Intelbras");
      }
    }
    if (selectedRadio.name == "Datacom" && sn) {
      setOltCompanyArray(oltDatacomData);
      setOltCompany("Datacom");
    }
  }, [sn, selectedRadio, oltDatacomData, oltIntelbrasData, oltZteChimaData]);

  const handleVlan = (pon: string, vlan?: number, customVlan?: number) => {
    if (vlan && !customVlan) {
      return vlan;
    } else if (!vlan && !customVlan) {
      return Number(pon.replace(/[/]/gi, ""));
    } else if (customVlan) {
      return customVlan;
    }
  };

  const handleVlanDatacom = (
    onuType: string,
    pon: string,
    vlan?: number,
    customVlan?: number
  ) => {
    if (vlan && !customVlan) {
      return vlan;
    } else if (customVlan) {
      return customVlan;
    } else if (!vlan && !customVlan) {
      if (onuType == "ONU") {
        const lastPon = pon.split("/");
        const lastVlanSlot1 = 0 + lastPon[2];
        return Number("1" + lastVlanSlot1.slice(-2));
      } else {
        return 119;
      }
    }
  };

  const handleVlanItapoa2 = (pon: string, customVlan?: number) => {
    if (customVlan) {
      return customVlan;
    }
    const lastPon = pon.split("/");
    const lastVlanSlot1 = 0 + lastPon[2];
    const lastVlanSlot2 = parseInt(lastPon[2]) + 16;
    switch (lastPon[1]) {
      case "1":
        return Number("5" + lastVlanSlot1.slice(-2));
      case "2":
        return Number("5" + lastVlanSlot2);
    }
  };

  //comandos
  const comando = (pon: string, id: number, olt: string) => {
    switch (olt) {
      case "ZTE":
        return `show pon power attenuation gpon-onu_${pon}:${id}`;
      case "IntelbrasG":
        return `onu power show 1-1-${pon}-${id}`;
      case "IntelbrasI":
        return `onu status gpon ${pon} onu ${id}`;
      case "Datacom":
        return `do show interface gpon ${pon} onu ${id}`;
    }
  };

  const pppoeText = (client: string[]) => {
    const toFilter = ["", "das", "dos", "de", "do", "da"];
    const filtered = client.filter(function (el) {
      return !toFilter.includes(el);
    });
    return filtered
      .flatMap((v) =>
        filtered.map((w) => {
          if (v != w) {
            return v + "." + w;
          }
        })
      )
      .filter((el) => {
        if (el != undefined) {
          return el;
        }
      });
  };
  const pppoeText2 = (client: string[]) => {
    const toFilter = ["das", "dos", "de", "do", "da", "ltda"];
    const filtered = client.filter(function (el) {
      return !toFilter.includes(el);
    });

    return filtered.map((w) => "2ponto." + w);
  };

  const handleConfigSubmit = async ({
    client,
    customProfile,
    customVlan,
    idOnu,
    idLivre,
    intelbrasModel,
    ontType,
    pon,
  }: FieldValues) => {
    const name = client
      .normalize("NFD")
      .replace(/-/g, " ")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .split(" ")
      .join("_");

    const clientPPPoE = client
      .toLowerCase()
      .normalize("NFD")
      .replace(/-/g, " ")
      .replace(/[0-9]/g, "")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .split(" ");

    // axios
    //   .post("/api/configManual", {
    //     onutype: ontType,
    //     serial: sn,
    //     olt: selected?.olt,
    //     pon,
    //     idLivre,
    //     idOnu,
    //     customVlan,
    //     cliente: client,
    //     id: currentUser!.id,
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    setpppoeText(pppoeText(clientPPPoE).join("\n"));
    setpppoeText2(pppoeText2(clientPPPoE).join("\n"));
    if (selectedRadio.name == "ZTE/ITBS" && oltCompany == "ZTE") {
      setCadastroText(
        cadastro(comando(pon, idLivre, "ZTE"), currentUser, selected, sn)
      );
      if (sn.substring(0, 5) == "ZTEG3") {
        return setConfigText(
          valenet(
            pon,
            idLivre,
            sn,
            name,
            handleVlan(pon, selected?.vlan, customVlan)
          )
        );
      }
      switch (selected?.olt) {
        case "VILA NOVA":
          sn.substring(0, 4) == "ZTEG"
            ? setConfigText(
                vilaNova(
                  pon,
                  idLivre,
                  sn,
                  name,
                  handleVlan(pon, selected?.vlan, customVlan),
                  "ZTEG"
                )
              )
            : setConfigText(
                vilaNova(
                  pon,
                  idLivre,
                  sn,
                  name,
                  handleVlan(pon, selected?.vlan, customVlan)
                )
              );
          break;
        case "ITAPOA":
          setConfigText(
            itapoa(
              pon,
              idLivre,
              sn,
              name,
              handleVlan(pon, selected.vlan, customVlan)
            )
          );
          break;
        case "BRV04":
          for (let i = 0; i < brv04.length; i++) {
            if (pon == brv04[i].pon) {
              return sn.substring(0, 4) == "ZTEG"
                ? setConfigText(
                    zte(
                      pon,
                      idLivre,
                      sn,
                      name,
                      handleVlan(pon, brv04[i].vlan, customVlan)
                    )
                  )
                : setConfigText(
                    chima(
                      pon,
                      idLivre,
                      sn,
                      name,
                      handleVlan(pon, brv04[i].vlan, customVlan)
                    )
                  );
            }
          }
        case "VIAPIANA NEW":
          for (let i = 0; i < viapiana.length; i++) {
            if (pon == viapiana[i].pon) {
              return sn.substring(0, 4) == "ZTEG"
                ? setConfigText(
                    zte(
                      pon,
                      idLivre,
                      sn,
                      name,
                      handleVlan(pon, viapiana[i].vlan, customVlan)
                    )
                  )
                : setConfigText(
                    chima(
                      pon,
                      idLivre,
                      sn,
                      name,
                      handleVlan(pon, viapiana[i].vlan, customVlan)
                    )
                  );
            }
          }
        case "PENHA":
        case "PIÇARRAS":
        case "NOVA BRASÍLIA":
        case "JOINVILLE":
        case "MIRANDA":
        case "BS02":
        case "ITACOLOMI":
        case "SAGUAÇU":
        case "VILA DA GLORIA":
        case "ITINGA":
        case "ESTRADA DA ILHA":
          return sn.substring(0, 4) == "ZTEG"
            ? setConfigText(
                zte(
                  pon,
                  idLivre,
                  sn,
                  name,
                  handleVlan(pon, selected.vlan, customVlan)
                )
              )
            : setConfigText(
                chima(
                  pon,
                  idLivre,
                  sn,
                  name,
                  handleVlan(pon, selected.vlan, customVlan)
                )
              );
        case "ITAPOA2":
          return setConfigText(
            chima(pon, idLivre, sn, name, handleVlanItapoa2(pon, customVlan))
          );
        default:
          return setConfigText(
            chima(pon, idLivre, sn, name, handleVlan(pon, customVlan))
          );
      }
    }

    if (selectedRadio.name == "ZTE/ITBS" && oltCompany == "Intelbras") {
      switch (selected?.olt) {
        case "ERVINO":
          setCadastroText(
            cadastro(
              comando(pon, idLivre, "IntelbrasI"),
              currentUser,
              selected,
              sn
            )
          );
          setConfigText(
            intelbrasI(
              pon,
              idLivre,
              idOnu,
              name,
              handleVlan(pon, selected?.vlan)
            )
          );
          break;
        case "GARUVA":
        case "SFS":
        default:
          setCadastroText(
            cadastro(
              comando(pon, idLivre, "IntelbrasG"),
              currentUser,
              selected,
              sn
            )
          );
          setConfigText(
            intelbrasG(
              pon,
              idLivre,
              sn,
              name,
              intelbrasModel,
              handleVlan(pon, selected?.vlan)
            )
          );
          break;
      }
    }

    if (selectedRadio.name == "Datacom" && oltCompany == "Datacom") {
      setCadastroText(
        cadastro(comando(pon, idLivre, "Datacom"), currentUser, selected, sn)
      );
      switch (selected?.olt) {
        case "JACU":
        case "ARAQUARI":
        case "BRUSQUE":
        case "BS1":
        case "ITAPOCU":
        case "SNL101":
        default:
          setConfigText(
            datacom(
              pon,
              idLivre,
              sn,
              name,
              ontType,
              selected,
              customProfile,
              handleVlanDatacom(ontType, pon, selected?.vlan, customVlan)
            )
          );
          break;
      }
    }
  };

  return (
    <div>
      <section className="lg:grid lg:grid-cols-[minmax(240px,400px),minmax(200px,900px),minmax(0,275px),minmax(0,275px)] grid-auto-rows gap-2 py-14 w-full flex flex-col justify-center">
        <form
          className="row-span-2 h-full z-10"
          onSubmit={handleSubmit(handleConfigSubmit)}
          autoComplete="off"
        >
          <div className=" flex flex-col bg-black bg-opacity-90 backdrop-blur-sm border-gray-900 border-2 rounded-xl p-4 space-y-2">
            <ControlledInputDescription
              id="oltScript"
              name="oltScript"
              array={plans}
              selectedRadio={selectedRadio}
              onChange={setSelectedRadio}
            />
            {selectedRadio.name == "Datacom" && (
              <ControlledInput
                name="ontType"
                array={ontType}
                control={control}
              />
            )}

            <InputLabel
              value={sn}
              label="SN"
              placeholder="Serial"
              id="serial"
              onChange={(e: any) => setSn(e.target.value)}
            />
            <div className="flex w-full flex-col lg:flex-row gap-2 lg:gap-0 lg:space-y-0">
              <ComboboxInput
                id="olt"
                selected={selected}
                onChange={setSelected}
                label="OLT"
                placeHolder="Selecione a OLT"
                oltCompanyArray={oltCompanyArray}
                className={
                  oltCompany == "Intelbras" &&
                  selected?.olt != "ERVINO" &&
                  "lg:rounded-r-none"
                }
              />
              {oltCompany == "Intelbras" && selected?.olt != "ERVINO" && (
                <div className="flex w-full lg:w-[8rem]">
                  <ControlledInputConfig
                    name="intelbrasModel"
                    control={control}
                    array={ontType}
                  />
                </div>
              )}
            </div>
            <Input
              label="PON"
              placeholder={oltCompany == "Intelbras" ? "0" : "0/0/0"}
              id="pon"
              register={register}
              required
            />
            <Input
              label="ID Livre"
              placeholder="Posição"
              id="idLivre"
              register={register}
              required
            />
            {selected?.olt == "ERVINO" && oltCompany == "Intelbras" && (
              <>
                <Input
                  label="ID Onu"
                  placeholder="ID Onu"
                  id="idOnu"
                  register={register}
                  required
                />
              </>
            )}
            <Input
              label="Cliente"
              placeholder="Nome"
              id="client"
              register={register}
              required
            />
            <Input
              label="Vlan"
              placeholder="Custom Vlan"
              id="customVlan"
              register={register}
              required={false}
            />
            {selectedRadio.name == "Datacom" && (
              <Input
                label="Profile"
                placeholder="Custom Profile"
                id="customProfile"
                register={register}
                required={false}
              />
            )}
            <div className="flex w-full gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-md border border-gray-900 bg-gray-900 py-2 px-3 text-sm font-medium leading-4 text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none"
              >
                LIMPAR
              </button>
              <button
                type="submit"
                className="w-full rounded-md border border-gray-900 bg-gray-900 py-2 px-3 text-sm font-medium leading-4 text-gray-200 shadow-sm hover:bg-gray-600 focus:outline-none"
              >
                GERAR
              </button>
            </div>
          </div>
        </form>
        <div className="row-span-2 h-full">
          <textarea
            id="about"
            name="about"
            className="lg:h-full scrollbar-corner-transparent resize-none scrollbar-thumb-rounded-md scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent whitespace-nowrap min-h-[400px] lg:min-h-0 border-2 w-full rounded-md bg-gray-900 bg-opacity-90 backdrop-blur-sm border-black shadow-sm outline-none text-sm text-white p-3"
            value={configText}
            autoComplete="false"
            spellCheck="false"
            onChange={(e) => setConfigText(e.target.value)}
          />
        </div>
        <div className="col-span-2 h-full">
          <textarea
            id="about"
            name="about"
            className="lg:h-full scrollbar-corner-transparent resize-none scrollbar-thumb-rounded-md scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent whitespace-nowrap min-h-[400px] lg:min-h-0 border-2 w-full rounded-md bg-gray-900 bg-opacity-90 backdrop-blur-sm border-black shadow-sm outline-none text-sm text-white p-3"
            value={cadastroTextArea}
            spellCheck="false"
            onChange={(e) => setCadastroText(e.target.value)}
          />
        </div>
        <div className="h-full">
          <textarea
            id="about"
            name="about"
            className="lg:h-full min-h-[400px] scrollbar-corner-transparent resize-none scrollbar-thumb-rounded-md scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent lg:min-h-0 border-2 w-full rounded-md bg-gray-900 bg-opacity-90 backdrop-blur-sm border-black shadow-sm outline-none text-sm text-white p-3"
            value={pppoeTextArea}
            spellCheck="false"
            onChange={(e) => setpppoeText(e.target.value)}
          />
        </div>
        <div className="h-full">
          <textarea
            id="about"
            name="about"
            className="lg:h-full min-h-[400px] scrollbar-corner-transparent resize-none scrollbar-thumb-rounded-md scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent lg:min-h-0 border-2 w-full rounded-md bg-gray-900 opacity-90 backdrop-blur-sm border-black shadow-sm outline-none text-sm text-white p-3"
            defaultValue={""}
            spellCheck="false"
            value={pppoeTextArea2}
            onChange={(e) => setpppoeText2(e.target.value)}
          />
        </div>
      </section>
    </div>
  );
}

export default ConfigForm;
