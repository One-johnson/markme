import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { ClassSchema } from "@/app/validations/validationSchema";

// Handle GET requests to fetch all classes or a single class
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const id = searchParams.get("id");
  const withStudents = searchParams.get("withStudents") === "true";
  const withTeacher = searchParams.get("withTeacher") === "true";

  try {
    if (action === "get-all") {
      const classes = await prisma.class.findMany({
        include: {
          students: withStudents,
          teacher: withTeacher,
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, classes });
    }

    if (action === "get" && id) {
      const singleClass = await prisma.class.findUnique({
        where: { id },
        include: {
          students: withStudents,
          teacher: withTeacher,
        },
      });
      if (!singleClass) {
        return NextResponse.json(
          { success: false, message: "Class not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, class: singleClass });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action or missing parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle POST requests to create a new class
export async function POST(req: Request) {
  try {
    const { name, description, teacherId } = await req.json();

    // Validate the input using Zod schema
    const validatedData = ClassSchema.parse({
      name,
      description,
      teacherId,
    });

    // Create a new class
    const newClass = await prisma.class.create({
      data: {
        ...validatedData,
      },
    });

    return NextResponse.json(
      { success: true, class: newClass },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle PUT requests to update a class
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing class ID" },
        { status: 400 }
      );
    }

    const { name, description, teacherId } = await req.json();

    // Validate the input using Zod schema
    const validatedData = ClassSchema.partial().parse({
      name,
      description,
      teacherId,
    });

    const updatedClass = await prisma.class.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, class: updatedClass });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle DELETE requests to delete a class
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing class ID" },
        { status: 400 }
      );
    }

    // Delete class
    await prisma.class.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Class deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
