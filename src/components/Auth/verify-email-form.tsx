"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"

type VerifyEmailFormProps = {

  email: string
  onSuccess: () => void
  onBack: () => void
}

export function VerifyEmailForm({  email, onSuccess, onBack }: VerifyEmailFormProps) {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""))
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const verifyCodeMutation = useMutation({
    mutationFn: async (verificationCode: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verificationCode }),
      })
  
      const data = await response.json()
  
      // Check for logical success
      if (!response.ok || !data.status) {
        throw new Error(data.message || "Invalid verification code")
      }
  
      return data
    },
    onSuccess: () => {
      onSuccess()
    },
    onError: (error) => {
      setError(error.message || "Something went wrong")
    },
  })
  

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to resend OTP")
      }

      return response.json()
    },
  })

//   const handleChange = (index: number, value: string) => {
//     // Only allow numbers
//     if (value && !/^\d+$/.test(value)) return

//     const newOtpValues = [...otpValues]
//     // Take only the last character if multiple are pasted
//     newOtpValues[index] = value.slice(-1)
//     setOtpValues(newOtpValues)

//     // Move to next input if value is entered
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus()
//     }

//     // Clear error when user starts typing again
//     if (error) setError(null)
//   }

const handleChange = (index: number, value: string) => {
    // Allow alphanumeric characters (0-9, a-z, A-Z)
    if (value !== "" && !/^[a-zA-Z0-9]$/.test(value)) return
  
    const newOtpValues = [...otpValues]
    newOtpValues[index] = value.slice(-1) // Keep only the last character
    setOtpValues(newOtpValues)
  
    // Move to the next input if a character is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  
    // Clear error when user starts typing again
    if (error) setError(null)
  }
  

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = otpValues.join("")

    if (verificationCode.length === 6) {
      verifyCodeMutation.mutate(verificationCode)
    } else {
      setError("Please enter all 6 digits")
    }
  }

  const handleResend = () => {
    resendOtpMutation.mutate()
    setOtpValues(Array(6).fill(""))
    setError(null)
  }

  return (
    <div>
      <h1 className="mb-2 text-center text-3xl font-bold">{error ? "Please Try Again" : "Verify Email"}</h1>

      {error ? (
        <p className="mb-8 text-center text-red-500">{error}</p>
      ) : (
        <p className="mb-8 text-center text-gray-400">Please enter the OTP we have sent you in your Email Address.</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex justify-center gap-2">
          {otpValues.map((value, index) => (
            <div
              key={index}
              className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold ${
                error
                  ? "bg-red-200 border-2 border-green-500"
                  : value
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-white border-2 border-gray-200"
              }`}
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-full w-full bg-transparent text-center focus:outline-none"
                autoFocus={index === 0}
              />
            </div>
          ))}
        </div>

        <div className="mb-6 flex justify-between">
          <button type="button" onClick={onBack} className="text-red-500 hover:underline">
            Didn&apos;t receive OTP?
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="text-green-500 hover:underline"
            disabled={resendOtpMutation.isPending}
          >
            {resendOtpMutation.isPending ? "Sending..." : "Resend"}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={verifyCodeMutation.isPending}
        >
          {verifyCodeMutation.isPending ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </div>
  )
}

