import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const promotions = await prisma.promotion.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      promotions,
    });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch promotions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const data = await request.json();

    const promotion = await prisma.promotion.create({
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
    console.error("Error creating promotion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create promotion" },
      { status: 500 },
    );
  }
}
