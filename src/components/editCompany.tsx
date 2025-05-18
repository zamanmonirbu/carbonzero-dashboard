"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Company } from "@/services/api-service";
import { toast } from "sonner";

export default function EditCompanyPage({ id }: { id: string }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const lstoredToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    } else setToken(lstoredToken);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["singleCompany", id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch company");
      }
      return res.json();
    },
    enabled: token !== null, // Only run query when token is available
  });

  const [formData, setFormData] = useState({
    identificationNumber: "",
    businessLicenseNumber: "",
    businessEntity: "",
    businessDuration: "",
    industryType: "",
    uniqueCode: "",
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        identificationNumber: data.data.identificationNumber || "",
        businessLicenseNumber: data.data.businessLicenseNumber || "",
        businessEntity: data.data.businessEntity || "",
        businessDuration: data.data.businessDuration || "",
        industryType: data.data.industryType || "",
        uniqueCode: data.data.uniqueCode || "", // or the correct field
      });
    }
  }, [data]);

  const updateCompanyMutation = useMutation({
    mutationFn: async (updatedData: Partial<Company>) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!res.ok) throw new Error("Failed to update company");
      return res.json();
    },
    onSuccess: () => {
      // console.log(data.message)
      toast.success("Company updated successfully!");
      // QueryClient.invalidateQueries(["singleCompany", id]);
    },
    onError: () => {
      console.log(data.message);
      toast.error("Failed to update company.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateCompanyMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading company data.</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-[524px] mt-6"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-4">Company</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <label htmlFor="companyId" className="text-sm font-medium">
                Identification Number
              </label>
              <Input
                id="identificationNumber"
                value={formData?.identificationNumber}
                onChange={handleChange}
                className="w-full h-[59px] rounded-[6px] border-[#595959]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Business License Number
              </label>
              <Input
                id="businessLicenseNumber"
                value={formData?.businessLicenseNumber}
                onChange={handleChange}
                className="w-full h-[59px] rounded-[6px] border-[#595959]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Business Entity
              </label>
              <Input
                id="businessEntity"
                value={formData?.businessEntity}
                onChange={handleChange}
                className="w-full h-[59px] rounded-[6px] border-[#595959]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Business Duration
              </label>
              <Input
                id="businessDuration"
                value={formData?.businessDuration}
                onChange={handleChange}
                className="w-full h-[59px] rounded-[6px] border-[#595959]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="code" className="text-sm font-medium">
            Industry Type
          </label>
          <Input
            id="industryType"
            value={formData?.industryType}
            onChange={handleChange}
            className="w-full h-[59px] text-green-500 rounded-[6px] border-[#595959]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="uniqueCode" className="text-sm font-medium">
            Code
          </label>
          <Input
            id="uniqueCode"
            value={formData?.uniqueCode}
            onChange={handleChange}
            className="w-full h-[59px] text-green-500 rounded-[6px] border-[#595959]"
          />
        </div>
      </div>

      <div className="flex justify-end items-end gap-5">
        <div className="mt-6">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:shadow-outline w-[158px] h-[51px]"
          >
            Save
          </button>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() =>
              setFormData({
                industryType: "",
                identificationNumber: "",
                businessLicenseNumber: "",
                businessEntity: "",
                businessDuration: "",
                uniqueCode: "",
              })
            }
            className="bg-red-500 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:shadow-outline w-[158px] h-[51px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
