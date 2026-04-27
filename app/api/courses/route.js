import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function POST(req) {
    const { title, description } = await req.json();

    const course_code = Math.random().toString(36).substring(2, 8);
    const password = Math.random().toString(36).substring(2, 6);

    await mysqlPool.promise().query(
        "INSERT INTO courses (title, description, teacher_id, course_code, course_password) VALUES (?, ?, ?, ?, ?)",
        [title, description, 1, course_code, password] // temp teacher_id
    );

    return NextResponse.json({
        message: "Course created",
        course_code,
        password
    });
}