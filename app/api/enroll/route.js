import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";


export async function POST(req) {
    try {
        const { code, password, student_id, role } = await req.json();
        console.log("ENROLL INPUT:", { code, password, student_id, role });

        if (!code || !password || !student_id || !role) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        if (role !== "student") {
            return NextResponse.json({ error: "Only students can enroll" }, { status: 403 });
        }

        // 1) Find course
        const [courseRows] = await mysqlPool.promise().query(
            "SELECT * FROM courses WHERE course_code = ? AND course_password = ?",
            [code, password]
        );

        if (courseRows.length === 0) {
            return NextResponse.json({ error: "Invalid code or password" }, { status: 400 });
        }

        const courseId = courseRows[0].id;//Extract course ID for later use

        // 2) Prevent duplicate enrollment
        const [existing] = await mysqlPool.promise().query(
            "SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?",
            [student_id, courseId]
        );

        if (existing.length > 0) {
            return NextResponse.json({ error: "Already enrolled" }, { status: 400 });
        }

        // 3) Insert
        await mysqlPool.promise().query(
            "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
            [student_id, courseId]
        );

        return NextResponse.json({ message: "Enrolled successfully" });

    } catch (err) {
        console.error("ENROLL ERROR:", err); // 🔥 check terminal
        return NextResponse.json(
            { error: "Server error", details: String(err.message || err) },
            { status: 500 }
        );
    }
}