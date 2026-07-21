import { AncestorCard } from "@/components/showcase/ancestor-card";
import { TiltCard } from "@/components/showcase/tilt-card";

// TEMP: preview page for heritage frames. Delete after review.
export default function CardDemoPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        gap: 40,
        gridAutoFlow: "column",
        padding: "40px 24px",
        overflowX: "auto",
        background: "#241f18",
      }}
    >
      <div style={{ width: 360 }} id="card-italian-feminine">
        <TiltCard>
          <AncestorCard
            frameVariant="italian-feminine"
            name="Maria Ricci"
            lifespan="1864–1938"
            portraitSrc="/showcase/synthetic-portrait-period.webp"
            portraitTreatment="period"
            zoom={1.18}
            focalY={28}
          />
        </TiltCard>
      </div>
      <div style={{ width: 360 }} id="card">
        <TiltCard>
          <AncestorCard
            frameVariant="italian"
            name="Giuseppe Ricci"
            lifespan="1861–1934"
            portraitSrc="/showcase/synthetic-portrait-period.webp"
            portraitTreatment="period"
            zoom={1.18}
            focalY={28}
          />
        </TiltCard>
      </div>
      <div style={{ width: 360 }} id="card-england">
        <TiltCard>
          <AncestorCard
            frameVariant="england"
            name="William Ashford"
            lifespan="1854–1928"
            portraitSrc="/showcase/synthetic-portrait-period.webp"
            portraitTreatment="period"
            zoom={1.18}
            focalY={28}
          />
        </TiltCard>
      </div>
      <div style={{ width: 360 }} id="card-germany">
        <TiltCard>
          <AncestorCard
            frameVariant="germany"
            name="Heinrich Vogel"
            lifespan="1849–1922"
            portraitSrc="/showcase/synthetic-portrait-period.webp"
            portraitTreatment="period"
            zoom={1.18}
            focalY={28}
          />
        </TiltCard>
      </div>
    </div>
  );
}
