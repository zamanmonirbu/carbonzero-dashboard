"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ForgetPasswordForm } from "./forget-password-form";
import { VerifyEmailForm } from "./verify-email-form";
import { ResetPasswordForm } from "./reset-password-form";
import { toast } from "sonner";
import Image from "next/image";
import formLogo from "../../Public/assets/fomrLogo.png";
// Create a client
const queryClient = new QueryClient();

export function PasswordResetFlow() {
  const [currentStep, setCurrentStep] = useState<"forget" | "verify" | "reset">(
    "forget"
  );
  const [email, setEmail] = useState<string>("");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex items-center justify-center h-screen ">
        <div className="w-full max-w-md mx-auto  rounded-3xl border border-green-500 p-8">
          <div className="flex items-center justify-center my-8 ">
            <Image
              src={formLogo}
              alt="Business Consultation Logo"
              width={140}
              height={40}
              className="mr-2"
            />
          </div>

          {currentStep === "forget" && (
            <ForgetPasswordForm
              onSuccess={(email) => {
                toast.success("Check Email To Get Verification Code");
                setEmail(email);
                setCurrentStep("verify");
              }}
            />
          )}

          {currentStep === "verify" && (
            <VerifyEmailForm
              email={email}
              onSuccess={() => {
                setCurrentStep("reset");
              }}
              onBack={() => setCurrentStep("forget")}
            />
          )}

          {currentStep === "reset" && (
            <ResetPasswordForm
              email={email}
              onSuccess={() => {
                // Show success message
                toast.success("Password updated successfully");

                // Redirect to login page after a short delay
                setTimeout(() => {
                  window.location.href = "/login";
                }, 1000);
              }}
            />
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}
