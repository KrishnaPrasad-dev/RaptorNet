"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: Props) {
  return (
    <html lang="en" style={{ backgroundColor: "#05070b", color: "#ededed" }}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#05070b",
          color: "#ededed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 16,
            padding: 24,
            backgroundColor: "rgba(0,0,0,0.35)",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>
            App Runtime Error
          </h1>
          <p style={{ marginTop: 10, opacity: 0.82 }}>
            Something crashed during navigation. Retry the page.
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
      </body>
    </html>
  );
}
