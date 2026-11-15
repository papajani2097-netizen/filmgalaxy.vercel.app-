import type { Metadata } from "next";
import GenreBrowser from "./GenreBrowser";

export const metadata: Metadata = {
  title: "Movie Genres",
  description: "Explore movie genres and browse popular films by category.",
};

export default function GenresPage() {
  return (
    <>
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_80%_25%,rgba(185,28,28,0.2),transparent_55%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">
            Pick a mood
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            Browse Genres
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Choose a category to see popular movies that match.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <GenreBrowser />
      </section>
    </>
  );
}
