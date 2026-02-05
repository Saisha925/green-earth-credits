export const PLATFORM_FEE_PERCENTAGE = 5; // 5%

export interface RetirementBreakdown {
  creditSubtotal: number;
  platformFeePercentage: number;
  platformFeeAmount: number;
  totalAmountPaid: number;
  sellerAmount: number;
}

export const calculateRetirementFees = (
  pricePerTonne: number,
  quantity: number
): RetirementBreakdown => {
  const creditSubtotal = pricePerTonne * quantity;
  const platformFeeAmount = (creditSubtotal * PLATFORM_FEE_PERCENTAGE) / 100;
  const totalAmountPaid = creditSubtotal + platformFeeAmount;
  const sellerAmount = creditSubtotal;

  return {
    creditSubtotal,
    platformFeePercentage: PLATFORM_FEE_PERCENTAGE,
    platformFeeAmount,
    totalAmountPaid,
    sellerAmount
  };
};
