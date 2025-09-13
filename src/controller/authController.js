const logger = require('../utils/logger')
const authService = require("../services/authServices");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);

    res.json({
      message: "Login berhasil",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
    logger.info(`User ${user.email} berhasil melakukan login`);
  } catch (error) {
    res.status(401).json({ message: error.message });
    logger.info(`Login gagal: ${error.message}`);
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

module.exports = { login, register };
