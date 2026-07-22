export function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          width: 4,
          height: 20,
          borderRadius: 99,
          background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
          boxShadow: "0 0 12px rgba(99,102,241,0.35)",
        }}
      />

      <h2
        style={{
          margin: 0,
          fontFamily: "Outfit, sans-serif",
          fontSize: 17,
          fontWeight: 600,
          color: "#e8edf5",
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </h2>
    </div>
  );
}
