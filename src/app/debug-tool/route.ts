import { NextResponse } from "next/server";
import { executeTool } from "@/lib/ai/registry";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const result = await executeTool("search_listings", '{"location":"Makati"}');
  return NextResponse.json(result);
}