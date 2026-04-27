import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function POST(req) {
    const { email, password } = await req.json();

    const [rows] = await mysqlPool
        .promise()
        .query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
        return NextResponse.json({ error: "User not found" });
    }

    const user = rows[0];

    if (user.password !== password) {
        return NextResponse.json({ error: "Wrong password" });
    }

    return NextResponse.json({
        message: "Login success",
        id: user.id,
        role: user.role,
    });
}