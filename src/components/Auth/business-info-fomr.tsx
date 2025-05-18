"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Define the BusinessFormData interface
interface BusinessFormData {
  businessName: string
  identificationNumber: string
  businessLicenseNumber: string
  businessAddress: string
  businessEntity: string
  businessDuration: string
  industryType: string
  employeeNumber: number
  primaryProducts: string[]
  annualRevenue: number
}

interface BusinessInfoFormProps {
  onSubmit: (data: BusinessFormData) => void
  isSubmitting: boolean
  onBack: () => void
}

export default function BusinessInfoForm({ onSubmit, isSubmitting ,onBack }: BusinessInfoFormProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    identificationNumber: "",
    businessLicenseNumber: "",
    businessAddress: "",
    businessEntity: "",
    businessDuration: "",
    industryType: "",
    employeeNumber: "",
    primaryProducts: "",
    annualRevenue: "",
  })

  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required"
    }

    if (!formData.identificationNumber.trim()) {
      newErrors.identificationNumber = "Identification number is required"
    }

    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = "Business address is required"
    }

    if (!formData.businessEntity.trim()) {
      newErrors.businessEntity = "Business entity type is required"
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Convert to the format expected by the API
      const submitData = {
        businessName: formData.businessName,
        identificationNumber: formData.identificationNumber,
        businessLicenseNumber: formData.businessLicenseNumber,
        businessAddress: formData.businessAddress,
        businessEntity: formData.businessEntity,
        businessDuration: formData.businessDuration,
        industryType: formData.industryType,
        employeeNumber: Number.parseInt(formData.employeeNumber) || 0,
        primaryProducts: formData.primaryProducts.split(",").map((item) => item.trim()),
        annualRevenue: Number.parseInt(formData.annualRevenue) || 0,
      }

      onSubmit(submitData)
    }
  }

  const handleBack = () => {
    onBack()
  }

  return (

   <div className="">

    <div className="mb-40">

    </div>
        <div className="border w-full mx-auto max-w-[1179px] border-gray-200 rounded-lg p-6 my-8">
      <h1 className="text-2xl font-bold mb-6  ">Frequently Answer those Question</h1>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessName">What is the legal name of your business?</Label>
            <Input
              id="businessName"
              name="businessName"
              placeholder="Answer"
              value={formData.businessName}
              onChange={handleChange}
              className={errors.businessName ? "border-red-500" : ""}
            />
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
          </div>

          <div>
            <Label htmlFor="identificationNumber">
              What is your business registration or tax identification number (e.g., EIN, VAT, GST)?
            </Label>
            <Input
              id="identificationNumber"
              name="identificationNumber"
              placeholder="Answer"
              value={formData.identificationNumber}
              onChange={handleChange}
              className={errors.identificationNumber ? "border-red-500" : ""}
            />
            {errors.identificationNumber && <p className="text-red-500 text-xs mt-1">{errors.identificationNumber}</p>}
          </div>

          <div>
            <Label htmlFor="businessLicenseNumber">
              Can you provide your business license or certificate of incorporation?
            </Label>
            <Input
              id="businessLicenseNumber"
              name="businessLicenseNumber"
              placeholder="Answer"
              value={formData.businessLicenseNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="businessAddress">What is the registered address of your business?</Label>
            <Input
              id="businessAddress"
              name="businessAddress"
              placeholder="Answer"
              value={formData.businessAddress}
              onChange={handleChange}
              className={errors.businessAddress ? "border-red-500" : ""}
            />
            {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}
          </div>

          <div>
            <Label htmlFor="businessEntity">
              What type of business entity are you (e.g., LLC, Corporation, Partnership, Sole Proprietorship)?
            </Label>
            <Input
              id="businessEntity"
              name="businessEntity"
              placeholder="Answer"
              value={formData.businessEntity}
              onChange={handleChange}
              className={errors.businessEntity ? "border-red-500" : ""}
            />
            {errors.businessEntity && <p className="text-red-500 text-xs mt-1">{errors.businessEntity}</p>}
          </div>

          <div>
            <Label htmlFor="businessDuration">How long has your business been operating?</Label>
            <Input
              id="businessDuration"
              name="businessDuration"
              placeholder="Answer"
              value={formData.businessDuration}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="industryType">What industry does your business operate in?</Label>
            <Input
              id="industryType"
              name="industryType"
              placeholder="Answer"
              value={formData.industryType}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="employeeNumber">How many employees do you have?</Label>
            <Input
              id="employeeNumber"
              name="employeeNumber"
              placeholder="Answer"
              type="number"
              value={formData.employeeNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="primaryProducts">What are your primary products or services?</Label>
            <Input
              id="primaryProducts"
              name="primaryProducts"
              placeholder="Answer (comma separated)"
              value={formData.primaryProducts}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="annualRevenue">What is your annual revenue or budget range?</Label>
            <Input
              id="annualRevenue"
              name="annualRevenue"
              placeholder="Answer"
              type="number"
              value={formData.annualRevenue}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-start space-x-2 mt-4">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className={errors.terms ? "border-red-500" : ""}
            />
            <Label htmlFor="terms" className="text-sm leading-tight">
              I hereby declare that all the information provided in this form is true, accurate, and complete to the
              best of my knowledge. I understand that any false or misleading information may result in the termination
              of services or legal action.
            </Label>
          </div>
          {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
        </div>

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={handleBack}>
            ← Back
          </Button>
          <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Next"}
          </Button>
        </div>
      </form>
    </div>
   </div>

  )
}

