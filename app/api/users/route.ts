import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return new NextResponse("ok", { status: 200 });
}
