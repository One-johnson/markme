import { NextResponse } from "next/server";
import { supabaseServer } from "@/app/utils/supabase/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabaseServer.auth.signInWithPassword({
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
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
