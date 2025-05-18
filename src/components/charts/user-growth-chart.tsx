"use client";

import { useState, useEffect } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export const UserGrowthChart = () => {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab,] = useState("12months");
  const [activePoint, setActivePoint] = useState<{
    month: string;
    value: number;
  } | null>(null);

  // Get token from localStorage or sessionStorage
  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const lstoredToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(lstoredToken);
    }
  }, []);

  interface ApiChardData {
    name: string; // Month or day
    value: number; // User count
  }
  // Fetch chart data with token
  const {
    data: chartData,
    isLoading,
    isError,
    error,
  } = useQuery<ApiChardData[]>({
    queryKey: ["RevenueGrowthChart", token],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/user-growth`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user growth data");
      }

      const json = await res.json();
      // Transform the data to match the expected format
      return json.data; // Expecting array of { name: string, value: number }
    },
  });


  const getFullMonthName = (shortName: string) => {
    const monthMap: Record<string, string> = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December",
    };
    return monthMap[shortName] || shortName;
  };

  const handleMouseOver = (data: {
    activePayload?: { payload: { name: string; value: number } }[];
  }) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const item = data.activePayload[0].payload;
      let displayMonth = item.name;

      if (activeTab === "12months" || activeTab === "6months") {
        displayMonth = getFullMonthName(item.name) + " 2024";
      } else if (activeTab === "30days") {
        displayMonth = `Day ${item.name}`;
      } else if (activeTab === "7days") {
        displayMonth = item.name;
      }

      setActivePoint({ month: displayMonth, value: item.value });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-[350px] py-6 w-full flex items-center justify-center">
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="h-[350px] py-6 w-full flex items-center justify-center">
        <p className="text-red-500">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-6">
      <div className="flex gap-[33px] items-center">
        <h2 className="text-2xl font-bold">User Growth</h2>
      </div>

      <div className="h-[350px] w-full relative">
        {activePoint && (
          <div className="absolute top-20 left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="rounded border border-gray-200 px-6 py-3 shadow-sm bg-white">
              {/* <p className="text-sm font-medium">{activePoint.month}</p> */}
              <p className="text-xl font-bold">
                {activePoint.value.toLocaleString()} persons
              </p>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            data={chartData || []}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            onMouseMove={handleMouseOver}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e8f4fc" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#e8f4fc" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 16, fontWeight: 500 }}
              dy={10}
              tickFormatter={(value: string) =>
                value.charAt(0).toUpperCase() + value.slice(1, 3).toLowerCase()
              }
            />
            <YAxis axisLine={false} tickLine={false} tick={false} />
            <CartesianGrid vertical={false} horizontal={false} />
            <Tooltip content={() => null} />

            <Area
              type="monotone"
              dataKey="secondaryValue"
              stroke="#a7f3c1"
              strokeWidth={2}
              fillOpacity={0}
              dot={false}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#033618"
              strokeWidth={2.5}
              dot={false}
              activeDot={(props: { cx?: number; cy?: number }) => {
                const { cx, cy } = props;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#09B850"
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
