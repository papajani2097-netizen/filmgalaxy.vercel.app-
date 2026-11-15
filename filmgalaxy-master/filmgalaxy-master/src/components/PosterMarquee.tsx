"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
};

type MovieResponse = {
  results?: Movie[];
  error?: string;
};

export default function PosterMarquee() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState("");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosters() {
      try {
        const response = await fetch("/api/trending?page=1", {
          signal: controller.signal,
        });
        const data: MovieResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Trending posters could not load.");
        }

        setMovies((data.results ?? []).filter((movie) => movie.poster_path).slice(0, 12));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Trending posters could not load."
        );
      }
    }

    void loadPosters();
    return () => controller.abort();
  }, []);

  function renderPosters(items: Movie[], duplicate: boolean) {
    return items.map((movie, index) => {
      const title = movie.title || movie.name || "Untitled";
      const date = movie.release_date || movie.first_air_date;
      const href = `/movie/${movie.id}`;

      return (
        <Link
          key={`${duplicate ? "duplicate-" : ""}${movie.id}-${index}`}
          href={href}
          tabIndex={duplicate ? -1 : undefined}
          aria-hidden={duplicate ? true : undefined}
          className="poster-marquee-card group"
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#151923] shadow-lg shadow-black/30">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={duplicate ? "" : `${title} poster`}
              fill
              sizes="112px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-2 pb-2 pt-8">
              <p className="line-clamp-1 text-xs font-bold text-white">{title}</p>
              <p className="mt-0.5 text-[10px] text-gray-300">
                {date?.slice(0, 4) || "Now trending"}
              </p>
            </div>
          </div>
        </Link>
      );
    });
  }

  const reverseMovies = [...movies].reverse();

  return (
    <section
      aria-label="Trending movie posters"
      className="poster-marquee border-b border-white/10 bg-[#0b0e16] py-5 sm:py-6"
      data-paused={paused}
    >
      <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400 sm:text-xs">
            Now orbiting
          </p>
          <h2 className="mt-1 text-sm font-bold text-white sm:text-base">
            Trending movie posters
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-gray-200 transition hover:border-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>

      {error ? (
        <p role="alert" className="mx-auto max-w-7xl px-4 text-sm text-amber-300 sm:px-6 lg:px-8">
          {error}
        </p>
      ) : movies.length === 0 ? (
        <div className="grid grid-cols-3 gap-3 overflow-hidden px-4 sm:grid-cols-6 sm:px-6 lg:px-8" aria-label="Loading posters" aria-busy="true">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-white/10" />
          ))}
        </div>
      ) : (
        <div className="poster-marquee-rows" aria-live="off">
          {[movies, reverseMovies].map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`poster-marquee-viewport ${rowIndex === 1 ? "poster-marquee-viewport-reverse" : ""}`}
            >
              <div className="poster-marquee-track">
                <div className="poster-marquee-group">{renderPosters(row, false)}</div>
                <div className="poster-marquee-group" aria-hidden="true">
                  {renderPosters(row, true)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
