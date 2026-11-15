
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import PosterMarquee from "@/components/PosterMarquee";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FilmGalaxy | Discover Movies & TV Shows",
    template: "%s | FilmGalaxy",
  },
  description:
    "Discover popular movies, trending films, TV shows, ratings, trailers and legal streaming options on FilmGalaxy.",
  applicationName: "FilmGalaxy",
  keywords: [
    "movies",
    "films",
    "TV shows",
    "movie reviews",
    "movie discovery",
    "where to watch movies",
  ],
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "Trending", href: "/trending" },
  { label: "TV Shows", href: "/tv-shows" },
  { label: "Genres", href: "/genres" },
  { label: "Where to Watch", href: "/where-to-watch" },
];

const movieMenuLinks = [
  { label: "Browse Movies", href: "/movies" },
  { label: "Trending Movies", href: "/trending" },
  { label: "Browse Genres", href: "/genres" },
];

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#080b12] text-white">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080b12]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="shrink-0 text-xl font-black tracking-tight sm:text-2xl"
              aria-label="FilmGalaxy home"
            >
              <span className="text-white">FILM</span>
              <span className="text-red-500">GALAXY</span>
            </Link>

            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-5 lg:flex"
            >
              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-gray-300 transition hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500">
                  Movies <span aria-hidden="true">⌄</span>
                </summary>
                <div className="absolute left-0 top-full z-50 mt-3 min-w-48 rounded-xl border border-white/10 bg-[#111621] p-2 shadow-2xl">
                  {movieMenuLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 text-sm text-gray-200 transition hover:bg-white/10 hover:text-red-400"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
              {navLinks
                .filter((item) => item.href !== "/movies")
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-gray-300 transition hover:text-red-400"
                  >
                    {item.label}
                  </Link>
                ))}
            </nav>

            <form
              action="/movies"
              method="GET"
              role="search"
              className="hidden min-w-0 max-w-xs flex-1 md:flex lg:max-w-sm"
            >
              <label htmlFor="desktop-search" className="sr-only">
                Search movies and TV shows
              </label>
              <input
                id="desktop-search"
                name="q"
                type="search"
                placeholder="Search movies..."
                className="w-full rounded-l-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-red-500"
              />
              <button
                type="submit"
                className="rounded-r-lg bg-red-600 px-4 text-sm font-semibold transition hover:bg-red-500"
              >
                Search
              </button>
            </form>

            <ThemeToggle />

            <details className="relative lg:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/10">
                <span aria-hidden="true">☰</span>
                <span>Menu</span>
              </summary>

              <div className="absolute right-0 top-12 w-[min(85vw,320px)] rounded-xl border border-white/10 bg-[#111621] p-4 shadow-2xl">
                <form action="/movies" method="GET" role="search" className="mb-4">
                  <label htmlFor="mobile-search" className="sr-only">
                    Search movies and TV shows
                  </label>
                  <div className="flex">
                    <input
                      id="mobile-search"
                      name="q"
                      type="search"
                      placeholder="Search movies..."
                      className="min-w-0 flex-1 rounded-l-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-red-500"
                    />
                    <button
                      type="submit"
                      className="rounded-r-lg bg-red-600 px-3 text-sm font-semibold"
                    >
                      Go
                    </button>
                  </div>
                </form>

                <nav aria-label="Mobile navigation" className="grid gap-1">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-red-400">
                      Movies <span aria-hidden="true">⌄</span>
                    </summary>
                    <div className="grid gap-1 pl-3">
                      {movieMenuLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-red-400"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                  {navLinks
                    .filter((item) => item.href !== "/movies")
                    .map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-lg px-3 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-red-400"
                      >
                        {item.label}
                      </Link>
                    ))}
                </nav>
              </div>
            </details>
          </div>

          <div className="border-t border-white/5 px-4 py-2 md:hidden">
            <p className="mx-auto max-w-7xl text-xs text-gray-400">
              Discover movies, explore ratings and find where to watch.
            </p>
          </div>
        </header>

        <PosterMarquee />

        <main className="w-full flex-1">{children}</main>

        <footer className="mt-12 border-t border-white/10 bg-[#0b0f18]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-2 lg:px-8">
            <div>
              <Link href="/" className="text-xl font-black">
                FILM<span className="text-red-500">GALAXY</span>
              </Link>
              <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
                Explore movies and TV shows, discover ratings, and find
                authorized viewing options. Made for movie fans on every screen.
              </p>
            </div>

            <div className="flex flex-wrap content-start gap-x-5 gap-y-3 text-sm text-gray-400 md:justify-end">
              <Link href="/#about" className="hover:text-white">About</Link>
              <a
                href="https://www.youtube.com/channel/UCyLlp8KPKMkIgVsw5-YHGmw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                YouTube
              </a>
              {navLinks.slice(1).map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-gray-500">
            © 2026 FilmGalaxy. All rights reserved.
            Movie data and images may be provided by TMDB.
          </div>
        </footer>
      </body>
    </html>
  );
}
