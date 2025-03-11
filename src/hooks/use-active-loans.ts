
// Re-export all loan-related hooks from their individual files
export { useActiveLoansByBorrower } from './use-borrower-loans';
export { useActiveLoansByLender } from './use-lender-loans';
export { useBorrowOffer } from './use-borrow-offer';
export { useUpdateLoanPayment, useConfirmLoanPayment } from './use-loan-payments';

// Re-export the API functions for backward compatibility
export { fetchActiveLoansByBorrowerId, fetchActiveLoansByLenderId } from '@/api/active-loans';
