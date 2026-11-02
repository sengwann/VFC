import type { ReactNode } from "react";
import { AppShell } from "../../features/shell/components/app-shell";
import { buildPlatformNavigation } from "../../features/shell/lib/navigation";
import { getPlatformShellContext } from "../../features/shell/lib/shell-context";
import { countPendingDeactivationRequests } from "../../features/village-deactivation/lib/deactivation-queries";
import { TranslationProvider } from "../../lib/i18n/provider";

export default async function PlatformLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, language } = await getPlatformShellContext();
  const pendingDeactivations = await countPendingDeactivationRequests();
  const navigation = buildPlatformNavigation(language, pendingDeactivations);
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
