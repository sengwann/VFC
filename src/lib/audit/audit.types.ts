import type { AuditActionType, Prisma } from "@prisma/client";

export const AuditEntityType = {
  VILLAGE: "VILLAGE",
  HOUSE: "HOUSE",
  USER: "USER",
  FUND: "FUND",
  COLLECTOR_ASSIGNMENT: "COLLECTOR_ASSIGNMENT",
  PAYMENT: "PAYMENT",
  RECEIPT: "RECEIPT",
  SESSION: "SESSION",
  DEACTIVATION_REQUEST: "DEACTIVATION_REQUEST",
} as const;

export type AuditEntityType =
  (typeof AuditEntityType)[keyof typeof AuditEntityType];

export interface CreateAuditLogInput {
  actionType: AuditActionType;
  entityType: AuditEntityType;
  entityId?: string | null;
  villageId?: string | null;
  actorUserId?: string | null;
  metadata?: Prisma.InputJsonValue;
}

export interface VillageAuditMetadata {
  villageCode?: string;
  name?: string;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
  chiefUserId?: string;
}

export interface HouseAuditMetadata {
  houseNumber?: string;
  previousHouseNumber?: string;
  isActive?: boolean;
}

export interface UserAuditMetadata {
  name?: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  previousMembershipStatus?: string;
  newMembershipStatus?: string;
  houseId?: string | null;
}

export interface FundAuditMetadata {
  name?: string;
  targetAmount?: number;
  previousStatus?: string;
  newStatus?: string;
}

export interface CollectorAssignmentAuditMetadata {
  year?: number;
  month?: number;
  isActive?: boolean;
  assignedUserName?: string;
}

export interface PaymentAuditMetadata {
  amount?: number;
  fundId?: string;
  houseId?: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface ReceiptAuditMetadata {
  receiptNumber?: string;
  paymentId?: string;
  status?: string;
}

export interface SessionAuditMetadata {
  userRole?: string;
  villageId?: string | null;
}

/**
 * Village deactivation workflow entries. Dates are ISO-8601 UTC strings.
 * `outcome` is "SUCCESS" for a completed transition and "BLOCKED" for a
 * refused one that is worth recording (a cooldown rejection, a non-Chief or
 * non-Admin attempt, a cancellation after the deadline).
 */
export interface DeactivationAuditMetadata {
  requestId?: string;
  requesterUserId?: string;
  reason?: string;
  outcome?: "SUCCESS" | "BLOCKED";
  blockReason?: string;
  approvedAt?: string;
  scheduledDeactivationAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  cooldownEndsAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  completedAt?: string;
  completedBy?: string;
  /** On VILLAGE entries: read-only mode switched on (true) or off (false). */
  readOnly?: boolean;
  previousStatus?: string;
  newStatus?: string;
}
