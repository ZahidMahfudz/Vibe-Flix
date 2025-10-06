const {prisma} = require("../config/db");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const logger = require('../utils/logger');
const { generateUserId, generateRefreshTokenId } = require("../utils/idGenerator");


async function login(email, password) {
  logger.debug(`memasuki service login dengan email : ${email} dan password : ${password}`)
  logger.debug(`mencari user dengan email : ${email} di database`)
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
  
  // Generate JWT token
  logger.debug(`mengenerate token untuk user id : ${user.id_user}, email : ${user.email}, role : ${user.role}`)

  logger.debug(`membuat json userData sebagai payload token`)

  const userData = {
    id_user : user.id_user,
    name : user.name,
    email : user.email,
    role : user.role
  }

  logger.debug(`payload token : ${JSON.stringify(userData)}`)
  logger.debug(`melakukan generate access token menggunakan payload di atas`)
  const accessToken = generateAccessToken(userData);
  logger.debug(`access token berhasil digenerate : ${accessToken}`)
  logger.debug(`melakukan generate refresh token menggunakan payload di atas`)
  const refreshToken = generateRefreshToken(userData);
  logger.debug(`refresh token berhasil digenerate : ${refreshToken}`)

  logger.debug(`menyimpan refresh token kedalam database`)

  const expiresInDays = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) || 7;
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data : {
      id_refresh_token : generateRefreshTokenId(),
      tokenHash : refreshToken,
      userId : userData.id_user,
      expiresAt : expiresAt
    }
  })
  logger.debug(`berhasil menyimpan refresh Token kedalam database`)

  logger.debug(`autentikasi ${user.email} berhasil`);
  logger.debug(`mengembalikan token dan data user kecuali password ke controller`)

  return { userData, token: { accessToken, refreshToken } };
}

async function logout(userId, refreshToken){
  logger.debug(`Memulai proses logout untuk userId: ${userId}`);

  try {
    // Hapus refresh token yang cocok di database
    const deleted = await prisma.refreshToken.deleteMany({
      where: {
        userId,
        tokenHash: refreshToken,
      },
    });

    if (deleted.count > 0) {
      logger.debug(`Berhasil menghapus ${deleted.count} refresh token untuk userId: ${userId}`);
    } else {
      logger.warn(`Tidak ditemukan refresh token yang cocok untuk userId: ${userId}`);
    }

    return true;
  } catch (error) {
    logger.error(`Gagal menghapus refresh token: ${error.message}`);
    throw new Error("Gagal logout dari sistem");
  }
}

async function refreshAccessToken(refreshToken){
  logger.debug(`Memulai proses refresh token...`);

  // 1️⃣ Verifikasi refresh token
  const decoded = verifyRefreshToken(refreshToken);
  logger.debug(`Refresh token terverifikasi: ${JSON.stringify(decoded)}`);

  // 2️⃣ Cek di database apakah refresh token valid
  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash: refreshToken },
  });

  if (!storedToken) {
    logger.warn("Refresh token tidak ditemukan di database");
    throw new Error("Refresh token tidak valid");
  }

  // 3️⃣ Cek apakah sudah kadaluarsa
  if (new Date() > new Date(storedToken.expiresAt)) {
    logger.warn("Refresh token telah kadaluarsa");
    throw new Error("Refresh token kadaluarsa");
  }

  // 4️⃣ Generate access token baru
  const newAccessToken = generateAccessToken({
    id_user: decoded.id_user,
    name: decoded.name,
    email: decoded.email,
    role: decoded.role,
  });

  logger.debug(`Access token baru berhasil dibuat untuk user: ${decoded.email}`);

  return newAccessToken
}

async function register(name, email, password, role = "USER") {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    logger.debug(`email ${email} sudah terdaftar`);
    throw new Error("Email sudah terdaftar");
  }

  const newIdUser = generateUserId();
  logger.debug(`berhasil generate id user baru : ${newIdUser}`)

  const hashedPassword = await bcrypt.hash(password, 10);
  logger.debug(`${password} berhasil di-hashing menjadi ${hashedPassword}`)

  logger.debug(`menjalankan prisma.user.create`)
  const user = await prisma.user.create({
    data: { 
      id_user : newIdUser,
      name, 
      email, 
      password: hashedPassword, 
      role 
    },
  });
  logger.debug(`berhasil menambahkan id : ${user.id_user}, name : ${user.name}, email : ${user.email}, password : ${user.password}, role : ${user.role} ke database user`)

  return user;
}

module.exports = { login, logout, register, refreshAccessToken };
