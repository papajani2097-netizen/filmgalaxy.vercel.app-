import type { Metadata } from "next";
import { Suspense } from "react";
import TmdbCatalog from "@/components/TmdbCatalog";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse popular movies and search films by title or genre.",
};

type MoviesPageProps = {
  searchParams: Promise<{ q?: string | string[]; genre?: string | string[] }>;
};

export default function MoviesPage({ searchParams }: MoviesPageProps) {
  return (
    <>
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_80%_25%,rgba(185,28,28,0.2),transparent_55%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">
            Find your next favorite
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            Movies
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Browse popular films, search by title, or explore a genre. Ratings
            and listings are powered by TMDB.
          </p>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-gray-400 sm:px-6 lg:px-8" role="status">
            Loading movies...
          </div>
        }
      >
        <MovieResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function MovieResults({ searchParams }: MoviesPageProps) {
  const params = await searchParams;

  return (
    <TmdbCatalog
      key={`${typeof params.q === "string" ? params.q : ""}-${typeof params.genre === "string" ? params.genre : ""}`}
      endpoint="/api/movies"
      mediaType="movie"
      initialQuery={typeof params.q === "string" ? params.q : ""}
      initialGenre={typeof params.genre === "string" ? params.genre : ""}
      allowSearch
    />
  );
}
