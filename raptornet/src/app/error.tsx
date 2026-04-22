"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ reset }: Props) {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#05070b",
        color: "#ededed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 16,
          padding: 24,
          backgroundColor: "rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>Something Went Wrong</h1>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
          The page failed to load properly. Retry now.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 16,
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid rgba(255,90,90,0.45)",
            background: "linear-gradient(130deg,#cc1b1b,#ff2727)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    </main>
  );
}
