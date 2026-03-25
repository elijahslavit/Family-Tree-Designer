import { ThemePickerForm } from "@/components/domain/theme-picker-form";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator } from "@/lib/queries";
import { publicTreeHref } from "@/lib/utils/links";

export default async function ThemePage() {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const publicHref = publicTreeHref(tree.slug, tree.shareToken);

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={<ThemePickerForm tree={tree} publicHref={publicHref} />}
        detail={null}
      />
    </ThemeProvider>
  );
}
