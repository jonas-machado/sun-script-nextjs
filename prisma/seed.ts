const { PrismaClient } = require('@prisma/client');
const prismadb = new PrismaClient()

async function schedule() {
    await prismadb.schedule.createMany({
        data: [
          { company: "OT",link: 'https://docs.google.com/spreadsheets/d/1Pe0mZoDmXIAYkvECTKHY11KQflyoNFWNXGC7Ee8iA6M/edit#gid=1776649205', month: 6},
          { company: "Atele",link: 'https://docs.google.com/spreadsheets/d/15ELh_dBry1yzodZL1NT2wB5dwAQY2HFTjsquJykJM-c/edit?usp=sharing', month: 6},
          { company: "VOU",link: 'https://docs.google.com/spreadsheets/d/1JLVKJ_acu9NCiQ9PwxwTCQTvFKuedrp4m2u5mfrkOZo/edit#gid=1997288757', month: 6},
          { company: "Xtele",link: 'https://docs.google.com/spreadsheets/d/1CXAD1PXYHQjy3ijLOn9Vr-wMX-sCNTeVo0MldhsdK74/edit#gid=676781342', month: 6},
        ]
      })
}

async function intelbras() {
  await prismadb.oltIntelbras.createMany({
      data: [
        { olt: 'GARUVA', vlan: 2215},
        { olt: 'SFS', vlan: 2218},
        { olt: 'PIÇARRAS', vlan: 300},
        { olt: 'ERVINO', vlan: 2298},
      ],
    })
}

async function datacom() {
  await prismadb.oltDatacom .create({
      data: 
        { olt: 'JACU',vlan: 630},
      
    })
}

schedule()
  .then(async () => {
    await prismadb.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismadb.$disconnect()
    process.exit(1)
  })