
import { FormData } from "@/types/auth";

export const validateAuthForm = (formData: FormData, isSignUp: boolean) => {
  const errors: Partial<FormData> = {};
  
  if (isSignUp) {
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!formData.contact.trim()) {
      errors.contact = "Contact number is required";
    }
    if (!formData.accountNumber.trim()) {
      errors.accountNumber = "Account number is required";
    } else if (!/^\d{10,}$/.test(formData.accountNumber)) {
      errors.accountNumber = "Account number must be at least 10 digits";
    }
  }
  
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Invalid email format";
  }
  
  if (!formData.password.trim()) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
