/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserGrowthChart } from "@/components/charts/user-growth-chart";
// import { CarbonEmissionsChart } from "@/components/charts/carbon-emissions-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import logo1 from "../../../../Public/assets/d-4.png";
import logo2 from "../../../../Public/assets/d-3.png";
import logo3 from "../../../../Public/assets/d-2.png";
import UserManagement from "../../users/_components/user-management";
import { RevenueGrowthChart } from "@/components/charts/revenue-growth-chart";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const storedToken =
      sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  const {
    data: dataDashboard,
    isLoading: loadingDashboard,
    isError,
  } = useQuery({
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


  if (isError) return <h1>{"There's an error loading data"}</h1>;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className={`grid gap-4 ${user?.role === "SuperAdmin" ?  'md:grid-cols-2 lg:grid-cols-3' : ' md:grid-cols-2 lg:grid-cols-2'}`}>
        {/* Card 1 - Total Revenue */}
        {user?.role === "SuperAdmin" && (
          <Card className="bg-primary *:text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <div className="h-9 w-9 bg-[#033618] text-white p-2 rounded-full">
                <Image
                  src={logo1}
                  width={50}
                  height={50}
                  alt="logo img"
                  className="w-full h-full"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loadingDashboard ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-medium">
                  ${dataDashboard?.data.totalRevenue.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Card 2 - Total Customer */}
        <Card className="bg-primary *:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customer
            </CardTitle>
            <div className="h-9 w-9 bg-[#033618] text-white p-2 rounded-full">
              <Image
                src={logo2}
                width={50}
                height={50}
                alt="logo img"
                className="w-full h-full"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loadingDashboard ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-medium">
                {dataDashboard?.data.totalCustomers.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3 - Total Subscription */}
        <Card className="bg-primary *:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscription
            </CardTitle>
            <div className="h-9 w-9 bg-[#033618] text-white p-2 rounded-full">
              <Image
                src={logo3}
                width={50}
                height={50}
                alt="logo img"
                className="w-full h-full"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loadingDashboard ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-medium">
                {dataDashboard?.data.totalSubscriptions.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent>
            <UserGrowthChart />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <RevenueGrowthChart />
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <UserManagement />
    </div>
  );
}
