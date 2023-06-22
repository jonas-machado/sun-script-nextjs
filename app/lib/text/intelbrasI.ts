export const intelbrasI = (
  pon: string,
  id: number,
  onuId: number,
  client: string,
  vlan: number | undefined | string
) => {
  return `\
onu set gpon ${pon} onu ${id} id ${onuId} meprof intelbras-110g
bridge add gpon ${pon} onu ${id} downlink vlan ${vlan} tagged eth 1
onu description add gpon ${pon} onu ${id} text ${client}`;
};
