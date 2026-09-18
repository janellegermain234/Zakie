import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-semibold tracking-tight">
        Profile in, better output out.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">
        This demo generates brand guidelines twice from the same model with the
        same settings: once from a stored, structured business profile, and once
        from a blank prompt. The difference is the whole point.
      </p>
      <Link
        href="/status"
        className="mt-10 inline-flex items-center rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Check connection status
      </Link>
    </div>
  );
}
