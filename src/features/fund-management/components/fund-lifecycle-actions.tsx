import type { FundStatus } from "@prisma/client";
import { activateFundAction } from "../actions/activate-fund.action";
import { closeFundAction } from "../actions/close-fund.action";
import {
  canActivateFund,
  canCloseFund,
  canEditFund,
} from "../lib/fund-lifecycle";
import { FundLifecycleControls } from "./fund-lifecycle-controls";

export function FundLifecycleActions({
  fundId,
  status,
  hasOtherActiveFund,
}: {
  fundId: string;
  status: FundStatus;
  hasOtherActiveFund: boolean;
}) {
  return (
    <FundLifecycleControls
      activateAction={activateFundAction}
      canActivate={canActivateFund(status)}
      canClose={canCloseFund(status)}
      canEdit={canEditFund(status)}
      closeAction={closeFundAction}
      fundId={fundId}
      hasOtherActiveFund={hasOtherActiveFund}
      status={status}
    />
  );
}
