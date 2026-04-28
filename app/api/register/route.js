import { NextResponse } from "next/server";//to send responses back to the client
import { mysqlPool } from "@/utils/db";

export async function POST(req) {
    const { name, email, password } = await req.json();//req.json() reads the JSON body sent from the frontend.

    await mysqlPool.promise().query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')",
        [name, email, password]
    );

    return NextResponse.json({ message: "Registered successfully" });
}