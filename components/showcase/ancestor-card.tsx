import { Lock } from "lucide-react";
import Image from "next/image";

import { LitCardSurface } from "./lit-card-surface";

/**
 * Window/plaque geometry measured once per frame asset. All values are
 * percentages of the card box, so cards scale freely.
 * - ornate: public/card-kits/ancestor-card (1002x1359) — period-era vessel,
 *   embossed topographic relief with normal/height/specular maps for the
 *   cursor-tracked lighting in TiltCard. Geometry is measured by
 *   scripts/build-card-kit.js and mirrored in that kit's kit.json.
 * - plain:  public/showcase/ancestor-card-frame-plain.png (663x924) — modern-era mat
 */
const FRAMES = {
  ornate: {
    src: "/card-kits/ancestor-card/cards/ancestor-frame.png",
    aspect: "1002 / 1359",
    window: { left: 25.0, top: 16.9, width: 52.0, height: 53.9, archRadiusY: 25 },
    plaque: { left: 28.8, top: 77.7, width: 44.1, height: 9.6 },
    maps: {
      normal: "/card-kits/ancestor-card/maps/ancestor-frame-normal.png",
      roughness: "/card-kits/ancestor-card/maps/ancestor-frame-roughness.png",
      height: "/card-kits/ancestor-card/maps/ancestor-frame-height.png",
    },
  },
  plain: {
    src: "/showcase/ancestor-card-frame-plain.png",
    aspect: "663 / 924",
    window: { left: 18.1, top: 11.3, width: 62.1, height: 65.8, archRadiusY: 31 },
    plaque: { left: 26.4, top: 80.8, width: 46.8, height: 10.5 },
    /** The modern mat is deliberately flat — no relief to light. */
    maps: null,
  },
  /**
   * Heritage theme (first of a set). Built from public/card-kits/italian-heritage
   * by scripts/build-theme-frame.js; slots and maps mirror that kit's kit.json.
   */
  italian: {
    src: "/card-kits/italian-heritage/cards/italian-heritage-frame.png",
    aspect: "900 / 1500",
    window: { left: 30.5, top: 22.6, width: 37.5, height: 38.1, archRadiusY: 26 },
    plaque: { left: 28.0, top: 65.8, width: 42.1, height: 7.4 },
    maps: {
      normal: "/card-kits/italian-heritage/maps/italian-heritage-normal.png",
      roughness: "/card-kits/italian-heritage/maps/italian-heritage-roughness.png",
      height: "/card-kits/italian-heritage/maps/italian-heritage-height.png",
    },
  },
  england: {
    src: "/card-kits/england-heritage/cards/england-heritage-frame.png",
    aspect: "900 / 1500",
    window: { left: 31.0, top: 30.3, width: 41.4, height: 36.4, archRadiusY: 26 },
    plaque: { left: 30.9, top: 69.1, width: 40.5, height: 3.5 },
    maps: {
      normal: "/card-kits/england-heritage/maps/england-heritage-normal.png",
      roughness: "/card-kits/england-heritage/maps/england-heritage-roughness.png",
      height: "/card-kits/england-heritage/maps/england-heritage-height.png",
    },
  },
  germany: {
    src: "/card-kits/germany-heritage/cards/germany-heritage-frame.png",
    aspect: "900 / 1500",
    window: { left: 34.1, top: 24.7, width: 32.3, height: 38.8, archRadiusY: 26 },
    plaque: { left: 34.3, top: 67.8, width: 30.9, height: 4.5 },
    maps: {
      normal: "/card-kits/germany-heritage/maps/germany-heritage-normal.png",
      roughness: "/card-kits/germany-heritage/maps/germany-heritage-roughness.png",
      height: "/card-kits/germany-heritage/maps/germany-heritage-height.png",
    },
  },
  /**
   * Feminine Italian heritage (Phase 0c sibling). Soft oval cameo + scroll plaque;
   * slots from public/card-kits/italian-heritage-feminine/kit.json.
   */
  "italian-feminine": {
    src: "/card-kits/italian-heritage-feminine/cards/italian-heritage-feminine-frame.png",
    aspect: "900 / 1500",
    window: { left: 30.8, top: 29.3, width: 38.0, height: 37.1, shape: "oval" },
    plaque: { left: 34.4, top: 73.3, width: 31.4, height: 5.8 },
    maps: {
      normal: "/card-kits/italian-heritage-feminine/maps/italian-heritage-feminine-normal.png",
      roughness: "/card-kits/italian-heritage-feminine/maps/italian-heritage-feminine-roughness.png",
      height: "/card-kits/italian-heritage-feminine/maps/italian-heritage-feminine-height.png",
    },
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
  const isOval = "shape" in win && win.shape === "oval";
  const windowRadius = isOval
    ? "50%"
    : `50% 50% 0 0 / ${"archRadiusY" in win ? win.archRadiusY : 25}% ${"archRadiusY" in win ? win.archRadiusY : 25}% 0 0`;

  return (
    <figure
      className={`relative ${className ?? ""}`}
      style={{
        aspectRatio: frame.aspect,
        containerType: "inline-size",
        /*
         * The frame asset is a cutout that carries its own rounded silhouette,
         * so the box must not clip or round it. The shadow follows the alpha
         * rather than the element box for the same reason.
         */
        filter: "drop-shadow(0 18px 26px rgba(38,28,14,0.42))",
      }}
    >
      <Image
        src={frame.src}
        alt=""
        fill
        sizes="(max-width: 640px) 90vw, 460px"
        className="object-contain"
      />

      {frame.maps ? (
        /*
         * Per-pixel relighting from the material maps. This replaces the frame
         * image once its textures are up: a masked CSS gradient can only
         * brighten regions, where the shader actually turns each contour groove
         * toward or away from the light.
         */
        <LitCardSurface
          diffuse={frame.src}
          normal={frame.maps.normal}
          roughness={frame.maps.roughness}
          height={frame.maps.height}
        />
      ) : (
        /* No maps: a single flat sheen, the same treatment the wrapper used to apply. */
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: "var(--sheen-o, 0)",
            background:
              "radial-gradient(ellipse 60% 45% at var(--sheen-x, 50%) var(--sheen-y, 50%), rgba(255,241,205,0.28), transparent 70%)",
            mixBlendMode: "soft-light",
          }}
        />
      )}

      <div
        className="absolute overflow-hidden bg-[#efe7d6]"
        style={{
          left: `${win.left}%`,
          top: `${win.top}%`,
          width: `${win.width}%`,
          height: `${win.height}%`,
          borderRadius: windowRadius,
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
