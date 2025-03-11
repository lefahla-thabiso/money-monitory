
export interface FormData {
  fullName: string;
  email: string;
  password: string;
  contact: string;
  accountNumber: string;
  securityQuestion1?: string;
  securityAnswer1?: string;
  securityQuestion2?: string;
  securityAnswer2?: string;
}

export type VerificationMethod = "email" | "phone" | null;

export interface SecurityQuestion {
  id: number;
  question: string;
}

export interface SecurityAnswers {
  email: string;
  question1: string;
  answer1: string;
  question2: string;
  answer2: string;
}

export interface PasswordRecoveryState {
  step: 'questions' | 'newPassword';
  email: string;
  isVerified: boolean;
}
