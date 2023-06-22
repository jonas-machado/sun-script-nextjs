export const vilaNova = (
  pon: string,
  id: number,
  sn: string,
  client: string,
  vlan: number | undefined | string,
  onuCompany?: string | undefined
) => {
  const name = client
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "_");

  if (onuCompany == "ZTEG") {
    return `\
interface gpon-olt_${pon}
onu ${id} type ZTE-F601 sn ${sn}
!
interface gpon-onu_${pon}:${id}
description ${name}
tcont 2 name Tcont100M profile OT
gemport 1 name Gemport1 unicast tcont 2 dir both queue 1
switchport mode trunk vport 1
switchport vlan ${vlan} tag vport 1
!
pon-onu-mng gpon-onu_${pon}:${id}
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
onu ${id} type ZTE-F601 sn ${sn}
!
interface gpon-onu_${pon}:${id}
description ${name}
tcont 2 name Tcont100M profile OT
gemport 1 name Gemport1 unicast tcont 2 dir both queue 1
switchport mode trunk vport 1
switchport vlan ${vlan} tag vport 1
! 
pon-onu-mng gpon-onu_${pon}:${id}
service inter gemport 1 vlan ${vlan}
performance ethuni eth_0/1 start
vlan port eth_0/1 mode tag vlan ${vlan}
!`;
  }
};
