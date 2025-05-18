"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ForgetPasswordFormProps = {
  
  onSuccess: (email: string) => void
}

export function ForgetPasswordForm({  onSuccess }: ForgetPasswordFormProps) {
  const [email, setEmail] = useState("")

  const forgetPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to send reset email")
      }

      return response.json()
    },
    onSuccess: () => {
      onSuccess(email)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      forgetPasswordMutation.mutate(email)
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-center text-3xl font-bold">Forget Password?</h1>
      <p className="mb-8 text-center text-gray-400">
        You may receive email notifications from us to reset your password for security and login purposes.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-medium">Enter your Personal Information</h2>
          <label htmlFor="email" className="mb-2 block text-gray-400">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={forgetPasswordMutation.isPending}
        >
          {forgetPasswordMutation.isPending ? "Sending..." : "OTP Send"}
        </Button>

        {forgetPasswordMutation.isError && (
          <p className="mt-2 text-center text-red-500">{forgetPasswordMutation.error.message}</p>
        )}
      </form>
    </div>
  )
}

