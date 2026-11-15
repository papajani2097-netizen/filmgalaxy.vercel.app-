import { fetchTmdb } from "@/lib/tmdb";

export async function GET() {
  return fetchTmdb("genre/movie/list", new URLSearchParams({ language: "en-US" }));
}
