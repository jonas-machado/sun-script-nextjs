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
      { olt: "GARUVA", vlan: 2215 },
      { olt: "SFS", vlan: 2218 },
      { olt: "PIÇARRAS", vlan: 300 },
      { olt: "ERVINO", vlan: 2298 },
    ],
  });
}

async function datacom() {
  await prismadb.oltDatacom.create({
    data: { olt: "JACU", vlan: 630 },
  });
}

solutions()
  .then(async () => {
    await prismadb.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismadb.$disconnect();
    process.exit(1);
  });
