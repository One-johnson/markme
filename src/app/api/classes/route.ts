import { prisma } from "@/app/lib/prisma";
import { ClassSchema } from "@/app/validations/validationSchema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const withStudents = searchParams.get("withStudents") === "true";
    const withTeacher = searchParams.get("withTeacher") === "true";

    const classes = await prisma.class.findMany({
      include: {
        teacher: withTeacher,
        students: withStudents,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(classes);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ClassSchema.parse(body);

    const newClass = await prisma.class.create({
      data: validatedData,
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Validation failed" },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    const validatedData = ClassSchema.partial().parse(updateData);
    const updatedClass = await prisma.class.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }

    // Check if class exists
    const existingClass = await prisma.class.findUnique({ where: { id } });
    if (!existingClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Prevent deletion if class has students
    const studentCount = await prisma.student.count({ where: { classId: id } });
    if (studentCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete class with students" },
        { status: 400 }
      );
    }

    await prisma.class.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 }
    );
  }
}
