"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

type ResetPasswordFormProps = {
 
  email: string
  onSuccess: () => void
}

export function ResetPasswordForm({  email, onSuccess }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetPasswordMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Failed to reset password")
      }

      return response.json()
    },
    onSuccess: () => {
      onSuccess()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    resetPasswordMutation.mutate(password)
  }

  return (
    <div>
      <h1 className="mb-2 text-center text-3xl font-bold">Reset Password</h1>
      <p className="mb-8 text-center text-gray-400">Create your password</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-medium">Enter your Personal Information</h2>

          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block text-gray-400">
              New Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="mb-2 block text-gray-400">
              Confirm password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {(error || resetPasswordMutation.isError) && (
            <p className="mt-2 text-red-500">{error || resetPasswordMutation.error?.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  )
}

