import { NextResponse } from "next/server";

export async function fetchTmdb(
  path: string,
  params: URLSearchParams = new URLSearchParams()
) {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "TMDB token is missing. Check .env.local" },
      { status: 500 }
    );
  }

  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  params.forEach((value, key) => url.searchParams.set(key, value));

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      next: { revalidate: 300 },
    });
    const data: unknown = await response.json();

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "status_message" in data &&
        typeof data.status_message === "string"
          ? data.status_message
          : "TMDB request failed";

      return NextResponse.json(
        { error: message },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB request failed", error);
    return NextResponse.json(
      { error: "Unable to connect to TMDB" },
      { status: 502 }
    );
  }
}

export function getPageNumber(request: Request) {
  const rawPage = new URL(request.url).searchParams.get("page");
  const page = Number(rawPage ?? "1");

  if (!Number.isInteger(page) || page < 1 || page > 500) {
    return null;
  }

  return page;
}
