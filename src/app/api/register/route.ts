import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { supabase } from "@/app/lib/supabaseClient";

export async function POST(req: Request) {
  const { email, password, fullName } = await req.json();

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
      fullName,
      role: "ADMIN",
      supabaseUserId: data.user.id,
    },
  });

  return NextResponse.json(
    { message: "Admin registered successfully" },
    { status: 201 }
  );
}
