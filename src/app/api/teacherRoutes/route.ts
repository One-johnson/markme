import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { supabaseServer } from "@/app/utils/supabase/server";
import { teacherSchema } from "@/app/validations/validationSchema";
import { generateTeacherId } from "@/app/utils/generateUniqueId";
import { generateRandomPassword } from "@/app/utils/generatePassword";
import { sendPasswordEmail } from "@/app/utils/emailService";

// Create a new teacher (POST)
export async function POST(req: Request) {
  const {
    name,
    email,
    subject,
    qualifications,
    certifications,
    yearsOfExperience,
    contactPhone,
    emergencyContact,
    address,
    salaryExpectation,
    profilePicture,
    references,
  } = await req.json();

  try {
    // Step 1: Check if a teacher already exists by email
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (existingTeacher) {
      return NextResponse.json(
        { error: "A teacher with this email already exists" },
        { status: 400 }
      );
    }

    // Generate random password
    const generatedPassword = generateRandomPassword();

    // Step 2: Create Supabase Auth User for the teacher
    const { data: authData, error: authError } =
      await supabaseServer.auth.signUp({
        email,
        password: generatedPassword,
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Step 3: Create the user in the database with 'TEACHER' role
    const user = await prisma.user.create({
      data: {
        email,
        username: name,
        role: "TEACHER", // Assign 'TEACHER' role
        supabaseUserId: authData.user?.id || "",
        phone: contactPhone || "",
      },
    });

    const teacherId = generateTeacherId(name);

    // Step 4: Create the teacher and link to the user
    const teacher = await prisma.teacher.create({
      data: {
        id: teacherId,
        name,
        email,
        subject,
        qualifications,
        certifications,
        yearsOfExperience,
        contactPhone,
        emergencyContact,
        address,
        salaryExpectation,
        profilePicture,
        references,
        userId: user.id,
      },
    });

    await sendPasswordEmail(email, generatedPassword);

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}

// Get all teachers (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      // Get a single teacher by ID
      const teacher = await prisma.teacher.findUnique({
        where: { id },
        include: { user: true }, // Optional: include user details
      });

      if (!teacher) {
        return NextResponse.json(
          { error: "Teacher not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(teacher, { status: 200 });
    } else {
      // Get all teachers
      const teachers = await prisma.teacher.findMany({
        include: { user: true }, // Optional: include user details
      });

      return NextResponse.json(teachers, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

// Update teacher information (PUT)
export async function PUT(req: Request) {
  const {
    id,
    name,
    email,
    subject,
    qualifications,
    certifications,
    yearsOfExperience,
    contactPhone,
    emergencyContact,
    address,
    salaryExpectation,
    profilePicture,
    references,
  } = await req.json();

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Missing teacher ID" },
        { status: 400 }
      );
    }

    // Validate and update teacher data (only provided fields will be updated)
    const validatedData = teacherSchema.partial().parse({
      name,
      email,
      subject,
      qualifications,
      certifications,
      yearsOfExperience,
      contactPhone,
      emergencyContact,
      address,
      salaryExpectation,
      profilePicture,
      references,
    });

    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedTeacher, { status: 200 });
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    );
  }
}

// Delete a teacher (DELETE)
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Missing teacher ID" },
        { status: 400 }
      );
    }

    // Find teacher by ID to ensure they exist
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Delete teacher and associated user (if necessary)
    await prisma.teacher.delete({
      where: { id },
    });

    // Optionally, delete the associated user
    if (teacher.userId) {
      await prisma.user.delete({
        where: { id: teacher.userId },
      });
    }

    return NextResponse.json(
      { message: "Teacher deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
