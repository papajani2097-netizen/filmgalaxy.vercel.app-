"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type CatalogItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
};

type CatalogResponse = {
  results?: CatalogItem[];
  page?: number;
  total_pages?: number;
  total_results?: number;
  error?: string;
};

type TmdbCatalogProps = {
  endpoint: string;
  mediaType: "movie" | "tv";
  initialQuery?: string;
  initialGenre?: string;
  allowSearch?: boolean;
};

export default function TmdbCatalog({
  endpoint,
  mediaType,
  initialQuery = "",
  initialGenre = "",
  allowSearch = false,
}: TmdbCatalogProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const genre = initialGenre;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page) });

    if (query.trim()) {
      params.set("q", query.trim());
    } else if (genre) {
      params.set("genre", genre);
    }

    async function loadItems() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${endpoint}?${params.toString()}`, {
          signal: controller.signal,
        });
        const data: CatalogResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load titles.");
        }

        setItems(data.results ?? []);
        setTotalPages(Math.min(500, Math.max(1, data.total_pages ?? 1)));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setItems([]);
        setTotalPages(1);
        setError(
          err instanceof Error ? err.message : "Titles could not load."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadItems();
    return () => controller.abort();
  }, [endpoint, genre, page, query, reloadKey]);

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const titleFor = (item: CatalogItem) => item.title || item.name || "Untitled";

  return (
    <section
      id="catalog"
      className="mx-auto max-w-7xl scroll-mt-6 px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
    >
      {allowSearch && (
        <form action="/movies" method="GET" className="mb-7 max-w-xl">
          <label htmlFor="catalog-search" className="sr-only">
            Search movies by title
          </label>
          <div className="flex">
            <input
              id="catalog-search"
              name="q"
              type="search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search movies..."
              className="min-w-0 flex-1 rounded-l-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <button
              type="submit"
              className="rounded-r-xl bg-red-600 px-5 text-sm font-semibold hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Search
            </button>
          </div>
          {genre && <input type="hidden" name="genre" value={genre} />}
        </form>
      )}

      {loading ? (
        <div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          aria-label="Loading titles"
          aria-busy="true"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[2/3] rounded-xl bg-white/10" />
              <div className="mt-3 h-4 rounded bg-white/10" />
              <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-10 text-center text-sm text-amber-300"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-gray-400">
          No titles found. Try a different search.
        </p>
      ) : (
        <>
          <p className="mb-4 text-xs text-gray-500" aria-live="polite">
            Page {page} · {items.length} {mediaType === "movie" ? "movies" : "shows"} shown
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => {
              const title = titleFor(item);
              const date = item.release_date || item.first_air_date;
              const detailUrl =
                mediaType === "movie"
                  ? `/movie/${item.id}`
                  : `https://www.themoviedb.org/${mediaType}/${item.id}`;

              return (
                <article
                  key={item.id}
                  className="group min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#11131b] transition duration-300 hover:-translate-y-1 hover:border-red-500/60 hover:shadow-xl hover:shadow-red-950/20"
                >
                  <Link
                    href={detailUrl}
                    target={mediaType === "movie" ? undefined : "_blank"}
                    rel={mediaType === "movie" ? undefined : "noreferrer"}
                    className="block focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={`${title} poster`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-3 text-center text-xs text-gray-500">
                          No poster available
                        </div>
                      )}
                      <span className="absolute left-2 top-2 rounded-md bg-black/80 px-2 py-1 text-xs font-bold text-amber-300">
                        ★ {Number(item.vote_average || 0).toFixed(1)}
                      </span>
                    </div>
                  </Link>

                  <div className="p-3">
                    <Link
                      href={detailUrl}
                      target={mediaType === "movie" ? undefined : "_blank"}
                      rel={mediaType === "movie" ? undefined : "noreferrer"}
                      className="focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <h2 className="line-clamp-2 text-sm font-bold leading-5 transition group-hover:text-red-400 sm:text-base">
                        {title}
                      </h2>
                    </Link>
                    <p className="mt-2 text-xs text-gray-400">
                      {date?.slice(0, 4) || "Year unknown"}
                    </p>
                    <Link
                      href={detailUrl}
                      target={mediaType === "movie" ? undefined : "_blank"}
                      rel={mediaType === "movie" ? undefined : "noreferrer"}
                      className="mt-3 inline-flex items-center rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-red-200 transition hover:border-red-400 hover:bg-red-500/20"
                    >
                      {mediaType === "movie" ? "Watch legally" : "View details"}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <nav
        className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-6"
        aria-label="Catalog pages"
      >
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          className="rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold transition hover:border-red-500 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>
        <span className="min-w-24 text-center text-sm text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages || loading}
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </nav>
    </section>
  );
}
