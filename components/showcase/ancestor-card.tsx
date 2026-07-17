import { Lock } from "lucide-react";
import Image from "next/image";

/**
 * Window/plaque geometry measured once per frame asset. All values are
 * percentages of the card box, so cards scale freely.
 * - ornate: public/showcase/ancestor-card-frame.png (662x896) — period-era vessel
 * - plain:  public/showcase/ancestor-card-frame-plain.png (663x924) — modern-era mat
 */
const FRAMES = {
  ornate: {
    src: "/showcase/ancestor-card-frame.png",
    aspect: "662 / 896",
    window: { left: 18.0, top: 11.3, width: 64.2, height: 65.3, archRadiusY: 36 },
    plaque: { left: 27.5, top: 79.2, width: 45.0, height: 11.0 },
  },
  plain: {
    src: "/showcase/ancestor-card-frame-plain.png",
    aspect: "663 / 924",
    window: { left: 18.1, top: 11.3, width: 62.1, height: 65.8, archRadiusY: 31 },
    plaque: { left: 26.4, top: 80.8, width: 46.8, height: 10.5 },
  },
} as const;

export type AncestorCardFrameVariant = keyof typeof FRAMES;

const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")";

export type AncestorCardProps = {
  name: string;
  /** e.g. "1792–1867" */
  lifespan?: string;
  /** e.g. "Farmer & Community Leader · New York" */
  descriptor?: string;
  portraitSrc?: string;
  portraitAlt?: string;
  /**
   * Era policy: "period" portraits (pre-modern photographs/paintings) seat with
   * only a vignette; "modern" photos receive a monochrome archival grade so they
   * stop fighting the antique vessel.
   */
  portraitTreatment?: "period" | "modern";
  /**
   * Vessel-per-era: "ornate" is the antique card for period-era people;
   * "plain" is the quiet museum mat for modern-era people.
   */
  frameVariant?: AncestorCardFrameVariant;
  /** Living-person privacy: the window shows a veil instead of the portrait. */
  masked?: boolean;
  /** Portrait focal point, percent. Defaults frame a typical bust shot. */
  focalX?: number;
  focalY?: number;
  /** Optional crop-in on the portrait (1 = no zoom). Applied around the focal point. */
  zoom?: number;
  className?: string;
};

export function AncestorCard({
  name,
  lifespan,
  descriptor,
  portraitSrc,
  portraitAlt,
  portraitTreatment = "period",
  frameVariant = "ornate",
  masked = false,
  focalX = 50,
  focalY = 18,
  zoom = 1,
  className,
}: AncestorCardProps) {
  const frame = FRAMES[frameVariant];
  const { window: win, plaque } = frame;
  const archRadius = `50% 50% 0 0 / ${win.archRadiusY}% ${win.archRadiusY}% 0 0`;

  return (
    <figure
      className={`relative ${className ?? ""}`}
      style={{
        aspectRatio: frame.aspect,
        containerType: "inline-size",
        borderRadius: "3.5% / 2.6%",
        overflow: "hidden",
        boxShadow: "0 18px 40px -18px rgba(38,28,14,0.55)",
      }}
    >
      <Image
        src={frame.src}
        alt=""
        fill
        sizes="(max-width: 640px) 90vw, 460px"
        className="object-cover"
      />

      <div
        className="absolute overflow-hidden bg-[#efe7d6]"
        style={{
          left: `${win.left}%`,
          top: `${win.top}%`,
          width: `${win.width}%`,
          height: `${win.height}%`,
          borderRadius: archRadius,
        }}
      >
        {masked ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-[2cqw] bg-[radial-gradient(ellipse_at_50%_35%,#f3ecdc,#ddd0b6_75%)] text-[#7a6947]">
            <Lock aria-hidden className="h-[7cqw] w-[7cqw]" />
            <p className="max-w-[80%] text-center font-serif text-[3cqw] leading-snug">
              Shared with family only
            </p>
          </div>
        ) : portraitSrc ? (
          <>
            <Image
              src={portraitSrc}
              alt={portraitAlt ?? `Portrait of ${name}`}
              fill
              sizes="(max-width: 640px) 60vw, 300px"
              className="object-cover"
              style={{
                objectPosition: `${focalX}% ${focalY}%`,
                ...(portraitTreatment === "modern"
                  ? {
                      transform: `scale(${Math.max(zoom, 1.32)})`,
                      transformOrigin: `${focalX}% ${focalY + 10}%`,
                      filter: "grayscale(1) sepia(0.1) contrast(1.14) brightness(0.97)",
                    }
                  : {
                      ...(zoom !== 1
                        ? { transform: `scale(${zoom})`, transformOrigin: `${focalX}% ${focalY}%` }
                        : {}),
                      filter: "contrast(0.97) brightness(1.01)",
                    }),
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={
                portraitTreatment === "modern"
                  ? {
                      background:
                        "radial-gradient(ellipse 82% 72% at 50% 34%, transparent 40%, rgba(28,22,12,0.62) 100%)",
                      boxShadow:
                        "inset 0 0 7cqw rgba(28,22,12,0.55), inset 0 1cqw 2.5cqw rgba(28,22,12,0.4)",
                    }
                  : {
                      background:
                        "radial-gradient(ellipse 92% 82% at 50% 40%, transparent 55%, rgba(43,32,18,0.34) 100%)",
                      boxShadow:
                        "inset 0 0 5cqw rgba(43,32,18,0.42), inset 0 0.8cqw 2cqw rgba(43,32,18,0.3)",
                    }
              }
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
              style={{ backgroundImage: GRAIN_URL, backgroundSize: "160px 160px" }}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#f3ecdc,#ddd0b6_75%)]">
            <span aria-hidden className="font-serif text-[16cqw] text-[#b9a67f]">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <figcaption
        className="absolute flex flex-col items-center justify-center text-center text-[#4a3820]"
        style={{
          left: `${plaque.left}%`,
          top: `${plaque.top}%`,
          width: `${plaque.width}%`,
          height: `${plaque.height}%`,
          textShadow: "0 1px 0 rgba(255,244,214,0.4)",
        }}
      >
        <span className="font-serif text-[2.8cqw] font-semibold uppercase tracking-[0.1em] leading-[1.15]">
          {name}
        </span>
        {lifespan ? (
          <span className="font-serif text-[2.2cqw] tracking-[0.08em]">{lifespan}</span>
        ) : null}
        {descriptor ? (
          <span className="truncate px-[2%] text-[1.8cqw] uppercase tracking-[0.14em] opacity-80">
            {descriptor}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
