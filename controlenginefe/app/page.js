// /app/page.js
export default function HomePage() {
  return (
    <div
      style={{
        backgroundImage: "url('/Background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        color: "#fff", // Ensures text is visible
        textAlign: "center",
      }}
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay
          zIndex: 1,
        }}
      ></div>

      {/* Text content */}
      <div style={{ zIndex: 2 }}>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            marginBottom: "1rem",
          }}
        >
          Welcome to the SBD AI Engine
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "300",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
          }}
        >
          Select a tool from the navbar to begin!
        </p>
      </div>
    </div>
  );
}
