const { PrismaClient } = require("@prisma/client");

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

module.exports = prisma;
