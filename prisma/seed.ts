const { PrismaClient } = require("@prisma/client");
const prismadb = new PrismaClient();

async function schedule() {
  await prismadb.schedule.createMany({
    data: [
      {
        company: "OT",
        link: "https://docs.google.com/spreadsheets/d/12C5yx6Wkj471-evPhYjHaDFTXDIyDVYyg8zKBUb1sgk/edit#gid=1776649205",
        month: 7,
      },
      {
        company: "Atele",
        link: "https://docs.google.com/spreadsheets/d/1vN-ad64X6Bs0ojh6xp9Iz7xxVRZzpaeTQh9__vUwF50/edit#gid=1776649205",
        month: 7,
      },
      {
        company: "VOU",
        link: "https://docs.google.com/spreadsheets/d/1wYefG6dVwKXuZFQQOlc0e6qAMHE7pG1ipM9w1xEZHqM/edit#gid=1997288757",
        month: 7,
      },
      {
        company: "Xtele",
        link: "https://docs.google.com/spreadsheets/d/1UfNm5w6qy_zdV_m9HPf7tpckQRnk48heMZlol1yU-xI/edit#gid=1444777065",
        month: 7,
      },
    ],
  });
}

async function solutions() {
  await prismadb.solutions.createMany({
    data: [
      {
        title: "Como ganhar um aumento?",
        text: "Peça todos os dias para o nosso queridissimo Gambeta, tanto no discord como no whatsapp",
      },
      {
        title: "Faz mal conversar durante o expediente?",
        text: "Claro que não, precisamos conversar com nossos clientes assim como com os nossos colaboradores",
      },
      {
        title: "Estou mal, posso sair?",
        text: "Claro, apenas passar no RH para deixar sua assinatura",
      },
      {
        title: "Como faz para participar do sorteio dos ingressos?",
        text: "Isso é mais falso que 2 Anqi, totalmente manipulado e escolhido a dedo. Quer ganhar? Faça parte do comercial.",
      },
    ],
  });
}

async function intelbras() {
  await prismadb.oltIntelbras.createMany({
    data: [],
  });
}

async function datacom() {
  await prismadb.oltDatacom.createMany({
    data: [],
  });
}

async function olt() {
  await prismadb.olt.createMany({
    data: [
      { olt: "BS02", vlan: 645, ip: "172.16.87.2", brand: "ZTE" },
      { olt: "BRV04", ip: "172.16.49.50", brand: "ZTE" },
      { olt: "ITAPOA", vlan: 2296, ip: "172.16.42.150", brand: "ZTE" },
      { olt: "ITAPOA2", ip: "172.16.47.238", brand: "ZTE" },
      { olt: "ITINGA", vlan: 2241, ip: "172.16.61.2", brand: "ZTE" },
      { olt: "JOINVILLE", ip: "10.99.94.14", brand: "ZTE" },
      { olt: "MIRANDA", vlan: 461, ip: "172.16.45.3", brand: "ZTE" },
      { olt: "ITACOLOMI", vlan: 345, ip: "172.16.49.30", brand: "ZTE" },
      { olt: "PENHA", ip: "192.168.254.58", brand: "ZTE" },
      { olt: "PIÇARRAS", ip: "172.16.49.34", brand: "ZTE" },
      { olt: "SAGUAÇU", vlan: 2293, ip: "172.16.42.30", brand: "ZTE" },
      { olt: "VIAPIANA NEW", ip: "172.16.42.206", brand: "ZTE" },
      { olt: "VILA DA GLORIA", vlan: 79, ip: "172.16.42.46", brand: "ZTE" },
      { olt: "VILA NOVA", vlan: 2298, ip: "172.16.42.38", brand: "ZTE" },
      { olt: "NOVA BRASÍLIA", ip: "172.16.42.210", brand: "ZTE" },
      { olt: "ESTRADA DA ILHA", vlan: 3900, ip: "10.99.94.2", brand: "ZTE" },
      { olt: "JACU", vlan: 630, ip: "10.99.94.10", brand: "DATACOM" },
      { olt: "ITAPOCU", ip: "172.16.103.54", brand: "DATACOM" },
      { olt: "BRUSQUE", ip: "172.16.241.6", brand: "DATACOM" },
      { olt: "SNL101", ip: "172.16.66.2", brand: "DATACOM" },
      { olt: "BS01", ip: "172.16.88.2", brand: "DATACOM" },
      { olt: "ARQ01", ip: "192.168.254.66", brand: "DATACOM" },
      { olt: "GARUVA", vlan: 2215, ip: "172.16.42.14", brand: "INTELBRAS G" },
      { olt: "SFS", vlan: 2218, ip: "172.16.65.2", brand: "INTELBRAS G" },
      { olt: "ERVINO", vlan: 2298, ip: "172.16.42.126", brand: "INTELBRAS i" },
    ],
  });
}

const update = async () => {
  await prismadb.olt.update({
    where: {
      ip: "172.16.42.126",
    },
    data: { brand: "INTELBRAS I" },
  });
};

schedule()
  .then(async () => {
    await prismadb.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismadb.$disconnect();
    process.exit(1);
  });
