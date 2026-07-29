import { AncestorCard } from "@/components/showcase/ancestor-card";
import { TiltCard } from "@/components/showcase/tilt-card";

// TEMP: preview page for heritage frames. Delete after review.
const SECTIONS = [
  {
    title: "Masculine (locked)",
    cards: [
      { id: "italian-masculine", frameVariant: "italian-masculine" as const, name: "Giuseppe Ricci", lifespan: "1861–1934" },
      { id: "england-masculine", frameVariant: "england-masculine" as const, name: "William Ashford", lifespan: "1854–1928" },
      { id: "germany-masculine", frameVariant: "germany-masculine" as const, name: "Heinrich Vogel", lifespan: "1849–1922" },
      { id: "france-masculine", frameVariant: "france-masculine" as const, name: "Jean-Luc Moreau", lifespan: "1858–1931" },
      { id: "ireland-masculine", frameVariant: "ireland-masculine" as const, name: "Patrick O'Connell", lifespan: "1860–1935" },
      { id: "mexico-masculine", frameVariant: "mexico-masculine" as const, name: "Diego Hernández", lifespan: "1866–1940" },
      { id: "african-american-masculine", frameVariant: "african-american-masculine" as const, name: "Samuel Washington", lifespan: "1852–1926" },
    ],
  },
  {
    title: "Feminine (Italy · England B · Germany D)",
    cards: [
      { id: "italian-feminine", frameVariant: "italian-feminine" as const, name: "Maria Ricci", lifespan: "1864–1938" },
      { id: "england-feminine", frameVariant: "england-feminine" as const, name: "Elizabeth Ashford", lifespan: "1857–1930" },
      { id: "germany-feminine", frameVariant: "germany-feminine" as const, name: "Anna Vogel", lifespan: "1852–1926" },
    ],
  },
];

export default function CardDemoPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 48,
        padding: "48px 24px 64px",
        background: "#241f18",
      }}
    >
      {SECTIONS.map((section) => (
        <section key={section.title}>
          <h1
            style={{
              margin: "0 0 24px",
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(244, 235, 221, 0.45)",
              textAlign: "center",
            }}
          >
            {section.title}
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 40,
            }}
          >
            {section.cards.map((card) => (
              <div key={card.id} style={{ width: 360 }} id={`card-${card.id}`}>
                <TiltCard>
                  <AncestorCard
                    frameVariant={card.frameVariant}
                    name={card.name}
                    lifespan={card.lifespan}
                    portraitSrc="/showcase/synthetic-portrait-period.webp"
                    portraitTreatment="period"
                    zoom={1.18}
                    focalY={28}
                  />
                </TiltCard>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
