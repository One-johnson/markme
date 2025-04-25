import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createClient } from "@supabase/supabase-js";
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
    // ✅ Step 1: Verify access token from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // must be service role
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: "User not logged in" },
        { status: 401 }
      );
    }

    // ✅ Step 2: Check if teacher already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (existingTeacher) {
      return NextResponse.json(
        { error: "A teacher with this email already exists" },
        { status: 400 }
      );
    }

    // ✅ Step 3: Generate password and create new Supabase Auth user
    const generatedPassword = generateRandomPassword();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: generatedPassword,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // ✅ Step 4: Create user and teacher in a transaction
    const [newUser, newTeacher] = await prisma.$transaction([
      prisma.user.create({
        data: {
          email,
          username: name,
          role: "TEACHER",
          supabaseUserId: authData.user?.id || "",
          phone: contactPhone || "",
        },
      }),
      prisma.teacher.create({
        data: {
          id: generateTeacherId(name),
          name,
          email,
          subject,
          qualifications,
          certifications,
          yearsOfExperience: yearsOfExperience?.toString() || null,
          contactPhone,
          emergencyContact,
          address,
          salaryExpectation: salaryExpectation?.toString() || null,
          profilePicture,
          references,
          userId: "", // will be updated next
        },
      }),
    ]);

    // ✅ Step 5: Link teacher to user
    const updatedTeacher = await prisma.teacher.update({
      where: { id: newTeacher.id },
      data: { userId: newUser.id },
    });

    // ✅ Step 6: Send password via email
    await sendPasswordEmail(email, generatedPassword);

    return NextResponse.json(updatedTeacher, { status: 201 });
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
      yearsOfExperience:
        yearsOfExperience !== undefined && yearsOfExperience !== null
          ? Number(yearsOfExperience)
          : null,
      contactPhone,
      emergencyContact,
      address,
      salaryExpectation: salaryExpectation?.toString() || null,
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
