"use client";

import { Input } from "@/components/ui/input";

const subscriptionData = {
  planName: "KH2118",
  subscriptionType: "Barone LLC",
  amount: "(310) 555-0116",
  date: "ztor@gmail.com",
  feature: "69224",
};

export default function EditSubscriptionPayment() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const submittedData = {
      planName: formData.get("planName"),
      subscriptionType: formData.get("subscriptionType"),
      amount: formData.get("amount"),
      date: formData.get("date"),
      feature: formData.get("feature"),
    };

    console.log("Form Submitted:", submittedData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-[524px] mt-6"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-medium mb-4">Subscription & Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <label htmlFor="planName" className="text-base font-medium">
                Plan Name
              </label>
              <Input
                name="planName"
                defaultValue={subscriptionData.planName}
                className="w-full h-[59px] rounded-[6px] border-[#595959]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subscriptionType" className="text-base font-medium">
                Subscription Type
              </label>
              <Input
                name="subscriptionType"
                defaultValue={subscriptionData.subscriptionType}
                className="w-full h-[59px] rounded-[6px] border-[#595959]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="amount" className="text-base font-medium">
                Amount
              </label>
              <Input
                name="amount"
                defaultValue={subscriptionData.amount}
                className="w-full h-[59px] rounded-[6px] border-[#595959]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-base font-medium">
                Date
              </label>
              <Input
                name="date"
                defaultValue={subscriptionData.date}
                className="w-full h-[59px] rounded-[6px] border-[#595959]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="feature" className="text-base font-medium">
            Feature
          </label>
          <Input
            name="feature"
            defaultValue={subscriptionData.feature}
            className="w-full h-[59px] rounded-[6px] border-[#595959]"
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
}
