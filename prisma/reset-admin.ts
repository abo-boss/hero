import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'cxbyy129@126.com'
  const password = 'cxb63607'
  const hashedPassword = await bcrypt.hash(password, 10)

  // Clean up existing user to be sure
  try {
    await prisma.user.delete({ where: { email } })
  } catch (e) {}

  const user = await prisma.user.create({
    data: {
      email,
      name: 'Admin',
      password: hashedPassword,
    },
  })

  console.log(`
Admin User Reset Success!
Email: ${user.email}
Password: ${password}
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
