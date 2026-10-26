import "server-only";
import { DisputeStatus } from "@prisma/client";

export function canStartReview(status: DisputeStatus): boolean {
  return status === DisputeStatus.OPEN;
}

export function canResolveOrReject(status: DisputeStatus): boolean {
  return status === DisputeStatus.UNDER_REVIEW;
}

export function formatDisputeStatus(status: DisputeStatus): string {
  return status.replace(/_/g, " ");
}
