import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET(req) {
    const teacher_id = req.nextUrl.searchParams.get("teacher_id");

    if (!teacher_id) {
        return NextResponse.json({ error: "Unauthorized" });
    }

    const [rows] = await mysqlPool.promise().query(
        "SELECT * FROM courses WHERE teacher_id = ?",
        [teacher_id]
    );

    return NextResponse.json(rows);
}