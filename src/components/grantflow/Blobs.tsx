const Blobs = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="blob animate-blob-float"
        style={{
          top: "-10%",
          left: "-5%",
          width: "520px",
          height: "520px",
          background: "hsl(var(--brand-pink) / 0.55)",
        }}
      />
      <div
        className="blob animate-blob-float"
        style={{
          top: "10%",
          right: "-10%",
          width: "560px",
          height: "560px",
          background: "hsl(var(--brand-purple) / 0.5)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="blob animate-blob-float"
        style={{
          bottom: "-10%",
          left: "30%",
          width: "480px",
          height: "480px",
          background: "hsl(var(--brand-orange) / 0.45)",
          animationDelay: "-12s",
        }}
      />
      <div
        className="blob animate-blob-float"
        style={{
          bottom: "20%",
          right: "20%",
          width: "380px",
          height: "380px",
          background: "hsl(var(--brand-blue) / 0.35)",
          animationDelay: "-3s",
        }}
      />
    </div>
  );
};

export default Blobs;
