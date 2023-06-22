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
import { useForm, Controller, FieldValues } from "react-hook-form";
import ComboboxInput from "../inputs/comboboxInput";

import { cadastro } from "@/app/lib/text/cadastro";
import { valenet } from "@/app/lib/text/valenet";
import { vilaNova } from "@/app/lib/text/vilanova";
import { itapoa } from "@/app/lib/text/itapoa";
import { chima, zte } from "@/app/lib/text/padrão";

//constants
import { plans } from "@/app/constants/plans";
import { brv04, viapiana } from "@/app/constants/ponException";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const ontType = [{ name: "ONU" }, { name: "ONT" }];

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
  const [selected, setSelected] = useState<any>();
  const [query, setQuery] = useState("");

  const [selectedRadio, setSelectedRadio] = useState(plans[0]);

  //inputs config
  const [sn, setSn] = useState("");

  //models handlers
  const [oltCompanyArray, setOltCompanyArray] = useState<any[]>([]);
  const [oltCompany, setOltCompany] = useState("");
  const [onuType, setOnuType] = useState("");
  const [onuModel, setOnuModel] = useState("");

  //text areas
  const [configText, setConfigText] = useState("");
  const [cadastroTextArea, setCadastroText] = useState<string>();
  const [pppoeTextArea, setpppoeText] = useState<string>();
  const [pppoeTextArea2, setpppoeText2] = useState<string>();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const resetForm = () => {
    setSn("");
    setConfigText("");
    setCadastroText("");
    setpppoeText("");
    setpppoeText2("");
    setOnuModel("");
  };

  useEffect(() => {
    if (selectedRadio.name == "ZTE/ITBS" && sn) {
      setOnuType("");
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

  const handleVlanDatacom = (vlan?: number) => {
    if (vlan && !customVlan) {
      return vlan;
    } else if (customVlan) {
      return customVlan;
    } else if (!vlan && !customVlan) {
      const lastPon = pon.split("/");
      const lastVlanSlot1 = 0 + lastPon[2];
      return Number("1" + lastVlanSlot1.slice(-2));
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

  const chimaText = (vlan: number | undefined | string) => {
    return `interface gpon-olt_${pon}\nonu ${oltId} type ZTE-F601 sn ${sn}\n!\ninterface gpon-onu_${pon}:${oltId}\ndescription ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(
        / /g,
        "_"
      )}\ntcont 2 name Tcont100M profile OT\ngemport 1 name Gemport1 tcont 2 queue 1\nswitchport mode trunk vport 1\nservice-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}\n!\npon-onu-mng gpon-onu_${pon}:${oltId}\nservice inter gemport 1 vlan ${vlan}\nperformance ethuni eth_0/1 start\nvlan port eth_0/1 mode tag vlan ${vlan}\n!\n`;
  };
  console.log(oltCompany, selectedRadio);
  const zteText = (vlan: number | undefined | string) => {
    return `interface gpon-olt_${pon}\nonu ${oltId} type ZTE-F601 sn ${sn}\n!\ninterface gpon-onu_${pon}:${oltId}\ndescription ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(
        / /g,
        "_"
      )}\ntcont 2 name Tcont100M profile OT\ngemport 1 name Gemport1 tcont 2 queue 1\nswitchport mode trunk vport 1\nservice-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}\n!\npon-onu-mng gpon-onu_${pon}:${oltId}\nservice dataservice gemport 1 cos 0 vlan ${vlan}\nswitchport-bind switch_0/1 iphost 1\nvlan port eth_0/1 mode tag vlan ${vlan}\n!\n`;
  };

  const intelbrasItbsText = (vlan: number | undefined | string) => {
    return `onu set 1/${pon}/${oltId} meprof intelbras-110g vendorid ZNTS serno fsan ${sn}\ncreate gpon-olt-onu-config 1-1-${pon}-${oltId}/gpononu\nset serial-no-vendor-id = ITBS\ncommit gpon-olt-onu-config 1-1-${pon}-${oltId}/gpononu\nbridge add 1-1-${pon}-${oltId}/gpononu  downlink vlan ${vlan} tagged eth 1\nport description add 1-1-${pon}-${oltId}/gpononu ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}`;
  };

  const intelbrasZntsText = (vlan: number | undefined | string) => {
    return `onu set 1/${pon}/${oltId} meprof intelbras-110g vendorid ZNTS serno fsan ${sn}\nbridge add 1-1-${pon}-${oltId}/gpononu downlink vlan ${vlan} tagged eth 1\nport description add 1-1-${pon}-${oltId}/gpononu ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}`;
  };

  const intelbrasI = (vlan: number | undefined | string) => {
    return `onu set gpon ${pon} onu ${oltId} id ${onuId} meprof intelbras-110g\nbridge add gpon ${pon} onu ${oltId} downlink vlan ${vlan} tagged eth 1\nonu description add gpon ${pon} onu ${oltId} text ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}`;
  };
  const datacomTextOnu = (vlan: number | undefined | string) => {
    return `interface gpon ${pon}\nonu ${oltId}\nname ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}\nserial-number ${sn}\nline-profile ${
      customProfile ? customProfile : "1000Mdow1000Mup"
    }\nethernet 1\nnegotiation\nno shutdown\ntop\nservice-port new\ndescription ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(
        / /g,
        "_"
      )}\ngpon ${pon} onu ${oltId} gem 1 match vlan vlan-id any action vlan add vlan-id ${vlan}\ncommit`;
  };

  const datacomTextOnt = (vlan: number | undefined | string) => {
    return `interface gpon ${pon}\nonu ${oltId}\nname ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}\nserial-number ${sn}\nline-profile ${
      customProfile
        ? customProfile
        : selected?.olt == "ARAQUARI"
        ? "PPPoEROUTER"
        : "PPPoE-ROUTER"
    }\nveip 1\ntop\nservice-port new\ndescription ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(
        / /g,
        "_"
      )}\ngpon ${pon} onu ${oltId} gem 1 match vlan vlan-id ${vlan} action vlan replace vlan-id ${vlan}\ncommit`;
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

  const pppoeText = (client: string) => {
    const array = client
      .toLowerCase()
      .normalize("NFD")
      .replace(/-/g, "")
      .replace(/[0-9]/g, "")
      .replace(/[\u0300-\u036f]/g, "")
      .split(" ");
    const toFilter = ["", "das", "dos", "de", "do", "da"];
    const filtered = array.filter(function (el) {
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
  const pppoeText2 = (client: string) => {
    const array = client
      .toLowerCase()
      .normalize("NFD")
      .replace(/-/g, "")
      .replace(/[0-9]/g, ``)
      .replace(/[\u0300-\u036f]/g, "")
      .split(" ");
    const toFilter = ["", "das", "dos", "de", "do", "da"];
    const filtered = array.filter(function (el) {
      return !toFilter.includes(el);
    });

    return filtered.map((w) => "2ponto." + w);
  };

  const handleConfigSubmit = async (
    { pon, idLivre, idOnu, client, customVlan, customProfile }: FieldValues,
    value: any
  ) => {
    console.log(value);
    // axios
    //   .post("/api/configManual", {
    //     onuType,
    //     serial: sn,
    //     olt: selected?.olt,
    //     pon: pon,
    //     idLivre: oltId,
    //     idOnu: onuId,
    //     customVlan,
    //     cliente: cliente,
    //     id: currentUser!.id,
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    setpppoeText(pppoeText(client).join("\n"));
    setpppoeText2(pppoeText2(client).join("\n"));
    if (selectedRadio.name == "ZTE/ITBS" && oltCompany == "ZTE") {
      for (let x in oltZteChimaData) {
        if (selected?.olt == oltZteChimaData[x].olt) {
          setCadastroText(
            cadastro(comando(pon, idLivre, "ZTE"), currentUser, selected, sn)
          );
          if (sn.substring(0, 5) == "ZTEG3") {
            return setConfigText(
              valenet(
                pon,
                idLivre,
                sn,
                client,
                handleVlan(pon, oltZteChimaData[x].vlan, customVlan)
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
                      client,
                      handleVlan(pon, oltZteChimaData[x].vlan, customVlan),
                      "ZTEG"
                    )
                  )
                : setConfigText(
                    vilaNova(
                      pon,
                      idLivre,
                      sn,
                      client,
                      handleVlan(pon, oltZteChimaData[x].vlan, customVlan)
                    )
                  );
              break;
            case "ITAPOA":
              setConfigText(
                itapoa(
                  pon,
                  idLivre,
                  sn,
                  client,
                  handleVlan(oltZteChimaData[x].vlan, customVlan)
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
                          client,
                          handleVlan(pon, brv04[i].vlan, customVlan)
                        )
                      )
                    : setConfigText(
                        chima(
                          pon,
                          idLivre,
                          sn,
                          client,
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
                          client,
                          handleVlan(pon, viapiana[i].vlan, customVlan)
                        )
                      )
                    : setConfigText(
                        chima(
                          pon,
                          idLivre,
                          sn,
                          client,
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
                      client,
                      handleVlan(pon, oltZteChimaData[x].vlan, customVlan)
                    )
                  )
                : setConfigText(
                    chima(
                      pon,
                      idLivre,
                      sn,
                      client,
                      handleVlan(pon, oltZteChimaData[x].vlan, customVlan)
                    )
                  );
            case "ITAPOA2":
              return setConfigText(
                chima(
                  pon,
                  idLivre,
                  sn,
                  client,
                  handleVlanItapoa2(pon, customVlan)
                )
              );
            default:
              return setConfigText(
                chima(pon, idLivre, sn, client, handleVlan(pon, customVlan))
              );
          }
        }
      }
    }
    if (selectedRadio.name == "ZTE/ITBS" && oltCompany == "Intelbras") {
      for (let x in oltIntelbrasData) {
        if (selected?.olt == oltIntelbrasData[x].olt) {
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
              setConfigText(intelbrasI(handleVlan(oltIntelbrasData[x].vlan)));
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
              return onuModel == "ITBS"
                ? setConfigText(
                    intelbrasItbsText(handleVlan(oltIntelbrasData[x].vlan))
                  )
                : setConfigText(
                    intelbrasZntsText(handleVlan(oltIntelbrasData[x].vlan))
                  );
          }
        }
      }
    }
    if (selectedRadio.name == "Datacom" && oltCompany == "Datacom") {
      for (let x in oltDatacomData) {
        if (selected?.olt == oltDatacomData[x].olt) {
          setCadastroText(
            cadastro(
              comando(pon, idLivre, "Datacom"),
              currentUser,
              selected,
              sn
            )
          );
          switch (selected?.olt) {
            case "JACU":
              if (onuType == "ONU") {
                setConfigText(
                  datacomTextOnu(handleVlanDatacom(oltDatacomData[x].vlan))
                );
              }
              if (onuType == "ONT") {
                setConfigText(
                  datacomTextOnt(handleVlanDatacom(oltDatacomData[x].vlan))
                );
              }
              break;
            case "ARAQUARI":
            case "BRUSQUE":
            case "BS1":
            case "ITAPOCU":
            case "SNL101":
            default:
              if (onuType == "ONU") {
                setConfigText(
                  datacomTextOnu(handleVlanDatacom(oltDatacomData[x].vlan))
                );
              }
              if (onuType == "ONT") {
                setConfigText(datacomTextOnt(handleVlanDatacom(119)));
              }
              break;
          }
        }
      }
    }
  };

  const filtered =
    query === ""
      ? oltCompanyArray
      : oltCompanyArray.filter((olt) => {
          return olt.olt.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div>
      <section className="lg:grid lg:grid-cols-[minmax(240px,400px),minmax(200px,900px),minmax(0,275px),minmax(0,275px)] grid-auto-rows gap-2 py-14 w-full flex flex-col justify-center">
        <form
          className="row-span-2 h-full z-5"
          onSubmit={handleSubmit(handleConfigSubmit)}
          autoComplete="off"
        >
          <div className=" flex flex-col bg-black opacity-95 border-gray-900 border-2 rounded-xl p-5 space-y-2">
            <ControlledInputDescription
              id="oltScript"
              name="oltScript"
              array={plans}
              selectedRadio={selectedRadio}
              onChange={setSelectedRadio}
            />
            {selectedRadio.name == "Datacom" && (
              <ControlledInput
                id="base"
                name="base"
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
            <div className="flex w-full flex-col lg:flex-row space-y-5 lg:space-y-0">
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
              {oltCompany == "Intelbras" && selected?.olt != "ERVINO" && (
                <div className="flex">
                  <button
                    onClick={() => {
                      setOnuModel("ZNTS");
                    }}
                    type="button"
                    className={`transition w-full border rounded-l-md lg:rounded-none border-gray-900 ${
                      onuModel == "ZNTS" ? "bg-gray-500" : "bg-gray-700"
                    } py-2 px-3 text-sm font-medium leading-4 text-gray-200 shadow-sm focus:outline-none`}
                  >
                    ZNTS
                  </button>
                  <button
                    onClick={() => {
                      setOnuModel("ITBS");
                    }}
                    type="button"
                    className={`transition w-full rounded-r-md border border-gray-900 ${
                      onuModel == "ITBS" ? "bg-gray-500" : "bg-gray-700"
                    } py-2 px-3 text-sm font-medium leading-4 text-gray-200 shadow-sm focus:outline-none`}
                  >
                    ITBS
                  </button>
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
              required
            />
            {selectedRadio.name == "Datacom" && (
              <Input
                label="Profile"
                placeholder="Custom Profile"
                id="customProfile"
                register={register}
                required
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
            className="lg:h-full min-h-[400px] lg:min-h-0 border-2 w-full rounded-md bg-gray-900 opacity-95 border-black shadow-sm outline-none focus:border-black focus:ring-black text-sm text-white p-4 z-0"
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
            className="lg:h-full min-h-[400px] lg:min-h-0 border-2 w-full rounded-md bg-gray-900 opacity-95 border-black shadow-sm outline-none focus:border-black focus:ring-black text-[0.87rem] text-white p-4 z-0"
            value={cadastroTextArea}
            spellCheck="false"
            onChange={(e) => setCadastroText(e.target.value)}
          />
        </div>
        <div className="h-full">
          <textarea
            id="about"
            name="about"
            className="lg:h-full min-h-[400px] lg:min-h-0 border-2 w-full rounded-md bg-gray-900 opacity-95 border-black shadow-sm outline-none focus:border-black focus:ring-black text-[1rem]  text-white p-4 z-0"
            value={pppoeTextArea}
            spellCheck="false"
            onChange={(e) => setpppoeText(e.target.value)}
          />
        </div>
        <div className="h-full">
          <textarea
            id="about"
            name="about"
            className="lg:h-full min-h-[400px] lg:min-h-0 border-2 w-full rounded-md bg-gray-900 opacity-95 border-black shadow-sm outline-none focus:border-black focus:ring-black text-[1rem] text-white p-4 z-0"
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
