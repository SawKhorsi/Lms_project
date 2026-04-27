import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET(req) {
  const student_id = req.nextUrl.searchParams.get("student_id");

  const [rows] = await mysqlPool.promise().query(`
    SELECT courses.*
    FROM enrollments
    JOIN courses ON enrollments.course_id = courses.id
    WHERE enrollments.student_id = ?
  `, [student_id]);

  return NextResponse.json(rows);
}