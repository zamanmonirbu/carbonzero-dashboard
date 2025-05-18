"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import PersonalInfoForm from "./Personal-info-form"

// Types
interface UserRegistrationData {
  fullName: string
  phoneNumber: string
  email: string
  password: string
  companyLegalName: string
  role: string
}

// API functions using TanStack Query
const registerUserFn = async (userData: UserRegistrationData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to register user")
  }

  return await response.json()
}

export default function SignUpFlow() {
  const router = useRouter()

  // User registration mutation
  const userMutation = useMutation({
    mutationFn: registerUserFn,
    onSuccess: (response) => {
      toast.success(response.message || "User registered successfully!")
      router.push("/subscription")
    },
    onError: (error: Error) => {
      toast.error(`Registration failed: ${error.message}`)
    },
  })

  const handlePersonalInfoSubmit = (data: {
    fullName: string
    phoneNumber: string
    email: string
    password: string
    companyLegalName: string
  }) => {
    // Start the registration process directly
    userMutation.mutate({
      ...data,
      role: "user",
    })
  }

  // Determine if we're in a submitting state
  const isSubmitting = userMutation.isPending

  // Determine if there's an error
  const error = userMutation.error ? (userMutation.error as Error).message : ""

  return (
    <div className="w-full mx-auto max-w-full">
      <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} isSubmitting={isSubmitting} />
      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
    </div>
  )
}