"use server";

import {
  AuditActionType,
  MembershipStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { withSerializableRetry } from "../../../lib/db/transaction";
import { prisma } from "../../../lib/prisma";
import { requireChief, getCurrentPeriod } from "../../../lib/authz";
import {
  validateAssignCollectorInput,
  type AssignCollectorField,
} from "../lib/collector-assignment-validators";
import { AuditEntityType, createAuditLog } from "../../../lib/audit";

export type AssignCollectorActionResult =
  | { success: true }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<AssignCollectorField, string>>;
    };

// Chiefs are not eligible collectors (owner decision).
const NOT_CHIEF = { not: UserRole.CHIEF } as const;

export async function assignCollectorAction(
  formData: FormData,
): Promise<AssignCollectorActionResult> {
  const { user, villageId } = await requireChief();
  const currentPeriod = getCurrentPeriod();

  const validation = validateAssignCollectorInput(formData, currentPeriod);
  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const { userId, year, month } = validation.data;

  const targetUser = await prisma.user.findFirst({
    where: {
      id: userId,
      villageId,
      membershipStatus: MembershipStatus.ACTIVE,
      role: NOT_CHIEF,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!targetUser) {
    return {
      success: false,
      fieldErrors: {
        userId: "Selected user is not an active member of this village.",
      },
    };
  }

  let assignmentId: string | undefined;

  try {
    await withSerializableRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const activeTarget = await tx.user.findFirst({
            where: {
              id: userId,
              villageId,
              membershipStatus: MembershipStatus.ACTIVE,
              role: NOT_CHIEF,
            },
            select: { id: true },
          });

          if (!activeTarget) {
            throw new Error("TARGET_USER_NOT_ELIGIBLE");
          }

          const existingActiveAssignment =
            await tx.collectorAssignment.findFirst({
              where: {
                villageId,
                year,
                month,
                isActive: true,
              },
              select: {
                id: true,
                userId: true,
              },
            });

          if (existingActiveAssignment) {
            if (existingActiveAssignment.userId === userId) {
              throw new Error("SAME_USER_ALREADY_ACTIVE_COLLECTOR");
            }

            throw new Error("ACTIVE_COLLECTOR_ALREADY_EXISTS");
          }

          const existingInactiveAssignment =
            await tx.collectorAssignment.findUnique({
              where: {
                villageId_userId_year_month: {
                  villageId,
                  userId,
                  year,
                  month,
                },
              },
              select: {
                id: true,
                isActive: true,
              },
            });

          let createdAssignmentId: string;

          if (existingInactiveAssignment) {
            const reactivated = await tx.collectorAssignment.updateMany({
              where: {
                id: existingInactiveAssignment.id,
                isActive: false, // <-- ဒီ guard က အဓိက
              },
              data: { isActive: true },
            });

            // တခြား request က အရင် reactivate လုပ်ပြီးသား (သို့) တခြား user
            // အတွက် active row တစ်ခု ဖြစ်နေပြီ။
            if (reactivated.count === 0) {
              throw new Error("ACTIVE_COLLECTOR_ALREADY_EXISTS");
            }

            createdAssignmentId = existingInactiveAssignment.id;
          } else {
            const created = await tx.collectorAssignment.create({
              data: {
                villageId,
                userId,
                year,
                month,
                isActive: true,
              },
            });

            createdAssignmentId = created.id;
          }

          assignmentId = createdAssignmentId;

          await createAuditLog(tx, {
            actionType: AuditActionType.ASSIGN,
            entityType: AuditEntityType.COLLECTOR_ASSIGNMENT,
            entityId: createdAssignmentId,
            villageId,
            actorUserId: user.id,
            metadata: {
              year,
              month,
              isActive: true,
              assignedUserId: userId,
              assignedUserName: targetUser.name,
            },
          });
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      ),
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "TARGET_USER_NOT_ELIGIBLE") {
        return {
          success: false,
          fieldErrors: {
            userId: "Selected user is not an active member of this village.",
          },
        };
      }

      if (error.message === "SAME_USER_ALREADY_ACTIVE_COLLECTOR") {
        return {
          success: false,
          formError:
            "This user is already the active Collector for the selected period.",
        };
      }

      if (error.message === "ACTIVE_COLLECTOR_ALREADY_EXISTS") {
        return {
          success: false,
          formError:
            "An active Collector already exists for the selected period. Deactivate the existing assignment first.",
        };
      }
    }

    // P2002 = unique constraint violation. With the partial index
    // (villageId, year, month) WHERE isActive = true, this means another
    // request created an active assignment for the same period in parallel.
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2002") {
      return {
        success: false,
        formError:
          "An active Collector already exists for the selected period. Deactivate the existing assignment first.",
      };
    }

    return {
      success: false,
      formError: "Unable to assign collector. Please try again.",
    };
  }

  if (!assignmentId) {
    return {
      success: false,
      formError: "Unable to assign collector. Please try again.",
    };
  }

  return { success: true };
}
