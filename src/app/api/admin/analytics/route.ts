/**
 * Admin Analytics API Route
 * GET /api/admin/analytics - Get analytics data
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

    // Get analytics data
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      lowStockVariants,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          paymentStatus: "PAID",
        },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orderItems: {
            take: 3,
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.variant.findMany({
        where: {
          inventoryQty: {
            lte: 10,
          },
          isActive: true,
        },
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
        take: 10,
      }),
    ]);

    const activePromotions = await prisma.promotion.count({
      where: {
        active: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    const analytics = {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      activePromotions,
      recentOrders,
      lowStockVariants,
      ordersByStatus: {
        pending: await prisma.order.count({ where: { status: "PENDING" } }),
        confirmed: await prisma.order.count({ where: { status: "CONFIRMED" } }),
        shipped: await prisma.order.count({ where: { status: "SHIPPED" } }),
        delivered: await prisma.order.count({ where: { status: "DELIVERED" } }),
      },
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

