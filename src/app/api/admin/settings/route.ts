/**
 * Admin Settings API Route
 * GET /api/admin/settings - Get all settings
 * PUT /api/admin/settings - Update settings
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

    // Get or create default settings
    let settings = await prisma.settings.findUnique({
      where: { key: "general" },
    });

    if (!settings) {
      // Create default settings
      settings = await prisma.settings.create({
        data: {
          key: "general",
          storeName: "Kotaiah's Foods",
          storeEmail: "info@kotaiahsweets.com",
          storePhone: "+91 9876543210",
          storeAddress: "123 Heritage Street, Old City, Hyderabad, Telangana 500001",
          taxRate: 18,
          shippingCost: 50,
          freeShippingThreshold: 500,
          deliverySlots: ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"],
          currency: "INR",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    if ((user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      storeName,
      storeEmail,
      storePhone,
      storeAddress,
      taxRate,
      shippingCost,
      freeShippingThreshold,
      deliverySlots,
      currency,
    } = body;

    // Update or create settings
    const settings = await prisma.settings.upsert({
      where: { key: "general" },
      update: {
        storeName: storeName !== undefined ? storeName : undefined,
        storeEmail: storeEmail !== undefined ? storeEmail : undefined,
        storePhone: storePhone !== undefined ? storePhone : undefined,
        storeAddress: storeAddress !== undefined ? storeAddress : undefined,
        taxRate: taxRate !== undefined ? Number(taxRate) : undefined,
        shippingCost: shippingCost !== undefined ? Number(shippingCost) : undefined,
        freeShippingThreshold: freeShippingThreshold !== undefined ? Number(freeShippingThreshold) : undefined,
        deliverySlots: deliverySlots !== undefined ? deliverySlots : undefined,
        currency: currency !== undefined ? currency : undefined,
      },
      create: {
        key: "general",
        storeName: storeName || "Kotaiah's Foods",
        storeEmail: storeEmail || "info@kotaiahsweets.com",
        storePhone: storePhone || "+91 9876543210",
        storeAddress: storeAddress || "123 Heritage Street, Old City, Hyderabad, Telangana 500001",
        taxRate: taxRate !== undefined ? Number(taxRate) : 18,
        shippingCost: shippingCost !== undefined ? Number(shippingCost) : 50,
        freeShippingThreshold: freeShippingThreshold !== undefined ? Number(freeShippingThreshold) : 500,
        deliverySlots: deliverySlots || ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"],
        currency: currency || "INR",
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

