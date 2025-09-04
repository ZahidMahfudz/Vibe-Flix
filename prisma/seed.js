const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // Hapus data lama (opsional, hati-hati di production)
  await prisma.user.deleteMany()

  // Hash password
  const passwordUser = await bcrypt.hash('password123', 10)
  const passwordAdmin = await bcrypt.hash('admin123', 10)

  // Tambah user biasa
  await prisma.user.create({
    data: {
      name : 'Zahid Muhammad',
      email: 'user@example.com',
      password: passwordUser,
      role: 'USER',
    },
  })

  // Tambah admin
  await prisma.user.create({
    data: {
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
