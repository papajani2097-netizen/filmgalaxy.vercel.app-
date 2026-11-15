import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Where to Watch",
  description:
    "Find official streaming services and learn how to check movie availability in your region.",
};

const services = [
  { name: "Netflix", url: "https://www.netflix.com/" },
  { name: "Prime Video", url: "https://www.primevideo.com/" },
  { name: "Disney+", url: "https://www.disneyplus.com/" },
  { name: "Apple TV", url: "https://tv.apple.com/" },
  { name: "Hulu", url: "https://www.hulu.com/" },
  { name: "Max", url: "https://www.max.com/" },
];

export default function WhereToWatchPage() {
  return (
    <>
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_80%_25%,rgba(185,28,28,0.2),transparent_55%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-400">
            Watch through official services
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            Where to Watch
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Visit a streaming provider directly to search its current catalog
            and choose an authorized way to watch.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <aside className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm leading-7 text-amber-100">
          Streaming catalogs, rental options, and subscription requirements
          vary by country and can change over time. Check the provider for your
          region to confirm current availability. FilmGalaxy does not host or
          distribute movies.
        </aside>

        <h2 className="mb-5 text-2xl font-bold">Official streaming services</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.name}>
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-20 items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 font-semibold transition hover:border-red-500/60 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <span>{service.name}</span>
                <span className="text-sm text-red-400">
                  Visit official site <span aria-hidden="true">↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-6 text-gray-500">
          External services are operated by their respective providers.
          FilmGalaxy is not affiliated with or endorsed by them.
        </p>
      </section>
    </>
  );
}
