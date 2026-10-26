"use server";

import { redirect } from "next/navigation";
import { AuditActionType } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { requireChief, getCurrentPeriod } from "../../../lib/authz";
import { canDeactivateAssignment } from "../lib/collector-assignment-rules";
import { getPeriodStatus } from "../lib/collector-period";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";

function getFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function deactivateCollectorAssignmentAction(
  formData: FormData,
): Promise<void> {
  const { user, villageId } = await requireChief();

  const assignmentId = getFormDataString(formData, "assignmentId");
  if (!assignmentId) {
    redirect("/village/collectors");
  }

  const assignment = await prisma.collectorAssignment.findFirst({
    where: {
      id: assignmentId,
      villageId,
    },
    select: {
      id: true,
      isActive: true,
      year: true,
      month: true,
      userId: true,
      user: { select: { name: true } },
    },
  });

  if (!assignment) {
    redirect("/village/collectors");
  }

  const currentPeriod = getCurrentPeriod();
  const periodStatus = getPeriodStatus(
    assignment.year,
    assignment.month,
    currentPeriod,
  );

  if (!canDeactivateAssignment(assignment.isActive, periodStatus)) {
    redirect("/village/collectors");
  }

  await prisma.$transaction(async (tx) => {
    const result = await tx.collectorAssignment.updateMany({
      where: {
        id: assignment.id,
        villageId,
        isActive: true,
      },
      data: { isActive: false },
    });

    // Another request already deactivated it. Skip the audit write so a
    // double submit does not create duplicate audit entries.
    if (result.count === 0) {
      return;
    }

    await createAuditLog(tx, {
      actionType: AuditActionType.STATUS_CHANGE,
      entityType: AuditEntityType.COLLECTOR_ASSIGNMENT,
      entityId: assignment.id,
      villageId,
      actorUserId: user.id,
      metadata: {
        year: assignment.year,
        month: assignment.month,
        isActive: false,
        assignedUserId: assignment.userId,
        assignedUserName: assignment.user.name,
      },
    });
  });

  redirect("/village/collectors");
}
