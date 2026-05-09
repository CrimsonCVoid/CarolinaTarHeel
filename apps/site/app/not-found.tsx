export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center bg-white px-6 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-prose text-base text-slate-600">
          The page you&apos;re looking for has moved or doesn&apos;t exist.
        </p>
        <a href="/" className="mt-6 inline-flex h-11 items-center rounded-2xl bg-brand-600 px-6 text-base font-medium text-white hover:bg-brand-700">
          Go home
        </a>
      </div>
    </main>
  );
}
