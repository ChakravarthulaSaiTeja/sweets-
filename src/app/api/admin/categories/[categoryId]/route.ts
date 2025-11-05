/**
 * Admin Category Detail API Route
 * PUT /api/admin/categories/[categoryId] - Update category
 * DELETE /api/admin/categories/[categoryId] - Delete category
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{
    categoryId: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await requireAuth();
    
    if ((user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { categoryId } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updateData,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await requireAuth();
    
    if ((user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { categoryId } = await params;

    // Soft delete - set isActive to false
    await prisma.category.update({
      where: { id: categoryId },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}

