import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function POST(req) {
    try {
        const { title, description, teacher_id } = await req.json();

        if (!title || !teacher_id) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        const course_code = Math.random().toString(36).substring(2, 8);
        const password = Math.random().toString(36).substring(2, 6);

        await mysqlPool.promise().query(
            "INSERT INTO courses (title, description, teacher_id, course_code, course_password) VALUES (?, ?, ?, ?, ?)",
            [title, description || "", teacher_id, course_code, password]
        );

        return NextResponse.json({
            message: "Course created",
            course_code,
            password
        });

    } catch (error) {
        console.error("CREATE COURSE ERROR:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}