import "server-only";
import { prisma } from "@/lib/prisma";
import { AuditEntityType } from "@/lib/audit";

export interface EntityLinkInfo {
  label: string;
  href: string | null;
}

export async function resolveEntityInfo(
  entityType: string,
  entityId: string | null,
  villageId: string,
): Promise<EntityLinkInfo> {
  if (!entityId) {
    return { label: "—", href: null };
  }

  switch (entityType) {
    case AuditEntityType.HOUSE: {
      const house = await prisma.house.findFirst({
        where: { id: entityId, villageId },
        select: { houseNumber: true },
      });
      return house
        ? {
            label: `House ${house.houseNumber}`,
            href: `/village/houses/${entityId}`,
          }
        : { label: entityId, href: null };
    }

    case AuditEntityType.FUND: {
      const fund = await prisma.fund.findFirst({
        where: { id: entityId, villageId },
        select: { name: true },
      });
      return fund
        ? { label: fund.name, href: `/village/funds/${entityId}` }
        : { label: entityId, href: null };
    }

    case AuditEntityType.RECEIPT: {
      const receipt = await prisma.receipt.findFirst({
        where: { id: entityId, villageId },
        select: { receiptNumber: true },
      });
      return receipt
        ? {
            label: receipt.receiptNumber,
            href: `/village/receipts/${entityId}`,
          }
        : { label: entityId, href: null };
    }

    case AuditEntityType.DISPUTE: {
      const dispute = await prisma.dispute.findFirst({
        where: { id: entityId, villageId },
        select: { id: true },
      });
      return dispute
        ? { label: "Dispute record", href: `/village/disputes/${entityId}` }
        : { label: entityId, href: null };
    }

    case AuditEntityType.USER: {
      const user = await prisma.user.findFirst({
        where: { id: entityId, villageId },
        select: { name: true },
      });
      return user
        ? { label: user.name, href: null }
        : { label: entityId, href: null };
    }

    case AuditEntityType.VILLAGE: {
      const village = await prisma.village.findUnique({
        where: { id: entityId },
        select: { villageCode: true, name: true },
      });
      return village
        ? { label: `${village.villageCode} — ${village.name}`, href: null }
        : { label: entityId, href: null };
    }

    case AuditEntityType.COLLECTOR_ASSIGNMENT: {
      const assignment = await prisma.collectorAssignment.findFirst({
        where: { id: entityId, villageId },
        select: {
          year: true,
          month: true,
          user: { select: { name: true } },
        },
      });
      return assignment
        ? {
            label: `${assignment.year}-${String(assignment.month).padStart(
              2,
              "0",
            )} · ${assignment.user.name}`,
            href: null,
          }
        : { label: entityId, href: null };
    }

    case AuditEntityType.PAYMENT:
      return { label: "Payment record", href: null };

    case AuditEntityType.SESSION:
      return { label: "Session event", href: null };

    default:
      return { label: entityId, href: null };
  }
}
