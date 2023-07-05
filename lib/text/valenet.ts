export const valenet = (
  pon: string,
  id: number,
  sn: string,
  client: string,
  vlan: number | undefined
) => {
  return `\
interface gpon-olt_${pon}
onu ${id} type ZTE-F601 sn ${sn}
!
interface gpon-onu_${pon}:${id}
description ${client}
tcont 2 name Tcont100M profile OT
gemport 1 name Gemport1 tcont 2 queue 1
switchport mode trunk vport 1
service-port 1 vport 1 user-vlan ${vlan} vlan ${vlan}
!
pon-onu-mng gpon-onu_${pon}:${id}
service dataservice gemport 1 cos 0 vlan ${vlan} 
performance ethuni eth_0/1 start
!`;
};
