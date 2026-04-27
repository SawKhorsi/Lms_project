import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function POST(req) {
    const { name, email, password } = await req.json();

    await mysqlPool.promise().query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')",
        [name, email, password]
    );

    return NextResponse.json({ message: "Registered successfully" });
}