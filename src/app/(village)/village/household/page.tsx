import { MembershipStatus } from "@prisma/client";
import { approveMemberAction } from "../../../../features/household-management/actions/approve-member.action";
import { changeHeadAction } from "../../../../features/household-management/actions/change-head.action";
import { rejectMemberAction } from "../../../../features/household-management/actions/reject-member.action";
import { removeMemberAction } from "../../../../features/household-management/actions/remove-member.action";
import { HouseholdView } from "../../../../features/household-management/components/household-view";
import { requireHouseholdManagementAccess } from "../../../../features/household-management/lib/household-access";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Household Members | Village Fund Collection System",
};

export default async function HouseholdPage() {
  const { house } = await requireHouseholdManagementAccess();

  const members = await prisma.user.findMany({
    where: {
      houseId: house.id,
    },
    select: {
      id: true,
      name: true,
      role: true,
      membershipStatus: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const currentHead = members.find(
    (member) => member.id === house.headOfHouseId,
  );

  const pendingMembers = members.filter(
    (member) => member.membershipStatus === MembershipStatus.PENDING,
  );

  const activeMembers = members.filter(
    (member) => member.membershipStatus === MembershipStatus.ACTIVE,
  );

  const historicalMembers = members.filter(
    (member) =>
      member.membershipStatus === MembershipStatus.REJECTED ||
      member.membershipStatus === MembershipStatus.REMOVED,
  );

  const changeHeadCandidates = activeMembers.filter(
    (member) => member.id !== house.headOfHouseId,
  );

  return (
    <HouseholdView
      activeMembers={activeMembers}
      approveAction={approveMemberAction}
      changeHeadAction={changeHeadAction}
      changeHeadCandidates={changeHeadCandidates}
      currentHeadName={currentHead ? currentHead.name : null}
      headOfHouseId={house.headOfHouseId}
      historicalMembers={historicalMembers}
      houseNumber={house.houseNumber}
      pendingMembers={pendingMembers}
      rejectAction={rejectMemberAction}
      removeAction={removeMemberAction}
    />
  );
}
