import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, Role } from "@prisma/client";
import { Adapter } from "next-auth/adapters";

/**
 * Extended PrismaAdapter to handle custom fields like role
 */
export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    ...PrismaAdapter(prisma),
    // Override createUser to add role with default value
    createUser: async (data) => {
      const user = await prisma.user.create({
        data: {
          ...data,
          role: Role.USER, // Set default role when creating a user
        },
      });
      return user;
    },
    // Custom implementations for user handling
    getUserByEmail: async (email) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return user;
    },
    getUser: async (id) => {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    },
  };
} 