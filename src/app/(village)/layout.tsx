import type { ReactNode } from "react";
import { AppShell } from "../../features/shell/components/app-shell";
import { buildVillageNavigation } from "../../features/shell/lib/navigation";
import { getVillageShellContext } from "../../features/shell/lib/shell-context";
import { UserRole } from "@prisma/client";
import { VillageReadOnlyBanner } from "../../features/village-deactivation/components/village-read-only-banner";
import { getOpenDeactivationRequest } from "../../features/village-deactivation/lib/deactivation-queries";
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
  // Informational only: each mutation enforces read-only itself.
  const openRequest = await getOpenDeactivationRequest(context.villageId);
  const readOnlyDeadline =
    openRequest?.status === "APPROVED"
      ? openRequest.scheduledDeactivationAt
      : null;
  return (
    <TranslationProvider language={language}>
      <AppShell
        awaitingChiefApproval={awaitingChiefApproval}
        navigation={navigation}
        user={context.user}
        variant="village"
        language={language}
      >
        {readOnlyDeadline ? (
          <VillageReadOnlyBanner
            deadline={readOnlyDeadline}
            isChief={context.user.role === UserRole.CHIEF}
            language={language}
          />
        ) : null}
        {children}
      </AppShell>
    </TranslationProvider>
  );
}
