import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        addresses: true,
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { role } = body;

    if (!role) {
      return new NextResponse("Role is required", { status: 400 });
    }

    const user = await db.user.update({
      where: { id: params.userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Verify admin access
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Prevent deleting the current user
    if (session.user.id === params.userId) {
      return new NextResponse("Cannot delete your own account", { status: 400 });
    }

    await db.user.delete({
      where: { id: params.userId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 