import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET lectures
export async function GET(req) {
    try {
        const course_id = req.nextUrl.searchParams.get("course_id");
        const user_id = req.nextUrl.searchParams.get("user_id");
        const role = req.nextUrl.searchParams.get("role");

        if (!course_id || !user_id || !role) {
            return NextResponse.json({ error: "Unauthorized" });
        }

        // 🧠 If TEACHER → check ownership
        if (role === "teacher") {
            const [course] = await mysqlPool.promise().query(
                "SELECT * FROM courses WHERE id = ? AND teacher_id = ?",
                [course_id, user_id]
            );

            if (course.length === 0) {
                return NextResponse.json({ error: "Not your course" });
            }
        }

        // 🧠 If STUDENT → check enrollment
        if (role === "student") {
            const [enroll] = await mysqlPool.promise().query(
                "SELECT * FROM enrollments WHERE course_id = ? AND student_id = ?",
                [course_id, user_id]
            );

            if (enroll.length === 0) {
                return NextResponse.json({ error: "Not enrolled" });
            }
        }

        // ✅ If passed → return lectures
        const [rows] = await mysqlPool
            .promise()
            .query("SELECT * FROM lectures WHERE course_id = ?", [course_id]);

        return NextResponse.json(rows);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Server error" });
    }
}

// ADD THIS ↓↓↓
export async function POST(req) {

    try {
        const { title, file_url, course_id } = await req.json();

        console.log("DATA:", title, file_url, course_id); // ADD THIS

        await mysqlPool.promise().query(
            "INSERT INTO lectures (title, file_url, course_id) VALUES (?, ?, ?)",
            [title, file_url, course_id]
        );

        return NextResponse.json({ message: "Lecture saved" });

    } catch (error) {
        console.log("DB ERROR:", error); // ALSO IMPORTANT
        return NextResponse.json({ error: "DB error" });
    }

}
