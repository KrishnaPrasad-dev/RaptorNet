"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LoginError({ reset }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#05070b] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-black/35 p-6 text-center">
        <h1 className="text-2xl font-bold">Login Page Error</h1>
        <p className="mt-2 text-sm text-white/70">
          Something interrupted this page. Try again.
        </p>
        <button
          onClick={reset}
          className="mt-5 rounded-xl border border-[#ff5a5a]/45 bg-[linear-gradient(130deg,#cc1b1b,#ff2727)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
