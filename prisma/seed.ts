const { PrismaClient } = require("@prisma/client");
const prismadb = new PrismaClient();

async function schedule() {
  await prismadb.schedule.createMany({
    data: [
      {
        company: "OT",
        link: "https://docs.google.com/spreadsheets/d/1Pe0mZoDmXIAYkvECTKHY11KQflyoNFWNXGC7Ee8iA6M/edit#gid=1776649205",
        month: 6,
      },
      {
        company: "Atele",
        link: "https://docs.google.com/spreadsheets/d/15ELh_dBry1yzodZL1NT2wB5dwAQY2HFTjsquJykJM-c/edit?usp=sharing",
        month: 6,
      },
      {
        company: "VOU",
        link: "https://docs.google.com/spreadsheets/d/1JLVKJ_acu9NCiQ9PwxwTCQTvFKuedrp4m2u5mfrkOZo/edit#gid=1997288757",
        month: 6,
      },
      {
        company: "Xtele",
        link: "https://docs.google.com/spreadsheets/d/1CXAD1PXYHQjy3ijLOn9Vr-wMX-sCNTeVo0MldhsdK74/edit#gid=676781342",
        month: 6,
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
    data: [
      { olt: "GARUVA", vlan: 2215, ip: "172.16.42.14" },
      { olt: "SFS", vlan: 2218, ip: "172.16.65.2" },
      { olt: "ERVINO", vlan: 2298, ip: "172.16.42.126" },
    ],
  });
}

async function datacom() {
  await prismadb.oltDatacom.createMany({
    data: [
      { olt: "JACU", vlan: 630, ip: "10.99.94.10" },
      { olt: "ITAPOCU", ip: "172.16.103.54" },
      { olt: "BRUSQUE", ip: "172.16.241.6" },
      { olt: "SNL101", ip: "172.16.66.2" },
      { olt: "BS01", ip: "172.16.88.2" },
      { olt: "ARQ01", ip: "192.168.254.66" },
    ],
  });
}

async function zte() {
  await prismadb.oltZteChima.createMany({
    data: [
      { olt: "BS02", vlan: 645, ip: "172.16.87.2" },
      { olt: "BRV04", ip: "172.16.49.50" },
      { olt: "ITAPOA", vlan: 2296, ip: "172.16.42.150" },
      { olt: "ITAPOA2", ip: "172.16.47.238" },
      { olt: "ITINGA", vlan: 2241, ip: "172.16.61.2" },
      { olt: "JOINVILLE", ip: "10.99.94.14" },
      { olt: "MIRANDA", vlan: 461, ip: "172.16.45.3" },
      { olt: "ITACOLOMI", vlan: 345, ip: "172.16.49.30" },
      { olt: "PENHA", ip: "192.168.254.58" },
      { olt: "PIÇARRAS", ip: "172.16.49.34" },
      { olt: "SAGUAÇU", vlan: 2293, ip: "172.16.42.30" },
      { olt: "VIAPIANA NEW", ip: "172.16.42.206" },
      { olt: "VILA DA GLORIA", vlan: 79, ip: "172.16.42.46" },
      { olt: "VILA NOVA", vlan: 2298, ip: "172.16.42.38" },
      { olt: "NOVA BRASÍLIA", ip: "172.16.42.210" },
      { olt: "ESTRADA DA ILHA", vlan: 3900, ip: "10.99.94.2" },
    ],
  });
}

const datacomUp = async () => {
  await prismadb.oltDatacom.update({
    where: {
      ip: "192.168.254.66",
    },
    data: { olt: "ARAQUARI" },
  });
};

datacomUp()
  .then(async () => {
    await prismadb.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismadb.$disconnect();
    process.exit(1);
  });
