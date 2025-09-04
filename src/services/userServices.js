//service digunakan untuk logika bisnis
//menggunakan prisma client untuk berinteraksi dengan database

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async ({ name, email, password }) => {
  return await prisma.user.create({
    data: { name, email, password },
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
};

const updateUser = async (id, { name, email, password }) => {
  return await prisma.user.update({
    where: { id: parseInt(id) },
    data: { name, email, password },
  });
};

const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
