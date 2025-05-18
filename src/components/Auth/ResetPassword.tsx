"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    console.log({
      newPassword,
      confirmPassword,
    })

    setError("")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#09B850] bg-white p-8">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center">
            <Image src="/asset/fomrLogo.png" alt="Business Consultation Logo" width={140} height={40} className="mr-2" />
         
          </div>
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold">Reset Password</h1>
        <p className="mb-8 text-center text-gray-400">Create your password</p>

        <form onSubmit={handleSubmit}>
          <h2 className="mb-6 text-xl font-semibold text-gray-800">Enter your Personal Information</h2>

          {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">{error}</div>}

          <div className="mb-4">
            <label htmlFor="new-password" className="mb-2 block text-gray-400">
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="confirm-password" className="mb-2 block text-gray-400">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-500 py-3 text-center font-medium text-white hover:bg-green-600 focus:outline-none"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

