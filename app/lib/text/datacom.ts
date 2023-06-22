export const datacom = (
  pon: string,
  id: number,
  sn: string,
  client: string,
  onuType: string,
  selected: any,
  customProfile: string,
  vlan: number | undefined | string
) => {
  const profile = customProfile ? customProfile : "1000Mdow1000Mup";
  const profileOnt = customProfile
    ? customProfile
    : selected?.olt == "ARAQUARI"
    ? "PPPoEROUTER"
    : "PPPoE-ROUTER";
  return onuType != "ONT"
    ? `\
    interface gpon ${pon}
    onu ${id}
    name ${client}
    serial-number ${sn}
    line-profile ${profile}
    ethernet 1
    negotiation
    no shutdown
    top
    service-port new
    description ${client}
    gpon ${pon} onu ${id} gem 1 match vlan vlan-id any action vlan add vlan-id ${vlan}
    commit`
    : `\
    interface gpon ${pon}
    onu ${id}
    name ${client}
    serial-number ${sn}
    line-profile ${profileOnt}
    veip 1
    top
    service-port new
    description ${client}
    gpon ${pon} onu ${id} gem 1 match vlan vlan-id ${vlan} action vlan replace vlan-id ${vlan}
    commit`;
};
