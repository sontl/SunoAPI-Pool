import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function initializeCookiePool() {
  const cookie = process.argv[2]
  if (!cookie) {
    console.log('No cookie provided. Usage: npm run init-cookie-pool "<cookie>"')
    return
  }

  await prisma.cookie.create({
    data: { value: cookie.trim() }
  })
  console.log('Cookie added to the pool successfully')
}

initializeCookiePool().catch(console.error).finally(async () => {
  await prisma.$disconnect()
})
