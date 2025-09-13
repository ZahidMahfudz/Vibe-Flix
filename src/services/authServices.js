const {prisma} = require("../config/db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const logger = require('../utils/logger');


async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    logger.debug(`user dengan ${email} tidak ditemukan`)
    throw new Error("Email atau password salah");
  }
  logger.debug(`user dengan email : ${email} ditemukan`)

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    logger.debug(`${user.email} dengan password : ${password} tidak sesuai`)
    throw new Error("Email atau password salah");
  }
  logger.debug(`password ${password} valid`)
  
  logger.debug(`autentikasi ${user.email} berhasil`);

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  logger.debug(`token berhasil digenerate : ${token}`)

  return { token, user };
}

async function register(name, email, password, role = "USER") {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    logger.debug(`email ${email} sudah terdaftar`);
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  logger.debug(`${password} berhasil di-hashing menjadi ${hashedPassword}`)

  logger.debug(`menjalankan prisma.user.create`)
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });
  logger.debug(`berhasil menambahkan id : ${user.id}, name : ${user.name}, email : ${user.email}, password : ${user.password}, role : ${user.role} ke database user`)

  return user;
}

module.exports = { login, register };
