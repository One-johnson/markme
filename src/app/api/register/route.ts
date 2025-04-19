import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/app/utils/supabase/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, username, phone } = await req.json();

    // Check if an admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 403 }
      );
    }

    // Create Supabase Auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Auth error" },
        { status: 500 }
      );
    }

    // Save to Prisma as ADMIN
    await prisma.user.create({
      data: {
        email,
        username,
        phone,
        role: "ADMIN",
        supabaseUserId: data.user.id,
      },
    });

    return NextResponse.json(
      { message: "Admin registered successfully" },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Registration failed:", err.message);
    } else {
      console.error("Registration failed with an unknown error.");
    }
    console.error("Registration failed:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
