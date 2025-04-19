import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma"; // Adjust path as needed
import { supabase } from "@/app/utils/supabase/client"; // Adjust path as needed

// Create Student - with Supabase Auth and linking the User model
export async function POST(req: Request) {
  const { name, email, password, classId, parentId, profileImage } =
    await req.json();

  try {
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "A student with this email already exists" },
        { status: 400 }
      );
    }

    // Step 1: Create Supabase Auth User for the student
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Step 2: Create the user in the database with 'STUDENT' role
    const user = await prisma.user.create({
      data: {
        email,
        username: name,
        role: "STUDENT", // Assign 'STUDENT' role
        supabaseUserId: authData.user?.id || "",
        phone: "", // Modify if needed
      },
    });

    // Step 3: Create the student and link to user, class, and parent
    const student = await prisma.student.create({
      data: {
        name,
        email,
        profileImage,
        classId,
        parentId,
        userId: user.id,
        supabaseUserId: authData.user?.id || "",
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

// Get All Students
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    // Get Single Student by ID
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          class: true,
          parent: true,
        },
      });

      if (!student) {
        return NextResponse.json(
          { error: "Student not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(student, { status: 200 });
    } catch (error) {
      console.error("Error fetching student by ID:", error);
      return NextResponse.json(
        { error: "Failed to fetch student" },
        { status: 500 }
      );
    }
  } else {
    // Get All Students
    try {
      const students = await prisma.student.findMany({
        include: {
          class: true,
          parent: true,
        },
      });
      return NextResponse.json(students, { status: 200 });
    } catch (error) {
      console.error("Error fetching students:", error);
      return NextResponse.json(
        { error: "Failed to fetch students" },
        { status: 500 }
      );
    }
  }
}

// Update Student
export async function PUT(req: Request) {
  const { id, name, email, profileImage, classId, parentId } = await req.json();

  try {
    const student = await prisma.student.update({
      where: { id },
      data: {
        name,
        email,
        profileImage,
        classId,
        parentId,
      },
    });

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// Delete Student
export async function DELETE(req: Request) {
  const { id } = await req.json();

  try {
    // Step 1: Find student by id
    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true, // Explicitly select userId
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Step 2: Delete student and associated user (if necessary)
    await prisma.student.delete({
      where: { id },
    });

    // Optionally, you may also want to delete the user associated with the student
    if (student.userId) {
      await prisma.user.delete({
        where: { id: student.userId },
      });
    }

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
