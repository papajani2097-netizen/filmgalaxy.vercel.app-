import { NextResponse } from "next/server";
import { fetchTmdb, getPageNumber } from "@/lib/tmdb";

export async function GET(request: Request) {
  const page = getPageNumber(request);

  if (page === null) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  return fetchTmdb(
    "trending/movie/week",
    new URLSearchParams({ language: "en-US", page: String(page) })
  );
}
