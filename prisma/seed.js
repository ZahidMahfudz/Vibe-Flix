const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const { generateUserId } = require('../src/utils/idGenerator')

const prisma = new PrismaClient()

async function main() {
  // Hapus data lama (opsional, hati-hati di production)
  await prisma.user.deleteMany()

  // Hash password
  const passwordAdmin = await bcrypt.hash('admin123', 10)

  // Tambah admin
  await prisma.user.create({
    data: {
      id_user : generateUserId(),
      name : 'Admin',
      email: 'admin@example.com',
      password: passwordAdmin,
      role: 'ADMIN',
    },
  })
}

main()
  .then(async () => {
    console.log('Seeding selesai')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
