import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

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

  return NextResponse.json(
    {
      message: "Login successful",
      session: data.session,
      user: data.user,
    },
    { status: 200 }
  );
}
