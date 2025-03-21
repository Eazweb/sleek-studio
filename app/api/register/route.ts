import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // If user exists but doesn't have a password (e.g. Google login),
    // update the account with the password
    if (existingUser) {
      if (existingUser.hashedPassword) {
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 409 }
        );
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the existing user with the password
        const updatedUser = await prisma.user.update({
          where: {
            email,
          },
          data: {
            hashedPassword,
            name: name || existingUser.name, // Use provided name or keep existing
          },
        });

        return NextResponse.json(
          { 
            message: "Account updated successfully",
            user: {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
            }
          },
          { status: 200 }
        );
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

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
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
} 