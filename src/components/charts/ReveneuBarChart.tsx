"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  Text,
} from "recharts";

// API response type
type RevenueApiItem = {
  month: string;
  user: number;
  revenue: number;
};

type ChartDataItem = {
  name: string;
  value: number;
  value2: number;
  highlight?: boolean;
};

// Fetch function
const fetchRevenueData = async (): Promise<RevenueApiItem[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/payment-by-month`
  );
  if (!res.ok) throw new Error("Failed to fetch revenue data");
  const json = await res.json();
  return json.data;
};

const ReveneuBarChart: React.FC = () => {
  const { data, isLoading, isError } = useQuery<RevenueApiItem[]>({
    queryKey: ["revenue-data"],
    queryFn: fetchRevenueData,
  });

  const transformedData: ChartDataItem[] =
    data?.map((item) => ({
      name: item.month,
      value: item.revenue,
      value2: item.user,
      highlight: item.month === "Apr" || item.month === "Aug",
    })) || [];

  if (isLoading) return <div>Loading chart...</div>;
  if (isError) return <div>Error loading chart data.</div>;

  return (
    <div className="grid grid-cols-1 gap-[30px]">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-green-500 mb-4">Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={transformedData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="value2" fill="#064E3B" radius={[4, 4, 0, 0]} />

              {transformedData.map((entry, index) =>
                entry.highlight ? (
                  <ReferenceDot
                    key={`dot-${index}`}
                    x={entry.name}
                    y={entry.value}
                    r={8}
                    fill="#064E3B"
                    stroke="white"
                    strokeWidth={2}
                  />
                ) : null
              )}

              {transformedData.map((entry, index) =>
                entry.highlight ? (
                  <Text
                    key={`label-${index}`}
                    x={entry.name}
                    y={10}
                    textAnchor="middle"
                    fill="#000"
                    fontSize={12}
                  >
                    {entry.name === "Apr" ? "April cost" : "August cost"}
                  </Text>
                ) : null
              )}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReveneuBarChart;
