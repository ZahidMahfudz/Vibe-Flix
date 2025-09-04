const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const prisma = new PrismaClient();

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Email atau password salah");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Email atau password salah");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user };
}

async function register(email, password, role = "USER") {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, role },
  });

  return user;
}

module.exports = { login, register };
