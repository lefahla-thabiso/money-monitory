
export interface FormData {
  fullName: string;
  email: string;
  password: string;
  contact: string;
  accountNumber: string;
}

export type VerificationMethod = "email" | "phone" | null;
