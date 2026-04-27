import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = Date.now() + "_" + file.name;
        const filePath = path.join(process.cwd(), "public/uploads", fileName);

        await writeFile(filePath, buffer);

        return NextResponse.json({
            message: "Upload success",
            file_url: `/uploads/${fileName}`,
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Upload failed" });
    }
}