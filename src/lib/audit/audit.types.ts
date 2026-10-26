import type { AuditActionType, Prisma } from "@prisma/client";

export const AuditEntityType = {
  VILLAGE: "VILLAGE",
  HOUSE: "HOUSE",
  USER: "USER",
  FUND: "FUND",
  COLLECTOR_ASSIGNMENT: "COLLECTOR_ASSIGNMENT",
  PAYMENT: "PAYMENT",
  RECEIPT: "RECEIPT",
  DISPUTE: "DISPUTE",
  SESSION: "SESSION",
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
  paymentMethod?: string;
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
