export default function AuthBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundColor: "#05070b",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.7,
          backgroundImage:
            "linear-gradient(rgba(255,39,39,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,39,39,0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage:
            "radial-gradient(circle at 50% 45%, black 34%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 45%, black 34%, transparent 82%)",
        }}
      />
    </div>
  );
}
