"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

export default function AddSubscriptionForm() {
  const [planName, setPlanName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState({
    marketGrowth: false,
    customerSupport: false,
    timeSeriesModels: false,
    consultantService: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!planName || !price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Subscription added",
        description: "The subscription plan has been added successfully",
      });

      router.push("/subscription-payment");
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}, Something went wrong. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Add Subscription</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan Name</label>
                <Input
                  placeholder="Enter plan name"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  placeholder="$0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Write here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <div className="bg-gray-100 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">FEATURES</h3>
                  <Button
                    type="button"
                    size="sm"
                    className="h-6 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="marketGrowth"
                      checked={features.marketGrowth}
                      onCheckedChange={(checked) =>
                        setFeatures({
                          ...features,
                          marketGrowth: checked as boolean,
                        })
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor="marketGrowth" className="text-sm">
                      Market Growth Solution
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="customerSupport"
                      checked={features.customerSupport}
                      onCheckedChange={(checked) =>
                        setFeatures({
                          ...features,
                          customerSupport: checked as boolean,
                        })
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor="customerSupport" className="text-sm">
                      Great Customer Support
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="timeSeriesModels"
                      checked={features.timeSeriesModels}
                      onCheckedChange={(checked) =>
                        setFeatures({
                          ...features,
                          timeSeriesModels: checked as boolean,
                        })
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor="timeSeriesModels" className="text-sm">
                      Time Series Models
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consultantService"
                      checked={features.consultantService}
                      onCheckedChange={(checked) =>
                        setFeatures({
                          ...features,
                          consultantService: checked as boolean,
                        })
                      }
                      disabled={isLoading}
                    />
                    <label htmlFor="consultantService" className="text-sm">
                      24/7 consultant Service
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
