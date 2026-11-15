import Link from "next/link";

export default function MovieNotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-400">
        404
      </p>
      <h1 className="mt-3 text-3xl font-black">Movie not found</h1>
      <p className="mt-3 text-sm leading-6 text-gray-400">
        This movie ID is invalid or the movie is no longer available from TMDB.
      </p>
      <Link
        href="/movies"
        className="mt-6 inline-flex rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500"
      >
        Browse movies
      </Link>
    </section>
  );
}
