import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";
import { prisma } from "@/app/lib/prisma"; // make sure this path matches your project

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: error?.message || "Login failed" },
      { status: 401 }
    );
  }

  const prismaUser = await prisma.user.findUnique({
    where: {
      supabaseUserId: data.user.id,
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  });

  if (!prismaUser) {
    return NextResponse.json(
      { error: "User not found in application database" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: "Login successful",
      session: data.session,
      user: prismaUser,
    },
    { status: 200 }
  );
}
