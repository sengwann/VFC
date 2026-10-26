import type { ReactNode } from "react";
import { AppShell } from "../../features/shell/components/app-shell";
import { buildVillageNavigation } from "../../features/shell/lib/navigation";
import { getVillageShellContext } from "../../features/shell/lib/shell-context";
import { TranslationProvider } from "../../lib/i18n/provider";

export default async function VillageLayout({
  children,
}: {
  children: ReactNode;
}) {
  const {
    context,
    collectorContext,
    isHeadOfHouse,
    awaitingChiefApproval,
    notifications,
    language,
  } = await getVillageShellContext();
  const navigation = buildVillageNavigation({
    user: context.user,
    isActiveCollector: Boolean(collectorContext),
    isHeadOfHouse,
    notifications,
    language,
  });
  return (
    <TranslationProvider language={language}>
      <AppShell
        awaitingChiefApproval={awaitingChiefApproval}
        navigation={navigation}
        user={context.user}
        variant="village"
        language={language}
      >
        {children}
      </AppShell>
    </TranslationProvider>
  );
}
