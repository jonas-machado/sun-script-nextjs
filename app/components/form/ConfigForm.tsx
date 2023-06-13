"use client";

import React, { Fragment, useState, useEffect, useCallback } from "react";
//import io from "socket.io-client";
import { Listbox, Transition, RadioGroup, Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import InputWLabel from "../inputs/InputWLabel";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
//constants

import { plans } from "@/app/constants/plans";
import { brv04, viapiana } from "@/app/constants/ponException";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
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
  const [selected, setSelected] = useState<any>();
  const [query, setQuery] = useState("");

  const [selectedRadio, setSelectedRadio] = useState(plans[0]);

  //inputs config
  const [sn, setSn] = useState("");
  const [pon, setPon] = useState("");
  const [oltId, setId] = useState("");
  const [onuId, setOnuId] = useState("");
  const [cliente, setCliente] = useState("");
  const [customVlan, setCustomVlan] = useState("");
  const [customProfile, setCustomProfile] = useState("");

  const resetForm = () => {
    setSn("");
    setPon("");
    setId("");
    setOnuId("");
    setCliente("");
    setConfigText("");
    setCadastroText("");
    setpppoeText("");
    setpppoeText2("");
    setOnuModel("");
    setCustomVlan("");
    setCustomProfile("");
  };

  //models handlers
  const [oltCompanyArray, setOltCompanyArray] = useState<any[]>([]);
  const [oltCompany, setOltCompany] = useState("");
  const [onuType, setOnuType] = useState("");
  const [onuModel, setOnuModel] = useState("");

  //text areas
  const [configText, setConfigText] = useState("");
  const [cadastroTextArea, setCadastroText] = useState("");
  const [pppoeTextArea, setpppoeText] = useState<string>();
  const [pppoeTextArea2, setpppoeText2] = useState<string>();

  useEffect(() => {
    console.log(sn, pon, oltId, cliente);
  }, [sn, pon, oltId, cliente]);

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

  const handleVlan = (vlan?: number) => {
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

  const handleVlanItapoa2 = () => {
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

  //excessões
  const vilaNovaText = (
    vlan: number | undefined | string,
    onuCompany?: string | undefined
  ) => {
    if (onuCompany == "ZTEG") {
      return `\
interface gpon-olt_${pon}
onu ${oltId} type ZTE-F601 sn ${sn}
!
interface gpon-onu_${pon}:${oltId}
description ${cliente
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "_")}
tcont 2 name Tcont100M profile "OT"
gemport 1 name Gemport1 unicast tcont 2 dir both queue 1
switchport mode trunk vport 1
switchport vlan ${vlan} tag vport 1
!
pon-onu-mng gpon-onu_${pon}:${oltId}
service dataservice type internet gemport 1 cos 0 vlan ${vlan}
switchport-bind switch_0/1 iphost 1
vlan-filter-mode iphost 1 tag-filter vid-filter untag-filter discard
vlan-filter iphost 1 priority 0 vid ${vlan}
vlan port eth_0/1 mode tag vlan ${vlan}
security-mng 1 state enable mode permit
!`;
    } else {
      return `\
interface gpon-olt_${pon}
onu ${oltId} type ZTE-F601 sn ${sn}
!
interface gpon-onu_${pon}:${oltId}
description ${cliente
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "_")}
tcont 2 name Tcont100M profile "OT"
gemport 1 name Gemport1 unicast tcont 2 dir both queue 1
switchport mode trunk vport 1
switchport vlan ${vlan} tag vport 1
! 
pon-onu-mng gpon-onu_${pon}:${oltId}
service inter gemport 1 vlan ${vlan}
performance ethuni eth_0/1 start
vlan port eth_0/1 mode tag vlan ${vlan}
!`;
    }
  };

  const itapoaText = (vlan: number | undefined | string) => {
    return `\
interface gpon-olt_${pon}
onu ${oltId} type ZTE-F601 sn ${sn}
!
interface gpon-onu_${pon}:${oltId}
description ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}
tcont 2 name Tcont100M profile OT
gemport 1 name Gemport1 unicast tcont 2 dir both
switchport mode trunk vport 1
switchport vlan ${vlan} tag vport 1
!
pon-onu-mng gpon-onu_${pon}:${oltId}
service dataservice type internet gemport 1 cos 0 vlan ${vlan}
switchport-bind switch_0/1 iphost 1
vlan-filter-mode iphost 1 tag-filter vid-filter untag-filter discard
vlan-filter iphost 1 priority 0 vid ${vlan}
vlan port eth_0/1 mode tag vlan ${vlan}
security-mng 1 state enable mode permit
!`;
  };

  const valeNetText = (vlan: number | undefined | string) => {
    return `\
interface gpon-olt_${pon}
onu ${oltId} type ZTE-F601 sn ${sn}
!
interface gpon-onu_${pon}:${oltId}
description ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}
tcont 2 name Tcont100M profile "OT"
gemport 1 name Gemport1 tcont 2 queue 1
switchport mode trunk vport 1
service-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}
!
pon-onu-mng gpon-onu_${pon}:${oltId}
service dataservice gemport 1 cos 0 vlan ${vlan} 
performance ethuni eth_0/1 start
!`;
  };

  //comandos
  const comando = {
    ZTE: `show pon power attenuation gpon-onu_${pon}:${oltId}`,
    IntelbrasG: `onu power show 1-1-${pon}-${oltId}`,
    IntelbrasI: `onu status gpon ${pon} onu ${oltId}`,
    Datacom: `do show interface gpon ${pon} onu ${oltId}`,
  };

  const cadastroText = (comando: string) => {
    const date = new Date();
    return `=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n${
      currentUser!.name.split(" ")[0]
    }: ${("0" + date.getDate()).slice(-2)}/${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}/${date.getFullYear()}\nOLT: ${
      selected?.olt
    }\n${comando}\nONU S/N: ${sn}\nSinal: \nCDA: \n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`;
  };

  const pppoeText = () => {
    const array = cliente
      .toLowerCase()
      .normalize("NFD")
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
  const pppoeText2 = () => {
    const array = cliente
      .toLowerCase()
      .normalize("NFD")
      .replace(/[0-9]/g, ``)
      .replace(/[\u0300-\u036f]/g, "")
      .split(" ");
    const toFilter = ["", "das", "dos", "de", "do", "da"];
    const filtered = array.filter(function (el) {
      return !toFilter.includes(el);
    });

    return filtered.map((w) => "2ponto." + w);
  };

  const handleConfigSubmit = async (values: any) => {
    values.preventDefault();
    axios
      .post("/api/configManual", {
        onuType,
        serial: sn,
        olt: selected?.olt,
        pon: pon,
        idLivre: oltId,
        idOnu: onuId,
        customVlan,
        cliente: cliente,
        id: currentUser!.id,
      })
      .catch((err) => {
        console.log(err);
      });
    setpppoeText(pppoeText().join("\n"));
    setpppoeText2(pppoeText2().join("\n"));
    if (selectedRadio.name == "ZTE/ITBS" && oltCompany == "ZTE") {
      setCadastroText(cadastroText(comando.ZTE));
      for (let x in oltZteChimaData) {
        if (selected?.olt == oltZteChimaData[x].olt) {
          if (sn.substring(0, 5) == "ZTEG3") {
            return setConfigText(
              valeNetText(handleVlan(oltZteChimaData[x].vlan))
            );
          }
          switch (selected?.olt) {
            case "VILA NOVA":
              sn.substring(0, 4) == "ZTEG"
                ? setConfigText(
                    vilaNovaText(handleVlan(oltZteChimaData[x].vlan), "ZTEG")
                  )
                : setConfigText(
                    vilaNovaText(handleVlan(oltZteChimaData[x].vlan))
                  );
              break;
            case "ITAPOA":
              setConfigText(itapoaText(handleVlan(oltZteChimaData[x].vlan)));
              break;
            case "BRV04":
              for (let i = 0; i < brv04.length; i++) {
                if (pon == brv04[i].pon) {
                  return sn.substring(0, 4) == "ZTEG"
                    ? setConfigText(zteText(handleVlan(brv04[i].vlan)))
                    : setConfigText(chimaText(handleVlan(brv04[i].vlan)));
                }
              }
            case "VIAPIANA NEW":
              for (let i = 0; i < viapiana.length; i++) {
                if (pon == viapiana[i].pon) {
                  return sn.substring(0, 4) == "ZTEG"
                    ? setConfigText(zteText(handleVlan(viapiana[i].vlan)))
                    : setConfigText(chimaText(handleVlan(viapiana[i].vlan)));
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
                ? setConfigText(zteText(handleVlan(oltZteChimaData[x].vlan)))
                : setConfigText(chimaText(handleVlan(oltZteChimaData[x].vlan)));
            case "ITAPOA2":
              return setConfigText(chimaText(handleVlanItapoa2()));
            default:
              return setConfigText(chimaText(handleVlan()));
          }
        }
      }
    }
    if (selectedRadio.name == "ZTE/ITBS" && oltCompany == "Intelbras") {
      for (let x in oltIntelbrasData) {
        if (selected?.olt == oltIntelbrasData[x].olt) {
          switch (selected?.olt) {
            case "ERVINO":
              setCadastroText(cadastroText(comando.IntelbrasI));
              setConfigText(intelbrasI(handleVlan(oltIntelbrasData[x].vlan)));
              setOnuId("");
              break;
            case "GARUVA":
            case "SFS":
            default:
              setCadastroText(cadastroText(comando.IntelbrasG));
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
      setCadastroText(cadastroText(comando.Datacom));
      for (let x in oltDatacomData) {
        if (selected?.olt == oltDatacomData[x].olt) {
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

  const filteredOlt =
    query === ""
      ? oltCompanyArray
      : oltCompanyArray.filter((olt) => {
          return olt.olt.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div>
      <section className="lg:grid lg:grid-cols-[minmax(240px,400px),minmax(200px,900px),minmax(0,275px),minmax(0,275px)] grid-auto-rows gap-2 py-14 w-full flex flex-col justify-center">
        <form className="row-span-2 h-full z-5" onSubmit={handleConfigSubmit}>
          <div className=" flex flex-col bg-black opacity-95 border-gray-900 border-2 rounded-xl p-5 space-y-2">
            <RadioGroup value={selectedRadio} onChange={setSelectedRadio}>
              <RadioGroup.Label className="sr-only">
                Server size
              </RadioGroup.Label>
              <div className="flex space-x-2">
                {plans.map((plan) => (
                  <RadioGroup.Option
                    key={plan.name}
                    value={plan}
                    className={({ active, checked }) =>
                      `
                  ${
                    checked
                      ? "bg-gray-700 bg-opacity-75 text-white"
                      : "bg-gray-900 "
                  }
                    relative flex cursor-pointer rounded-lg px-3 py-2 shadow-md focus:outline-none w-full transition-all`
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <RadioGroup.Label
                                as="p"
                                className={`font-medium text-white`}
                              >
                                {plan.name}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className={`inline ${
                                  checked ? "text-sky-100" : "text-gray-400"
                                }`}
                              >
                                <span>{plan.description}</span>
                              </RadioGroup.Description>
                            </div>
                          </div>
                          {checked && (
                            <div className="shrink-0 text-white">
                              <CheckIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
            {selectedRadio.name == "Datacom" && (
              <RadioGroup
                value={onuType}
                onChange={setOnuType}
                className="flex w-full justify-between gap-2"
              >
                <RadioGroup.Option
                  value="ONU"
                  className={({ active, checked }) =>
                    `
                  ${
                    checked
                      ? "bg-gray-700 bg-opacity-75 text-white"
                      : "bg-gray-900 "
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-2 shadow-md focus:outline-none w-full transition-all justify-center`
                  }
                >
                  {({ checked }) => (
                    <span className={`text-gray-200 font-black`}>ONU</span>
                  )}
                </RadioGroup.Option>
                <RadioGroup.Option
                  value="ONT"
                  className={({ active, checked }) =>
                    `
                  ${
                    checked
                      ? "bg-gray-700 bg-opacity-75 text-white"
                      : "bg-gray-900 "
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-2 shadow-md focus:outline-none w-full transition-all justify-center`
                  }
                >
                  {({ checked }) => (
                    <span className={`text-gray-200 font-black`}>ONT</span>
                  )}
                </RadioGroup.Option>
              </RadioGroup>
            )}

            <InputWLabel
              value={sn}
              label="SN"
              placeholder="Serial"
              id="serial"
              onChange={(e: any) => setSn(e.target.value)}
            />
            <div className="flex w-full flex-col lg:flex-row space-y-5 lg:space-y-0">
              <Combobox value={selected} onChange={setSelected}>
                <div className="relative w-full">
                  <div className="flex relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none sm:text-sm">
                    <label
                      htmlFor="olt"
                      className="inline-flex items-center rounded-l-md border border-r-0 border-gray-900 bg-gray-700 px-3 text-sm text-gray-200"
                    >
                      OLT
                    </label>
                    <Combobox.Input
                      id="olt"
                      placeholder="Selecione a OLT"
                      className="w-full border-none outline-none py-3 pl-3 pr-10 text-sm leading-5 text-gray-300 bg-gray-900"
                      displayValue={(olt: any) => olt.olt}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <Combobox.Button className="rounded-lg absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                  >
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredOlt.length === 0 && query !== "" ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                          Nothing found.
                        </div>
                      ) : (
                        filteredOlt.map((olt) => (
                          <Combobox.Option
                            key={olt.olt}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-purple-600 text-white"
                                  : "text-gray-300 bg-gray-900"
                              }`
                            }
                            value={olt}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {olt.olt}
                                </span>
                                {selected ? (
                                  <span
                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                      active ? "text-white" : "text-teal-600"
                                    }`}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
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
            <InputWLabel
              value={pon}
              label="PON"
              placeholder={oltCompany == "Intelbras" ? "0" : "0/0/0"}
              id="pon"
              onChange={(e: any) => setPon(e.target.value)}
            />
            <InputWLabel
              value={oltId}
              label="ID Livre"
              placeholder="Posição"
              id="idLivre"
              onChange={(e: any) => setId(e.target.value)}
            />
            {selected?.olt == "ERVINO" && oltCompany == "Intelbras" && (
              <>
                <InputWLabel
                  value={onuId}
                  label="ID Onu"
                  placeholder="ID Onu"
                  id="idOnu"
                  onChange={(e: any) => setOnuId(e.target.value)}
                />
              </>
            )}
            <InputWLabel
              value={cliente}
              label="Cliente"
              placeholder="Nome"
              id="cliente"
              onChange={(e: any) => setCliente(e.target.value)}
            />
            <InputWLabel
              value={customVlan}
              label="Vlan"
              placeholder="Custom Vlan"
              id="customVlan"
              onChange={(e: any) => setCustomVlan(e.target.value)}
            />
            {selectedRadio.name == "Datacom" && (
              <InputWLabel
                value={customProfile}
                label="Profile"
                placeholder="Custom Profile"
                id="customProfile"
                onChange={(e: any) => setCustomProfile(e.target.value)}
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
