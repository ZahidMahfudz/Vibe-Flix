const logger = require('../utils/logger')
const authService = require("../services/authServices");
const { oauth2Client, authorizationUrl } = require('../config/google');
const {google} = require('googleapis')
const { prisma } = require('../config/db');
const { generateUserId } = require('../utils/idGenerator');

async function login(req, res) {
  try {
    logger.debug('masuk ke controller login')
    logger.debug(`req.body : ${JSON.stringify(req.body)}`)
    const { email, password } = req.body;
    const { userData, token } = await authService.login(email, password);

    // Simpan token ke cookie (HTTP-only untuk keamanan)
    const accessTokenMaxAge = 15 * 60 * 1000; // 15 menit
    const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 hari

    res.cookie("accessToken", token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: accessTokenMaxAge,
    });

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: refreshTokenMaxAge,
    });

    logger.info(`User ${userData.email} berhasil login, token disimpan di cookie`);

    logger.info(`User ${userData.email} berhasil melakukan login`);

    res.json({
      message: "Login berhasil",
      userData,
      token
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
    logger.info(`Login gagal: ${error.message}`);
  }
}

async function logout(req, res){
  try {
    const id_user = req.user.id_user
    const refreshToken = req.cookies.refreshToken

    logger.debug(`Logout request diterima untuk user ID: ${id_user}`)

    if (!refreshToken) {
      logger.warn("Tidak ada refresh token di cookie");
      return res.status(400).json({ message: "Refresh token tidak ditemukan" });
    }

    // Panggil service untuk hapus refresh token dari database
    await authService.logout(id_user, refreshToken);

    // Hapus cookie
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    logger.info(`User ${id_user} berhasil logout`);
    return res.status(200).json({ message: "Logout berhasil" });

  } catch (error) {
    logger.error(`Logout gagal: ${error.message}`);
    return res.status(500).json({ message: "Gagal logout" });
  }
}

async function refreshToken(req, res){
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      logger.warn("Tidak ada refresh token pada cookie");
      return res.status(401).json({ message: "Refresh token tidak ditemukan" });
    }

    logger.debug("Refresh token ditemukan, memproses verifikasi...");

    // Gunakan service
    const newAccessToken = await authService.refreshAccessToken(refreshToken)

    // Simpan access token baru di cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 menit
    });

    logger.info("Access token berhasil diperbarui");

    return res.status(200).json({
      message: "Access token diperbarui",
      accessToken: newAccessToken,
    });

  } catch (error) {
    
  }
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const user = await authService.register(name, email, password, role);

    res.status(201).json({
      message: "Registrasi berhasil",
      user: { 
        id: user.id,
        name: user.name, 
        email: user.email, 
        role: user.role },
      redirect : "/login",
    });
    logger.info(`Register user ${user.name} dengan email ${user.email} berhasil`);
  } catch (error) {
    res.status(400).json({ message: error.message });
    logger.info(`Register gagal: ${error.message}`);
  }
}

async function googleLogin(req, res) {
  try {
    logger.debug('masuk ke controller google login')
    res.redirect(authorizationUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
    logger.error(`Google login gagal: ${error.message}`);
  }
}

async function googleCallback(req, res){
  try {
    const {code} = req.query

    logger.debug(`code query : ${code}`)

    const {tokens} = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const oauth2 = google.oauth2({
      auth : oauth2Client,
      version : 'v2'
    })

    const {data: googleUserData} = await oauth2.userinfo.get();
    logger.debug(`Google user data: ${JSON.stringify(googleUserData)}`);

    const result = await authService.googleAuthService(googleUserData)
    
    res.status(200).json({
      massage : "Login Google Auth Success",
      userData : result.userData,
      token : result.token
    })
  } catch (error) {
    logger.error(`Google callback gagal: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { login, logout, register, refreshToken, googleLogin, googleCallback };
