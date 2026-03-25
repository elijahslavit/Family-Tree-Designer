import { ThemePickerForm } from "@/components/domain/theme-picker-form";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator } from "@/lib/queries";

export default async function ThemePage() {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell tree={tree} main={<ThemePickerForm tree={tree} />} detail={null} />
    </ThemeProvider>
  );
}
