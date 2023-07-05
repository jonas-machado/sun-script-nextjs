import { User } from "@prisma/client";

export const cadastro = (
  comando: string | undefined,
  currentUser: User | null | undefined,
  selected: any,
  sn: string
) => {
  const name = currentUser!.name.split(" ")[0];
  const date = new Date();
  const dateFormat = `${("0" + date.getDate()).slice(-2)}/${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}/${date.getFullYear()}`;
  return `\
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
${name}: ${dateFormat}
OLT: ${selected.olt} (${selected.ip})
${comando}
ONU S/N: ${sn}
Sinal: 
CDA: 
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`;
};
