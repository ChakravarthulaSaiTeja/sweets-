import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const data = await request.json();

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        value: data.value,
        minOrder: data.minOrder,
        couponCode: data.couponCode,
        maxUses: data.maxUses,
        userLimit: data.userLimit,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        combinable: data.combinable,
        active: data.active,
      },
    });

    return NextResponse.json({
      success: true,
      promotion,
    });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update promotion" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const data = await request.json();

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
        active: data.active,
      },
    });

    return NextResponse.json({
      success: true,
      promotion,
    });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update promotion" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    await prisma.promotion.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete promotion" },
      { status: 500 },
    );
  }
}
