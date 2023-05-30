const { PrismaClient } = require('@prisma/client');
const prismadb = new PrismaClient()

async function schedule() {
    await prismadb.schedule.create({
        data: 
          { company: "xtele",link: 'https://docs.google.com/spreadsheets/d/1mpCaERzInR_7qk_7glIQ0o1aU62DyAwkSwV1OtvNZBc/edit#gid=1444777065', month: 5},
     
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