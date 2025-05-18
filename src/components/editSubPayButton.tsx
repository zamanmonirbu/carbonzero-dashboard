"use client";

import React from "react";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";

const AddSubscription = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const submittedData = {
      date: formData.get("date"),
      price: formData.get("price"),
      description: formData.get("description"),
      features: [
        formData.get("feature1") ? "Market Growth Solution" : null,
        formData.get("feature2") ? "Great Customer Support" : null,
        formData.get("feature3") ? "Time Series Models" : null,
        formData.get("feature4") ? "24/7 Consultant Service" : null,
      ].filter(Boolean),
    };

    console.log("Submitted Data:", submittedData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-md p-6">
      <h2 className="text-[24px] font-semibold mb-4">Add Subscription</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label htmlFor="date" className="text-base font-medium">
            Date
          </label>
          <Input
            id="date"
            name="date"
            defaultValue="2025-04-15"
            className="w-full h-[59px] rounded-[6px] border-[#595959]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-base font-medium">
            Price
          </label>
          <Input
            id="price"
            name="price"
            defaultValue="$99"
            className="w-full h-[59px] rounded-[6px] border-[#595959]"
          />
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <label
          htmlFor="description"
          className="block text-base font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full h-[125px] rounded-[6px] border-[#595959] border p-3"
          placeholder="Write here..."
        />
      </div>

      <div className="bg-gray-100 py-3 px-4 rounded-md flex items-center justify-between mb-4">
        <label className="block text-base font-[400] text-gray-700">FEATURES</label>
        <button
          type="button"
          className="bg-[#09B850] hover:bg-green-700 w-[81px] h-[34px] flex justify-center items-center rounded-mdd rounded-md shadow-[0px_4px_12px_0px_#24242426]"
        >
          <Plus className="text-[14px] text-white" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-4">
          <label className="text-sm text-gray-700">Market Growth Solution</label>
          <input
            type="checkbox"
            name="feature1"
            className="form-checkbox h-[24px] w-[24px] text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center justify-between p-4">
          <label className="text-sm text-gray-700">Great Customer Support</label>
          <input
            type="checkbox"
            name="feature2"
            className="form-checkbox h-[24px] w-[24px] text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center justify-between p-4">
          <label className="text-sm text-gray-700">Time Series Models</label>
          <input
            type="checkbox"
            name="feature3"
            className="form-checkbox h-[24px] w-[24px] text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center justify-between p-4">
          <label className="text-sm text-gray-700">24/7 Consultant Service</label>
          <input
            type="checkbox"
            name="feature4"
            className="form-checkbox h-[24px] w-[24px] text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
            className="bg-red-500 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:shadow-outline w-[158px] h-[51px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddSubscription;
