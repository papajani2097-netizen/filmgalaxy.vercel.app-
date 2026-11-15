"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Genre = {
  id: number;
  name: string;
};

export default function GenreBrowser() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGenres() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/genres", {
          signal: controller.signal,
        });
        const data: { genres?: Genre[]; error?: string } = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load genres.");
        }

        setGenres(data.genres ?? []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error ? err.message : "Genres could not load."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadGenres();
    return () => controller.abort();
  }, [reloadKey]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Loading genres" aria-busy="true">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-xl bg-white/10" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-amber-300">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <nav aria-label="Movie genres" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {genres.map((genre) => (
        <Link
          key={genre.id}
          href={`/movies?genre=${genre.id}`}
          className="group flex min-h-16 items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 font-semibold transition hover:border-red-500/60 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <span>{genre.name}</span>
          <span aria-hidden="true" className="text-red-400 transition group-hover:translate-x-1">
            →
          </span>
        </Link>
      ))}
    </nav>
  );
}
