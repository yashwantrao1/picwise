export function BrandMark({ size }: { size: number }) {
  const dot = Math.max(2, Math.round(size * 0.12));
  const ring = Math.max(8, Math.round(size * 0.28));
  const stroke = Math.max(2, Math.round(size * 0.055));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2F4BFF",
        borderRadius: Math.round(size * 0.22),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: Math.round(size * 0.06) }}>
        <div style={{ display: "flex", flexDirection: "column", gap: Math.max(1, Math.round(size * 0.025)) }}>
          <div style={{ width: dot, height: dot, borderRadius: 2, background: "#F5F7FF" }} />
          <div style={{ width: dot, height: dot, borderRadius: 2, background: "#F5F7FF" }} />
          <div style={{ width: dot, height: dot, borderRadius: 2, background: "#F5F7FF" }} />
        </div>
        <div
          style={{
            width: ring,
            height: ring,
            borderRadius: 999,
            border: `${stroke}px solid #3DE0B0`,
          }}
        />
      </div>
    </div>
  );
}
