const { PrismaClient } = require('@prisma/client');
const prismadb = new PrismaClient()

async function ztechima() {
    await prismadb.oltZteChima.createMany({
        data: [
          { olt: 'BS02', vlan: 645},
          { olt: 'BRV04'},
          { olt: 'ITAPOA', vlan: 2296},
          { olt: 'ITAPOA2'},
          { olt: 'ITINGA', vlan: 2241},
          { olt: 'JOINVILLE'},
          { olt: 'MIRANDA', vlan: 461},
          { olt: 'ITACOLOMI', vlan: 345},
          { olt: 'PENHA'},
          { olt: 'PIÇARRAS'},
          { olt: 'SAGUAÇU', vlan: 2293},
          { olt: 'VIAPIANA NEW'},
          { olt: 'VILA DA GLORIA', vlan: 79},
          { olt: 'VILA NOVA', vlan: 2298},
          { olt: 'NOVA BRASÍLIA'},
        ],
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
  await prismadb.oltDatacom .createMany({
      data: [
        { olt: 'ARAQUARI'},
        { olt: 'BS1'},
        { olt: 'ITAPOCU'},
        { olt: 'SNL101'},
      ],
    })
}

intelbras()
  .then(async () => {
    await prismadb.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismadb.$disconnect()
    process.exit(1)
  })