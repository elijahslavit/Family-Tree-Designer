import { Card } from "@/components/foundation/card";
import type { ThemeSkin } from "@/lib/types";

const skinCopy: Record<ThemeSkin, { title: string; description: string }> = {
  "dark-gold": {
    title: "Dark Gold",
    description: "Warm archival contrast with restrained gold accents.",
  },
  parchment: {
    title: "Parchment",
    description: "Cream paper tones and library-book typography.",
  },
  modern: {
    title: "Modern",
    description: "Clean geometry with soft neutrals and crisp contrast.",
  },
};

export function SkinPreview({ skin }: { skin: ThemeSkin }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[var(--accent-primary)]" />
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{skinCopy[skin].title}</p>
          <p className="text-sm text-[var(--text-secondary)]">{skinCopy[skin].description}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="h-16 rounded-[var(--radius-md)] bg-[var(--bg-primary)]" />
        <div className="h-16 rounded-[var(--radius-md)] bg-[var(--bg-surface)]" />
        <div className="h-16 rounded-[var(--radius-md)] bg-[var(--accent-muted)]" />
      </div>
    </Card>
  );
}
