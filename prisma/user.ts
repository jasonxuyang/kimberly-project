import { Role, User } from "@prisma/client";
import prisma from "./prisma";

// READ
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({});
  return users;
};

export const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

// CREATE
export const createUser = async (username: string, role: Role) => {
  const user = await prisma.user.create({
    data: {
      username,
      role,
    },
  });
  return user;
};

// UPDATE
export const updateUser = async (id: string, updateData: User) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...updateData,
    },
  });
  return user;
};

// DELETE
export const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  return user;
};
