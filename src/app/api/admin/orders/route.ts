/**
 * Admin Orders API Route
 * GET /api/admin/orders - Get all orders (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    if ((user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: {
      status?: string;
      OR?: Array<{
        orderNumber?: { contains: string; mode: "insensitive" };
        addressName?: { contains: string; mode: "insensitive" };
        addressPhone?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { addressName: { contains: search, mode: "insensitive" } },
        { addressPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

