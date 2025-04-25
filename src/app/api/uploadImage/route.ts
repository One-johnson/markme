import { NextRequest, NextResponse } from "next/server";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public/uploads/profileImages");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
async function toNodeRequest(request: Request): Promise<IncomingMessage> {
  const body = request.body as NodeReadableStream;
  const nodeReadable = Readable.fromWeb(body);

  const headers = Object.fromEntries(request.headers.entries());

  const nodeRequest = Object.assign(nodeReadable, {
    headers,
    method: request.method,
    url: "",
  });

  return nodeRequest as IncomingMessage;
}

async function parseForm(req: Request) {
  const nodeReq = await toNodeRequest(req);

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    filename: (_name, _ext, part) => {
      const ext = path.extname(part.originalFilename || "upload");
      return `${Date.now()}${ext}`;
    },
  });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseForm(req);
    const uploadedFile = Array.isArray(files.profileImage)
      ? files.profileImage[0]
      : (files.profileImage as File | undefined);

    if (!uploadedFile) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!uploadedFile.mimetype?.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads allowed" },
        { status: 400 }
      );
    }

    const filePath = `/uploads/profileImages/${path.basename(uploadedFile.filepath)}`;
    return NextResponse.json({ message: "Upload successful", filePath });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Something went wrong", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
