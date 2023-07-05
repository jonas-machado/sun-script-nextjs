export const intelbrasG = (
  pon: string,
  id: number,
  sn: string,
  client: string,
  onuModel: string,
  vlan: number | undefined | string
) => {
  return onuModel == "ITBS"
    ? `\
onu set 1/${pon}/${id} meprof intelbras-110g vendorid ZNTS serno fsan ${sn}
create gpon-olt-onu-config 1-1-${pon}-${id}/gpononu
set serial-no-vendor-id = ITBS
commit gpon-olt-onu-config 1-1-${pon}-${id}/gpononu
bridge add 1-1-${pon}-${id}/gpononu downlink vlan ${vlan} tagged eth 1
port description add 1-1-${pon}-${id}/gpononu ${client}`
    : `\
onu set 1/${pon}/${id} meprof intelbras-110g vendorid ZNTS serno fsan ${sn}
bridge add 1-1-${pon}-${id}/gpononu downlink vlan ${vlan} tagged eth 1
port description add 1-1-${pon}-${id}/gpononu ${client}`;
};
