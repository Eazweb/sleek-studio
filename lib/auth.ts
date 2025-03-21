import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";

// Define the Role enum locally to avoid the import error
enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
}

/**
 * Extended PrismaAdapter to handle custom fields like role
 */
export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    ...PrismaAdapter(prisma),
    // Override createUser to add role with default value
    createUser: async (data:any) => {
      const user = await prisma.user.create({
        data: {
          ...data,
          role: "USER", // Set default role when creating a user
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