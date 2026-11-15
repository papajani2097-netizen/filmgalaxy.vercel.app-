import type { Metadata } from "next";
import TmdbCatalog from "@/components/TmdbCatalog";

export const metadata: Metadata = {
  title: "TV Shows",
  description: "Browse popular TV series and discover your next show.",
};

export default function TvShowsPage() {
  return (
    <>
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_80%_25%,rgba(185,28,28,0.2),transparent_55%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">
            Your next series starts here
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            TV Shows
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Explore popular series, browse ratings, and find a show to enjoy.
          </p>
        </div>
      </section>
      <TmdbCatalog endpoint="/api/tv-shows" mediaType="tv" />
    </>
  );
}
