
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "TMDB token is missing. Check .env.local" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const rawGenre = searchParams.get("genre") ?? "";
  const requestedPage = Number(searchParams.get("page") ?? "1");

  const page =
    Number.isInteger(requestedPage) && requestedPage >= 1
      ? Math.min(requestedPage, 500)
      : 1;

  let endpoint: string;
  const params = new URLSearchParams({
    language: "en-US",
    page: String(page),
    include_adult: "false",
  });

  if (query) {
    endpoint = "https://api.themoviedb.org/3/search/movie";
    params.set("query", query);
  } else if (rawGenre) {
    const genre = Number(rawGenre);

    if (!Number.isInteger(genre) || genre < 1) {
      return NextResponse.json(
        { error: "Invalid genre ID" },
        { status: 400 }
      );
    }

    endpoint = "https://api.themoviedb.org/3/discover/movie";
    params.set("with_genres", String(genre));
    params.set("sort_by", "popularity.desc");
  } else {
    endpoint = "https://api.themoviedb.org/3/movie/popular";
  }

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.status_message || "TMDB request failed",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to connect to TMDB" },
      { status: 502 }
    );
  }
}
