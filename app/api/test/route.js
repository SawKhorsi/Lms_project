import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET() {
    const [rows] = await mysqlPool.promise().query("SELECT 1");
    return NextResponse.json({ message: "DB Connected", rows });
}