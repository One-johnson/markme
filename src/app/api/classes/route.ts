import { prisma } from "@/app/lib/prisma";
import { ClassSchema } from "@/app/validations/validationSchema";
import { z } from "zod";
import { NextResponse } from "next/server";

// Extended schema for update
const ClassUpdateSchema = ClassSchema.partial().extend({
  id: z.string(),
});

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
  } catch (error) {
    console.error("GET /classes error:", error);
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
    console.error("POST /classes error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Validation failed" },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const validatedData = ClassUpdateSchema.parse(data);
    const { id, ...updateData } = validatedData;

    const updatedClass = await prisma.class.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error("PUT /classes error:", error);
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

    const existingClass = await prisma.class.findUnique({ where: { id } });
    if (!existingClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const studentCount = await prisma.student.count({ where: { classId: id } });
    if (studentCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete class with students" },
        { status: 400 }
      );
    }

    await prisma.class.delete({ where: { id } });

    return new NextResponse(null, { status: 204 }); // Or send a message with status 200 if preferred
  } catch (error) {
    console.error("DELETE /classes error:", error);
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 }
    );
  }
}
