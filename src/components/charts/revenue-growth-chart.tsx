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

export const RevenueGrowthChart = () => {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab] = useState("12months");
  const [activePoint, setActivePoint] = useState<{
    month: string;
    value: number;
  } | null>(null);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [years, setYears] = useState<number[]>([currentYear]);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const lstoredToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(lstoredToken);
    }
  }, []);

  useEffect(() => {
    // Generate years from 2000 to the current year
    const startYear = 2000;
    const generatedYears = Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i
    ).sort((a, b) => b - a);

    setYears(generatedYears);
  }, [currentYear]);

  interface ApiChartData {
    name: string;
    value: number;
  }

  const {
    data: revenueData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiChartData[]>({
    queryKey: ["customerData", selectedYear],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/revenue-growth?year=${selectedYear}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch revenue growth data");
      }

      const json = await res.json();
      return json.data;
    },
  });

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [selectedYear, token, refetch]);

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
        displayMonth = getFullMonthName(item.name) + ` ${selectedYear}`;
      } else if (activeTab === "30days") {
        displayMonth = `Day ${item.name}`;
      } else if (activeTab === "7days") {
        displayMonth = item.name;
      }

      setActivePoint({ month: displayMonth, value: item.value });
    }
  };

  if (isLoading) {
    return (
      <div className="h-[350px] py-6 w-full flex items-center justify-center">
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[350px] py-6 w-full flex items-center justify-center">
        <p className="text-red-500">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-6">
      <div className="flex gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold">Revenue Growth</h2>
        <select
          className="border px-3 py-1 rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {!isLoading && revenueData?.length === 0 ? (
        <div className="h-[350px] py-6 w-full flex items-center justify-center">
          <p className="text-gray-500 text-lg font-medium">
            No data found for {selectedYear}.
          </p>
        </div>
      ) : (
        <div className="h-[350px] w-full relative">
          {activePoint && (
            <div className="absolute top-20 left-1/3 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="rounded border border-gray-200 px-6 py-3 shadow-sm bg-white">
                {/* <p className="text-sm font-medium">{activePoint.month}</p> */}
                <p className="text-2xl font-bold">
                  ${activePoint.value.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart
              data={revenueData || []}
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
                  value.charAt(0).toUpperCase() +
                  value.slice(1, 3).toLowerCase()
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
      )}
    </div>
  );
};
