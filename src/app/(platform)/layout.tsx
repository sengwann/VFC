import type { ReactNode } from "react";
import { AppShell } from "../../features/shell/components/app-shell";
import { buildPlatformNavigation } from "../../features/shell/lib/navigation";
import { getPlatformShellContext } from "../../features/shell/lib/shell-context";
import { TranslationProvider } from "../../lib/i18n/provider";

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, language } = await getPlatformShellContext();
  const navigation = buildPlatformNavigation(language);
  return (
    <TranslationProvider language={language}>
      <AppShell
        navigation={navigation}
        user={user}
        variant="platform"
        language={language}
      >
        {children}
      </AppShell>
    </TranslationProvider>
  );
}
