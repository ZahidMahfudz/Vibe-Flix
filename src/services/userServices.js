//service digunakan untuk logika bisnis
//menggunakan prisma client untuk berinteraksi dengan database

// const { PrismaClient } = require("@prisma/client");
const { prisma } = require("../config/db");
const bcrypt = require("bcrypt");
// const prisma = new PrismaClient();

const createUser = async ({ name, email, role, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: { name, email, role, password : hashedPassword},
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
  const hashedPassword = await bcrypt.hash(password, 10);
  
  if(!hashedPassword){
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
    });
  }

  return await prisma.user.update({
    where: { id: parseInt(id) },
    data: { name, email, password : hashedPassword },
  });
};

const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
