"use client";

import React, { Fragment, useState, useEffect, useCallback } from "react";
//import io from "socket.io-client";
import { Listbox, Transition, RadioGroup } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import InputWLabel from "../inputs/InputWLabel";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";

const plans = [
  {
    name: "ZTE/ITBS",
    description: "Script para OLT ZTE e Intelbras",
  },
  {
    name: "Datacom",
    description: "Script para OLT Datacom",
  },
];

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
  const [selected, setSelected] = useState({ olt: "Selecione a OLT" });
  const [selectedRadio, setSelectedRadio] = useState(plans[0]);
  const [sn, setSn] = useState("");
  const [pon, setPon] = useState("");
  const [id, setId] = useState<number | null>();
  const [onuId, setOnuId] = useState<number | null>();
  const [cliente, setCliente] = useState("");
  const [oltCompanyArray, setOltCompanyArray] = useState([]);
  const [configText, setConfigText] = useState("");
  const [cadastroTextArea, setCadastroText] = useState("");
  const [pppoeTextArea, setpppoeText] = useState<string>();
  const [pppoeTextArea2, setpppoeText2] = useState<string>();
  const [oltCompany, setOltCompany] = useState("");
  const [onuModel, setOnuModel] = useState("");
  const [onuType, setOnuType] = useState("");
  const [customVlan, setCustomVlan] = useState<number | null>();
  const route = useRouter();

  useEffect(() => {
    if (selectedRadio.name == "ZTE/ITBS" && sn) {
      if (isNaN(sn[0] as any)) {
        setOltCompanyArray(oltZteChimaData);
        setOltCompany("ZTE");
      } else {
        setOltCompanyArray(oltIntelbrasData);
        setOltCompany("Intelbras");
      }
    }
    if (selectedRadio.name == "Datacom") {
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

  const chimaText = (vlan: number | undefined) => {
    return `interface gpon-olt_${pon}\nonu ${id} type ZTE-F601 sn ${sn}\n!\ninterface gpon-onu_${pon}:${id}\ndescription ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")
      .toLowerCase()}\ntcont 2 name Tcont100M profile OT\ngemport 1 name Gemport1 tcont 2 queue 1\nswitchport mode trunk vport 1\nservice-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}\n!\npon-onu-mng gpon-onu_${pon}:${id}\nservice inter gemport 1 vlan ${vlan}\nperformance ethuni eth_0/1 start\nvlan port eth_0/1 mode tag vlan ${vlan}\n!\n`;
  };

  const zteText = (vlan: number | undefined) => {
    return `interface gpon-olt_${pon}\nonu ${id} type ZTE-F601 sn ${sn}\n!\ninterface gpon-onu_${pon}:${id}\ndescription ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(
        / /g,
        "_"
      )}\ntcont 2 name Tcont100M profile OT\ngemport 1 name Gemport1 tcont 2 queue 1\nswitchport mode trunk vport 1\nservice-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}\n!\npon-onu-mng gpon-onu_${pon}:${id}\nservice dataservice gemport 1 cos 0 vlan ${vlan}\nswitchport-bind switch_0/1 iphost 1\nvlan port eth_0/1 mode tag vlan ${vlan}\n!\n`;
  };

  const intelbrasItbsText = (vlan: number | undefined) => {
    return `onu set 1/${pon}/${id} meprof intelbras-110g vendorid ZNTS serno fsan ${sn}\ncreate gpon-olt-onu-config 1-1-${pon}-${id}/gpononu\nset serial-no-vendor-id = ITBS\ncommit gpon-olt-onu-config 1-1-${pon}-${id}/gpononu\nbridge add 1-1-${pon}-${id}/gpononu  downlink vlan ${vlan} tagged eth 1\nport description add 1-1-${pon}-${id}/gpononu ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}`;
  };

  const intelbrasZntsText = (vlan: number | undefined) => {
    return `onu set 1/${pon}/${id} meprof intelbras-110g vendorid ZNTS serno fsan ${sn}\nbridge add 1-1-${pon}-${id}/gpononu downlink vlan ${vlan} tagged eth 1\nport description add 1-1-${pon}-${id}/gpononu ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}`;
  };

  const intelbrasI = (vlan: number | undefined) => {
    return `onu set gpon ${pon} onu ${id} id ${onuId} meprof intelbras-110g\nbridge add gpon ${pon} onu ${id} downlink vlan ${vlan} tagged eth 1\nonu description add gpon ${pon} onu ${id} text ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}`;
  };
  const datacomTextOnu = (vlan: number | undefined) => {
    return `interface gpon ${pon}\nonu ${id}\nname ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(
        / /g,
        "_"
      )}\nserial-number ${sn}\nline-profile 1000Mdow1000Mup\nethernet 1\nnegotiation\nno shutdown\ntop\nservice-port new\ndescription ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(
        / /g,
        "_"
      )}\ngpon ${pon} onu ${id} gem 1 match vlan vlan-id any action vlan add vlan-id ${vlan}\ncommit`;
  };

  const datacomTextOnt = (vlan: number | undefined) => {
    return `interface gpon ${pon}\nonu ${id}\nname ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_")}\nserial-number ${sn}\nline-profile ${
      selected.olt == "ARAQUARI" ? "PPPoEROUTER" : "PPPoE-ROUTER"
    }\nveip 1\ntop\nservice-port new\ndescription ${cliente
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(
        / /g,
        "_"
      )}\ngpon ${pon} onu ${id} gem 1 match vlan vlan-id ${vlan} action vlan replace vlan-id ${vlan}\ncommit`;
  };

  const comando = {
    ZTE: `show pon power attenuation gpon-onu_${pon}:${id}`,
    IntelbrasG: `onu power show 1-1-${pon}-${id}`,
    IntelbrasI: `onu status gpon ${pon} onu ${id}`,
    Datacom: `do show interface gpon ${pon} onu ${id}`,
  };

  const cadastroText = (comando: string) => {
    const date = new Date();
    return `=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n${
      currentUser!.name.split(" ")[0]
    }: ${("0" + date.getDate()).slice(-2)}/${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}/${date.getFullYear()}\nOLT: ${
      selected.olt
    }\n${comando}\nONU S/N: ${sn}\nSinal: \nCDA: \n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`;
  };

  const pppoeText = () => {
    const array = cliente
      .toLowerCase()
      .normalize("NFD")
      .replace(/[0-9]/g, "")
      .replace(/[\u0300-\u036f]/g, "")
      .split(" ");
    console.log(array);
    const toFilter = ["", "das", "dos", "de", "do", "da"];
    const filtered = array.filter(function (el) {
      return !toFilter.includes(el);
    });
    return filtered.flatMap((v, i) =>
      filtered.slice(i + 1).map((w) => v + "." + w)
    );
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
        olt: selected.olt,
        pon: pon,
        idLivre: id,
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
      for (let x in oltZteChimaData) {
        if (selected.olt == oltZteChimaData[x].olt) {
          switch (selected.olt) {
            case "BRV04":
              setCadastroText(cadastroText(comando.ZTE));
              const ponException = [
                {
                  pon: "1/5/1",
                  vlan: 141,
                },
                {
                  pon: "1/5/2",
                  vlan: 132,
                },
                {
                  pon: "1/5/3",
                  vlan: 133,
                },
                {
                  pon: "1/5/4",
                  vlan: 134,
                },
                {
                  pon: "1/5/5",
                  vlan: 135,
                },
                {
                  pon: "1/5/6",
                  vlan: 136,
                },
                {
                  pon: "1/5/7",
                  vlan: 137,
                },
                {
                  pon: "1/5/8",
                  vlan: 138,
                },
                {
                  pon: "1/5/9",
                  vlan: 121,
                },
              ];
              for (let i = 0; i < ponException.length; i++) {
                if (pon == ponException[i].pon) {
                  return sn.substring(0, 4) == "ZTEG"
                    ? setConfigText(zteText(handleVlan(ponException[i].vlan)))
                    : setConfigText(
                        chimaText(handleVlan(ponException[i].vlan))
                      );
                }
              }
            case "PENHA":
            case "PIÇARRAS":
            case "VIAPIANA NEW":
            case "NOVA BRASÍLIA":
            case "JOINVILLE":
            case "MIRANDA":
            case "BS02":
            case "ITAPOA":
            case "ITACOLOMI":
            case "SAGUAÇU":
            case "VILA DA GLORIA":
            case "VILA NOVA":
            case "ITINGA":
            case "ESTRADA DA ILHA":
              setCadastroText(cadastroText(comando.ZTE));
              return sn.substring(0, 4) == "ZTEG"
                ? setConfigText(zteText(handleVlan(oltZteChimaData[x].vlan)))
                : setConfigText(chimaText(handleVlan(oltZteChimaData[x].vlan)));
            case "ITAPOA2":
              setCadastroText(cadastroText(comando.ZTE));
              return setConfigText(chimaText(handleVlanItapoa2()));
            default:
              setCadastroText(cadastroText(comando.ZTE));
              return setConfigText(chimaText(handleVlan()));
          }
        }
      }
    }
    if (selectedRadio.name == "ZTE/ITBS" && oltCompany == "Intelbras") {
      setOnuType("");
      for (let x in oltIntelbrasData) {
        if (selected.olt == oltIntelbrasData[x].olt) {
          switch (selected.olt) {
            case "GARUVA":
            case "SFS":
              setCadastroText(cadastroText(comando.IntelbrasG));

              return onuModel == "ITBS"
                ? setConfigText(
                    intelbrasItbsText(handleVlan(oltIntelbrasData[x].vlan))
                  )
                : setConfigText(
                    intelbrasZntsText(handleVlan(oltIntelbrasData[x].vlan))
                  );
            case "ERVINO":
              setCadastroText(cadastroText(comando.IntelbrasI));
              setConfigText(intelbrasI(handleVlan(oltIntelbrasData[x].vlan)));
              setOnuId(null);
              break;
            default:
          }
        }
      }
    }
    if (selectedRadio.name == "Datacom" && oltCompany == "Datacom") {
      for (let x in oltDatacomData) {
        if (selected.olt == oltDatacomData[x].olt) {
          switch (selected.olt) {
            case "JACU":
              setCadastroText(cadastroText(comando.Datacom));
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
              setCadastroText(cadastroText(comando.Datacom));
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
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none w-full transition-all`
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <RadioGroup.Label
                                as="p"
                                className={`font-medium text-white
                                  }`}
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
              label="SN"
              placeholder="Serial"
              id="serial"
              onChange={(e: any) => setSn(e.target.value)}
            />
            <div className="flex w-full flex-col lg:flex-row space-y-5 lg:space-y-0">
              <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                  <>
                    <div className="flex w-full">
                      <Listbox.Label className="flex items-center rounded-l-md border border-r-0 border-gray-900 bg-gray-700 px-3 text-sm text-gray-200">
                        OLT
                      </Listbox.Label>
                      <div className="relative w-full">
                        <Listbox.Button
                          className={`${
                            open ? "rounded-br-none" : ""
                          } w-full relative cursor-default ${
                            oltCompany == "Intelbras" ? "lg:rounded-none" : ""
                          } bg-gray-900 rounded-r-md py-3 pl-3 pr-10 text-left shadow-sm overflow-hidden focus:outline-none sm:text-sm`}
                        >
                          <span className="flex items-center">
                            <span className="block truncate text-white font-medium">
                              {selected.olt}
                            </span>
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-300"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute max-h-[19rem] w-full overflow-auto rounded-b-md border-black border-t-0 bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {oltCompanyArray.map((name: any) => (
                              <Listbox.Option
                                key={name.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-indigo-600"
                                      : "text-gray-200",
                                    "relative cursor-default select-none py-2 pr-9"
                                  )
                                }
                                value={name}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate text-gray-300"
                                      )}
                                    >
                                      {name.olt}
                                    </span>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-indigo-600",
                                          "absolute inset-y-0 right-0 flex items-center pr-4"
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </div>
                  </>
                )}
              </Listbox>
              {oltCompany == "Intelbras" && selected.olt != "ERVINO" && (
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
              label="PON"
              placeholder={oltCompany == "Intelbras" ? "0" : "0/0/0"}
              id="pon"
              onChange={(e: any) => setPon(e.target.value)}
            />
            <InputWLabel
              label="ID Livre"
              placeholder="Posição"
              id="idLivre"
              onChange={(e: any) => setId(e.target.value)}
            />
            {selected.olt == "ERVINO" && oltCompany == "Intelbras" && (
              <>
                <InputWLabel
                  label="ID Onu"
                  placeholder="ID Onu"
                  id="idOnu"
                  onChange={(e: any) => setOnuId(e.target.value)}
                />
              </>
            )}
            <InputWLabel
              label="Cliente"
              placeholder="Nome"
              id="cliente"
              onChange={(e: any) => setCliente(e.target.value)}
            />
            <InputWLabel
              label="Vlan"
              placeholder="Custom Vlan"
              id="customVlan"
              onChange={(e: any) => setCustomVlan(e.target.value)}
            />
            <div className="flex w-full gap-2">
              <button
                type="reset"
                onClick={() => {
                  setSn("");
                  setPon("");
                  setId(null);
                  setOnuId(null);
                  setCliente("");
                  setConfigText("");
                  setCadastroText("");
                  setpppoeText("");
                  setpppoeText2("");
                  setOnuModel("");
                  setOnuType("");
                  setCustomVlan(null);
                }}
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
            className="lg:h-full min-h-[400px] lg:min-h-0 border-2 w-full rounded-md bg-gray-900 opacity-95 border-black shadow-sm outline-none focus:border-black focus:ring-black sm:text-md text-white p-4 z-0"
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
