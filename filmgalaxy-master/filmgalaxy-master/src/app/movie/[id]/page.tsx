import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchTmdb } from "@/lib/tmdb";
import AdSensePlacement from "@/components/AdSensePlacement";

type MovieCastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

type WatchProvider = {
  provider_id: number;
  provider_name: string;
};

type ProviderListing = {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
};

type MovieDetails = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  credits?: {
    cast?: MovieCastMember[];
  };
  "watch/providers"?: {
    results?: Record<string, ProviderListing>;
  };
};

const WATCH_REGION = "PK";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMovieCastMember(value: unknown): value is MovieCastMember {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.character === "string" &&
    (typeof value.profile_path === "string" || value.profile_path === null)
  );
}

function hasValidCredits(value: unknown): boolean {
  if (value === undefined) return true;
  if (!isRecord(value)) return false;
  if (value.cast === undefined) return true;
  return Array.isArray(value.cast) && value.cast.every(isMovieCastMember);
}

function isWatchProvider(value: unknown): value is WatchProvider {
  return (
    isRecord(value) &&
    typeof value.provider_id === "number" &&
    typeof value.provider_name === "string"
  );
}

function isProviderListing(value: unknown): value is ProviderListing {
  if (!isRecord(value) || typeof value.link !== "string") return false;

  return ["flatrate", "rent", "buy", "free", "ads"].every((category) => {
    const providers = value[category];
    return (
      providers === undefined ||
      (Array.isArray(providers) && providers.every(isWatchProvider))
    );
  });
}

function hasValidWatchProviders(value: unknown): boolean {
  if (value === undefined) return true;
  if (!isRecord(value)) return false;
  if (value.results === undefined) return true;
  if (!isRecord(value.results)) return false;

  const regionListing = value.results[WATCH_REGION];
  return regionListing === undefined || isProviderListing(regionListing);
}

function isValidMovieId(id: string): boolean {
  const numericId = Number(id);
  return /^\d+$/.test(id) && Number.isSafeInteger(numericId) && numericId > 0;
}

function isMovieDetails(value: unknown): value is MovieDetails {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    (typeof value.poster_path === "string" || value.poster_path === null) &&
    typeof value.overview === "string" &&
    typeof value.release_date === "string" &&
    typeof value.vote_average === "number" &&
    Array.isArray(value.genres) &&
    value.genres.every(
      (genre) =>
        isRecord(genre) &&
        typeof genre.id === "number" &&
        typeof genre.name === "string"
    ) &&
    hasValidCredits(value.credits) &&
    hasValidWatchProviders(value["watch/providers"])
  );
}

function MovieLoading() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-20 text-sm text-gray-400 sm:px-6 lg:px-8"
      role="status"
    >
      Loading movie details...
    </div>
  );
}

export default function MovieDetailPage({ params }: MoviePageProps) {
  return (
    <Suspense fallback={<MovieLoading />}>
      {params.then(({ id }) => (
        <MovieDetailContent id={id} />
      ))}
    </Suspense>
  );
}

async function MovieDetailContent({ id }: { id: string }) {
  if (!isValidMovieId(id)) {
    notFound();
  }

  const response = await fetchTmdb(
    `movie/${id}`,
    new URLSearchParams({
      language: "en-US",
      append_to_response: "credits,watch/providers",
    })
  );

  if (response.status === 404) {
    notFound();
  }

  const data: unknown = await response.json();

  if (!response.ok) {
    const errorMessage = isRecord(data)
      ? data.error ?? data.status_message
      : undefined;
    const message =
      typeof errorMessage === "string"
        ? errorMessage
        : "Movie details could not be loaded. Please try again later.";

    return <MovieError message={message} />;
  }

  if (!isMovieDetails(data)) {
    return (
      <MovieError message="TMDB returned incomplete movie details. Please try again later." />
    );
  }

  const movie = data;
  const releaseDate = movie.release_date || "Release date unknown";
  const cast = (movie.credits?.cast ?? [])
    .filter(isMovieCastMember)
    .slice(0, 12);
  const watchListing = movie["watch/providers"]?.results?.[WATCH_REGION];
  const providerCategories = [
    { label: "Stream", providers: watchListing?.flatrate },
    { label: "Rent", providers: watchListing?.rent },
    { label: "Buy", providers: watchListing?.buy },
    { label: "Free", providers: watchListing?.free },
    { label: "With ads", providers: watchListing?.ads },
  ].filter(
    (category): category is { label: string; providers: WatchProvider[] } =>
      Boolean(category.providers?.length)
  );
  const availabilityUrl = getTmdbAvailabilityUrl(watchListing?.link);

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/movies"
        className="text-sm font-semibold text-red-400 transition hover:text-red-300"
      >
        ← Back to movies
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(220px,320px)_1fr] md:gap-12">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:mx-0">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
              fill
              sizes="(max-width: 768px) 80vw, 320px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-400">
              Poster unavailable
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">
            Movie details
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            {movie.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300">
            <span>{releaseDate}</span>
            <span aria-label={`TMDB rating ${movie.vote_average.toFixed(1)} out of 10`}>
              ★ {movie.vote_average.toFixed(1)} / 10
            </span>
          </div>

          {movie.genres.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Genres">
              {movie.genres.map((genre) => (
                <li
                  key={genre.id}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-gray-300"
                >
                  {genre.name}
                </li>
              ))}
            </ul>
          )}

          <section className="mt-8">
            <h2 className="text-lg font-bold">Overview</h2>
            <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-gray-300">
              {movie.overview || "No overview is available for this movie yet."}
            </p>
          </section>

          <section className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold">Where to Watch</h2>
            <p className="mt-1 text-xs text-gray-400">
              Availability in Pakistan. Provider listings are supplied by TMDB
              and may change by region or over time. Follow the TMDB-provided
              availability link to visit the listed services.
            </p>
            {providerCategories.length > 0 ? (
              <>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {providerCategories.map((category) => (
                    <li key={category.label}>
                      <h3 className="text-sm font-semibold text-gray-300">
                        {category.label}
                      </h3>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {category.providers.map((provider) => (
                          <li
                            key={`${category.label}-${provider.provider_id}`}
                            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                          >
                            {provider.provider_name}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                {availabilityUrl ? (
                  <a
                    href={availabilityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    View provider availability
                    <span className="ml-2" aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-gray-300">
                    Official link currently unavailable.
                  </p>
                )}
              </>
            ) : (
              <p className="mt-4 text-sm text-gray-300">
                Official link currently unavailable.
              </p>
            )}
            <p className="mt-4 text-xs text-gray-500">
              Provider names and availability are provided by TMDB. FilmGalaxy
              does not host movies or invent provider URLs.
            </p>
          </section>

          <AdSensePlacement />

          <section className="mt-9">
            <h2 className="text-lg font-bold">Cast</h2>
            {cast.length > 0 ? (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {cast.map((member) => (
                  <li
                    key={member.id}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {member.character || "Cast"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-400">
                Cast information is not available.
              </p>
            )}
          </section>
        </div>
      </div>
    </article>
  );
}

function getTmdbAvailabilityUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      (url.hostname === "www.themoviedb.org" ||
        url.hostname === "themoviedb.org")
    ) {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

function MovieError({ message }: { message: string }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-2xl font-bold">Movie details unavailable</h1>
      <p role="alert" className="mt-3 text-sm leading-6 text-amber-200">
        {message}
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
