import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

// Create a dedicated Prisma client just for registration
// This avoids potential issues with shared instances
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

export async function POST(request: Request) {
  try {
    console.log("Registration process started");
    const body = await request.json();
    const { name, email, password } = body;
    
    console.log(`Attempting to register user: ${email}`);

    if (!name || !email || !password) {
      console.log("Missing required fields");
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Check if user with email already exists
      console.log(`Checking if user ${email} already exists`);
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      console.log("Database check completed", existingUser ? "User found" : "User not found");

      // If user exists, return error
      if (existingUser) {
        console.log(`User ${email} already exists`);
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 409 }
        );
      }

      console.log(`Creating new user: ${email}`);
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
          role: "USER", // Explicitly set role
        },
      });
      console.log(`User ${email} created successfully with ID: ${user.id}`);

      return NextResponse.json(
        { 
          message: "User registered successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      throw dbError; // Re-throw to be caught by outer try/catch
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    
    if (error.code) {
      console.error("Error code:", error.code);
    }
    
    return NextResponse.json(
      { message: `Registration failed: ${error.message}` },
      { status: 500 }
    );
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect();
  }
} 