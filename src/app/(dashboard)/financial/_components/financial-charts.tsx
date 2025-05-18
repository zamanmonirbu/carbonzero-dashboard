"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";

// import { DollarSign, TrendingDown, TrendingUp, BarChart3 } from "lucide-react";
import logo1 from "@/Public/assets/d-4.png";
import logo2 from "@/Public/assets/v-1.png";
import logo3 from "@/Public/assets/v-2.png";
// import logo4 from "@/Public/assets/v-3.png";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ReveneuBarChart from "@/components/charts/ReveneuBarChart";

export default function FinancialCharts() {
  // const [viewOption, setViewOption] = useState("date");

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken =
      sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  const { data: dataDashboard, isLoading: loadingDahsboard } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch dashboard stats");

      return res.json();
    },
    enabled: !!token,
  });

  return (
    <div className="space-y-10">
      {/* <h2 className="text-xl font-semibold">Financial</h2> */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Dashboard Stats */}
        {[logo1, logo2, logo3].map((logo, i) => (
          <Card key={i} className="bg-primary *:text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {i === 0
                  ? "Total Revenue"
                  : i === 1
                  ? "Total Customer"
                  : "Total Subscription"}
              </CardTitle>
              <div className="h-9 w-9 bg-[#033618] text-white p-2 rounded-full">
                <Image
                  src={logo}
                  width={50}
                  height={50}
                  alt="logo img"
                  className="w-full h-full"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loadingDahsboard ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-medium ">
                  {i === 0
                    ? `$${dataDashboard?.data.totalRevenue.toLocaleString()}`
                    : i === 1
                    ? dataDashboard?.data.totalCustomers.toLocaleString()
                    : dataDashboard?.data.totalSubscriptions.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-[30px]"> */}
      {/* <Card className="bg-green-500 text-white">
          <CardContent className="p-4 relative">
            <div className="flex justify-between items-center w-[354px] h-[120px]">
              <div>
                <p className="text-base font-medium text-[#FFFFFF] my-4">
                  Total Revenue
                </p>
                <p className="text-2xl font-medium">{dataDashboard?.data?.}</p>
              </div>
              <div className="p-2 rounded-full absolute top-[10%] right-[5%] bg-[#033618]">
                <Image
                  src={logo1}
                  width={50}
                  height={50}
                  alt="logo"
                  className="w-5 h-5"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}

      {/* <Card className="bg-green-500 text-white">
          <CardContent className="p-4 relative">
            <div className="flex justify-between items-center w-[354px] h-[120px]">
              <div>
                <p className="text-base font-medium text-[#FFFFFF] my-4">
                  Total Expenses
                </p>
                <p className="text-2xl font-medium">$200.00</p>
              </div>
              <div className="p-2 rounded-full absolute top-[10%] right-[5%] bg-[#033618]">
             
                <Image
                  src={logo2}
                  width={50}
                  height={50}
                  alt="logo"
                  className="w-5 h-5"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}
      {/* 
        <Card className="bg-green-500 text-white">
          <CardContent className="p-4 relative">
            <div className="flex justify-between items-center w-[354px] h-[120px]">
              <div>
                <p className="text-base font-medium text-[#FFFFFF] my-4">
                  Total Profit
                </p>
                <p className="text-2xl font-medium">$50.00</p>
              </div>
              <div className="p-2 rounded-full absolute top-[10%] right-[5%] bg-[#033618]">
                
                <Image
                  src={logo4}
                  width={50}
                  height={50}
                  alt="logo"
                  className="w-5 h-5"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}

      {/* <Card className="bg-green-500 text-white">
          <CardContent className="p-4 relative">
            <div className="flex justify-between items-center w-[354px] h-[120px]">
              <div>
                <p className="text-base font-medium text-[#FFFFFF] my-4">
                  Growth Percentage
                </p>
                <p className="text-2xl font-medium">40.76%</p>
              </div>
              <div className="p-2 rounded-full absolute top-[10%] right-[5%] bg-[#033618]">
              
                <Image
                  src={logo3}
                  width={50}
                  height={50}
                  alt="logo"
                  className="w-5 h-5"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}
      {/* </div> */}

      {/* <div className="flex gap-[80px]">
        <Select defaultValue={viewOption} onValueChange={setViewOption}>
          <SelectTrigger className="w-[160px] h-[44px] rounded-none border-[#595959]">
            <SelectValue
              className="text-base font-medium"
              placeholder="View Data"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">View Data</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="date">
          <SelectTrigger className="w-[160px] h-[44px] rounded-none border-[#595959]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="month">
          <SelectTrigger className="w-[160px] h-[44px] rounded-none border-[#595959]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="january">January</SelectItem>
            <SelectItem value="february">February</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="year">
          <SelectTrigger className="w-[160px] h-[44px] rounded-none border-[#595959]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto w-[160px] h-[42px]">
          <Button className="bg-[#09B850] hover:bg-green-600 w-full text-base text-white">
            Filter
          </Button>
        </div>
      </div> */}

      {/* reveneu chart  */}

      <ReveneuBarChart />

      {/* <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-green-500 mb-4">
            Growth Percentage
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={growthData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar
                yAxisId="left"
                dataKey="positive"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="negative"
                fill="#064E3B"
                radius={[0, 0, 4, 4]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="growth"
                stroke="#064E3B"
                strokeWidth={2}
                dot={{ r: 4, fill: "#064E3B", stroke: "white", strokeWidth: 2 }}
              />
              {growthData.map((entry, index) => (
                <text
                  key={`text-${index}`}
                  // x={
                  //   index * (100 / growthData.length) +
                  //   50 / growthData.length +
                  //   "%"
                  // }
                  y={entry.growth < 20 ? "40%" : "45%"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  fontSize={12}
                >
                  {entry.growth}%
                </text>
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}
    </div>
  );
}
