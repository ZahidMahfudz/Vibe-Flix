const { PrismaClient } = require("@prisma/client");
const logger = require("../utils/logger");

// if (!process.env.DATABASE_URL) {
//   logger.error("DATABASE_URL is not set in environment variables.");
//   throw new Error("DATABASE_URL is not set in environment variables.");
// }

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

async function connectDB(){
    try {
        await prisma.$connect();
        logger.info(`Berhasil terhubung ke database ${process.env.DATABASE_URL}`);
    } catch (error) {
        logger.error("Gagal terhubung ke database:", error);
        throw error;
    }
}

module.exports = {prisma, connectDB}
