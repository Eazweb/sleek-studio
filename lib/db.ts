import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

declare global {
  var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient;

try {
  if (process.env.NODE_ENV === "production") {
    prismaInstance = new PrismaClient();
    console.log("Created new Prisma instance in production mode");
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
      console.log("Created new Prisma instance in development mode");
    }
    prismaInstance = global.prisma;
    console.log("Using existing Prisma instance from global");
  }
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  throw error;
}

export const db = prismaInstance; 