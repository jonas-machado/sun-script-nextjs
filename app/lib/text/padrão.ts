export const chima = (
  pon: string,
  id: number,
  sn: string,
  client: string,
  vlan: number | undefined | string
) => {
  const name = client
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "_");

  return `\
interface gpon-olt_${pon}
onu ${id} type ZTE-F601 sn ${sn}
!
interface gpon-onu_${pon}:${id}
description ${name}
tcont 2 name Tcont100M profile OT
gemport 1 name Gemport1 tcont 2 queue 1
switchport mode trunk vport 1
service-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}
!
pon-onu-mng gpon-onu_${pon}:${id}
service inter gemport 1 vlan ${vlan}
performance ethuni eth_0/1 start
vlan port eth_0/1 mode tag vlan ${vlan}
!`;
};
export const zte = (
  pon: string,
  id: number,
  sn: string,
  client: string,
  vlan: number | undefined | string
) => {
  const name = client
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "_");

  return `\
interface gpon-olt_${pon}
onu ${id} type ZTE-F601 sn ${sn}
!
interface gpon-onu_${pon}:${id}
description ${name}
tcont 2 name Tcont100M profile OT
gemport 1 name Gemport1 tcont 2 queue 1
switchport mode trunk vport 1
service-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}
!
pon-onu-mng gpon-onu_${pon}:${id}
service dataservice gemport 1 cos 0 vlan ${vlan}
switchport-bind switch_0/1 iphost 1
vlan port eth_0/1 mode tag vlan ${vlan}
!`;
};
