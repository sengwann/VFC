"use server";

import { revalidatePath } from "next/cache";
import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { AuditEntityType, createAuditLog } from "@/lib/audit";
import {
  getUserIdentifierViolation,
  isUniqueViolation,
} from "@/lib/db/unique-violation";
import {
  validateProfileInput,
  type ProfileField,
} from "../lib/settings-validators";

export type UpdateProfileActionResult =
  | { success: true }
  | {
      success: false;
      formError?: string;
      fieldErrors?: Partial<Record<ProfileField, string>>;
    };

export async function updateProfileAction(
  formData: FormData,
): Promise<UpdateProfileActionResult> {
  const user = await requireAuthenticatedUser();
  const validation = validateProfileInput(formData);
  if (!validation.ok) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: validation.formError,
    };
  }

  const { name, email, phone, dateOfBirth } = validation.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { name, email, phone, dateOfBirth },
      });

      await createAuditLog(tx, {
        actionType: AuditActionType.UPDATE,
        entityType: AuditEntityType.USER,
        entityId: user.id,
        villageId: user.villageId ?? null,
        actorUserId: user.id,
        metadata: { name, email, phone },
      });
    });
  } catch (error) {
    // Email and phone are unique per village, so "in use" means in use inside
    // this account's own village (or among administrators for an admin).
    if (isUniqueViolation(error)) {
      const field = getUserIdentifierViolation(error);
      if (field === "email") {
        return {
          success: false,
          fieldErrors: { email: "This email is already in use." },
        };
      }
      if (field === "phone") {
        return {
          success: false,
          fieldErrors: { phone: "This phone number is already in use." },
        };
      }
    }
    return {
      success: false,
      formError: "Unable to update profile. Please try again.",
    };
  }

  revalidatePath("/settings");
  return { success: true };
}
