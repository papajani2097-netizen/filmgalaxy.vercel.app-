
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
};

type MovieResponse = {
  results?: Movie[];
  page?: number;
  total_pages?: number;
  total_results?: number;
  error?: string;
};

const categories = [
  { name: "All Movies", id: 0 },
  { name: "Action", id: 28 },
  { name: "Adventure", id: 12 },
  { name: "Comedy", id: 35 },
  { name: "Drama", id: 18 },
  { name: "Horror", id: 27 },
  { name: "Science Fiction", id: 878 },
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Movies");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("page", String(page));

        const query = search.trim();

        if (query) {
          params.set("q", query);
        } else {
          const selectedCategory = categories.find(
            (category) => category.name === activeCategory
          );

          if (selectedCategory && selectedCategory.id !== 0) {
            params.set("genre", String(selectedCategory.id));
          }
        }

        const response = await fetch(`/api/movies?${params.toString()}`, {
          signal: controller.signal,
        });

        const data: MovieResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load movies.");
        }

        setMovies(data.results ?? []);
        setTotalPages(Math.max(1, data.total_pages ?? 1));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setMovies([]);
        setTotalPages(1);
        setError(
          err instanceof Error
            ? err.message
            : "Movies could not load. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => controller.abort();
  }, [page, search, activeCategory]);

  function changePage(nextPage: number) {
    const safePage = Math.min(
      Math.max(nextPage, 1),
      totalPages
    );

    setPage(safePage);

    document.getElementById("movies")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function selectCategory(categoryName: string) {
    setActiveCategory(categoryName);
    setPage(1);
  }

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080a10] text-white">
      {/* Hero section */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_25%,rgba(185,28,28,0.24),transparent_50%),radial-gradient(ellipse_at_15%_80%,rgba(67,56,202,0.16),transparent_50%)]"
        />

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-red-400 sm:text-sm sm:tracking-[0.3em]">
            Your Universe of Movies
          </p>

          <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Discover Your Next
            <span className="block text-red-500">
              Favorite Movie.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
            Explore popular films, discover hidden gems, check ratings,
            and find authorized ways to watch your favorites.
          </p>

          <Link
            href="#movies"
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-sm font-bold transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 sm:text-base"
          >
            Explore Movies <span className="ml-2">→</span>
          </Link>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-12 sm:gap-5">
            <div>
              <p className="text-base font-bold sm:text-xl">Discover</p>
              <p className="mt-1 text-xs text-gray-500">Popular films</p>
            </div>
            <div>
              <p className="text-base font-bold sm:text-xl">Explore</p>
              <p className="mt-1 text-xs text-gray-500">Movie genres</p>
            </div>
            <div>
              <p className="text-base font-bold sm:text-xl">Find</p>
              <p className="mt-1 text-xs text-gray-500">Legal viewing options</p>
            </div>
          </div>
        </div>
      </section>

      {/* Movies section */}
      <section
        id="movies"
        className="mx-auto max-w-7xl scroll-mt-6 px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400 sm:text-sm">
              Handpicked for you
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl lg:text-4xl">
              {search.trim()
                ? "Search Results"
                : activeCategory === "All Movies"
                  ? "Popular Movies"
                  : `${activeCategory} Movies`}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Discover movies, browse genres, and explore more pages.
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <label htmlFor="movie-search" className="sr-only">
              Search movies by title
            </label>

            <input
              id="movie-search"
              type="search"
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search movies..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Genre filters */}
        <div
          className="my-6 flex gap-2 overflow-x-auto pb-3 sm:my-7 sm:flex-wrap sm:overflow-visible"
          aria-label="Filter movies by genre"
        >
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              aria-pressed={activeCategory === category.name}
              onClick={() => selectCategory(category.name)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${
                activeCategory === category.name
                  ? "bg-red-600 text-white"
                  : "border border-white/10 bg-white/5 text-gray-400 hover:border-white/25 hover:text-white"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            aria-label="Loading movies"
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[2/3] rounded-xl bg-white/10" />
                <div className="mt-3 h-4 rounded bg-white/10" />
                <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-10 text-center text-sm text-amber-300">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setPage((current) => current)}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-bold">No movies found</p>
            <p className="mt-2 text-sm text-gray-400">
              Try another title or select a different genre.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All Movies");
                setPage(1);
              }}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs text-gray-500">
              Page {page} · {movies.length} movies shown
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie) => (
                <article
                  key={movie.id}
                  className="group min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#11131b] transition duration-300 hover:-translate-y-1 hover:border-red-500/60 hover:shadow-xl hover:shadow-red-950/20"
                >
                  <Link
                    href={`/movie/${movie.id}`}
                    className="block focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={`${movie.title} poster`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-3 text-center text-xs text-gray-500">
                          No poster available
                        </div>
                      )}

                      <div className="absolute left-2 top-2 rounded-md bg-black/80 px-2 py-1 text-xs font-bold text-amber-300">
                        ★ {Number(movie.vote_average || 0).toFixed(1)}
                      </div>
                    </div>
                  </Link>

                  <div className="p-3">
                    <Link href={`/movie/${movie.id}`} className="focus:outline-none focus:ring-2 focus:ring-red-500">
                      <h3 className="line-clamp-2 text-sm font-bold leading-5 transition group-hover:text-red-400 sm:text-base">
                        {movie.title}
                      </h3>
                    </Link>

                    <p className="mt-2 text-xs text-gray-400">
                      {movie.release_date?.slice(0, 4) || "Year unknown"}
                    </p>

                    <Link
                      href={`/movie/${movie.id}`}
                      className="mt-3 inline-flex items-center rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-red-200 transition hover:border-red-400 hover:bg-red-500/20"
                    >
                      Watch legally
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Pagination: always displayed below the movie grid */}
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-6"
          aria-label="Movie pages"
        >
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => changePage(page - 1)}
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
            onClick={() => changePage(page + 1)}
            className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </nav>
      </section>

      {/* About section */}
      <section
        id="about"
        className="border-t border-white/10 bg-white/[0.02] px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold sm:text-2xl">
            Welcome to FilmGalaxy
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400">
            Discover popular movies, explore genres, check ratings, and find
            authorized viewing options. FilmGalaxy is an independent movie
            discovery website.
          </p>

          <p className="mt-3 text-xs leading-6 text-gray-500">
            Movie data and images may be provided by TMDB. FilmGalaxy is not
            endorsed or certified by TMDB.
          </p>

          <p className="mt-4 text-xs text-gray-600">
            © 2026 FilmGalaxy
          </p>
        </div>
      </section>
    </main>
  );
}