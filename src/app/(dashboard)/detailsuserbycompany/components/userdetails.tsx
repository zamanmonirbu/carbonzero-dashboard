"use client";
import { MapPin, Factory, Mail, Phone, Globe } from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// import { CustomProgress } from "./custom-progress";
import React, { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Loading from "@/app/loading";

interface UserDetailsParams {
  params: string; // Replace 'string' with the appropriate type if needed
}

export default function Userdetails({ params }: UserDetailsParams) {
  // State for active slice
  const [activeEnergyIndex, setActiveEnergyIndex] = React.useState<
    number | undefined
  >(undefined);
  const [activeFuelIndex, setActiveFuelIndex] = React.useState<
    number | undefined
  >(undefined);
  const [businessSector, setBusinessSector] = React.useState<
    number | undefined
  >(undefined);
  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const lstoredToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    } else setToken(lstoredToken);
  }, []);

  console.log(params);

  const { data, isLoading } = useQuery({
    queryKey: ["companydetails", params],
    // enabled: token !== null, // Only run query when token is available
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emissions/by-user/${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch companies");
      }
      // setCompanies(res.json())
      return res.json();
    },
  });

  const { data: co2 } = useQuery({
    queryKey: ["co2details"],
    // enabled: token !== null, // Only run query when token is available
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emissions/by-month/${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch companies");
      }
      // setCompanies(res.json())
      return res.json();
    },
  });

  // interface Co2DataItem {
  //   year: number;
  //   totalCarbonEmissions: number;
  // }

   const transformedCo2Data = co2?.data?.map((item: any) => ({
    month:item.month,
    emissions: item.totalCO2_tonnes,
  }));

  // Function to render the active shape with enhanced appearance

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // Sample CO2 emissions data - replace with your dynamic data source

  // Function to render the active shape with enhanced appearance

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          className="-translate-y-[47%] font-bold"
        >
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {!data?.data ? (
        <div>
          <h1 className="mb-4 p-4 text-2xl font-semibold">No Data Found</h1>
          <p className="text-center">Please enter your emission form details</p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-6">
          {/* Company Header */}
          {isLoading ? (
            <Card className="bg-[#033618] text-white">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-3/4 md:w-1/2" />

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-2/5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#033618] text-white">
              <CardContent className="flex  justify-between gap-4 p-6">
                {/* <Avatar className="h-24 w-24 border-4 border-white">
                  <AvatarImage
                    src="/placeholder.svg?height=96&width=96"
                    alt="Company Logo"
                  />
                  <AvatarFallback className="text-black">CN</AvatarFallback>
                </Avatar> */}

                <div className="space-y-4">
                  <h1 className="mb-4 text-2xl font-bold md:text-3xl">
                    {data?.data?.basic_information?.full_name || "Company Name"}
                  </h1>
                  {data?.data?.basic_information.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>
                        {data?.data?.basic_information.email &&
                          data?.data?.basic_information.email}
                      </span>
                    </div>
                  )}

                  {data?.data?.basic_information.phone_number && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>
                        {" "}
                        {data?.data?.basic_information.phone_number &&
                          data?.data?.basic_information.phone_number}
                      </span>
                    </div>
                  )}

                  {data?.data?.basic_information.company_operating_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <Factory className="h-4 w-4" />
                      <span>
                        {data?.data?.basic_information.company_operating_name &&
                          data?.data?.basic_information.company_operating_name}
                      </span>
                    </div>
                  )}

                  {data?.data?.basic_information.headquarter_location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {" "}
                        {data?.data?.basic_information.headquarter_location &&
                          data?.data?.basic_information.headquarter_location}
                      </span>
                    </div>
                  )}

                  {data?.data?.basic_information.website && (
                    <div className="flex items-center gap-2 text-sm ">
                      <Globe className="h-4 w-4" />
                      <Link
                        href={`${data?.data?.basic_information.website}`}
                        target="_blank"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {" "}
                        {data?.data?.basic_information.website &&
                          data?.data?.basic_information.website}
                      </Link>
                    </div>
                  )}
                </div>
                <Link href={`/editForm/${params}`} className="">
                  Edit Emission
                </Link>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
            {/* Carbon Emission2 Percentage */}
            <Card className="h-full w-full">
              <CardHeader>
                <CardTitle className="text-center">
                  CO2 Emissions Over the Years
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ChartContainer
                    className="h-full w-full"
                    config={{
                      emissions: {
                        label: "CO2 Emissions",
                        color: "#A855F7", // Blue color similar to the image
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={transformedCo2Data}
                        margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          label={{
                            value: "month",
                            position: "insideBottom",
                            offset: -10,
                          }}
                          tickCount={7}
                          domain={["dataMin", "dataMax"]}
                        />
                        <YAxis
                          label={{
                            value: "CO2 Emissions (in metric tons)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                          domain={[2.5, 6]}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="emissions"
                          stroke="var(--color-emissions)"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "var(--color-emissions)" }}
                          activeDot={{ r: 6 }}
                          name="CO2 Emissions"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Energy Sources Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-emerald-500">
                  Energy Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between">
                <Chart className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.data?.carbon_footprint?.energy_sources?.map(
                          (entry: {
                            source: string;
                            usage_percentage: number;
                            color: string;
                          }) => ({
                            name: entry.source,
                            value: entry.usage_percentage,
                            color: entry.color,
                          })
                        )}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={80}
                        paddingAngle={1}
                        dataKey="value"
                        activeIndex={activeEnergyIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_: unknown, index: number) =>
                          setActiveEnergyIndex(index)
                        }
                        label={(entry: { name: string; value: number }) =>
                          `${entry.name} ${entry.value}%`
                        }
                        labelLine={false}
                      >
                        {data?.data.carbon_footprint?.energy_sources?.map(
                          (entry: { color: string }, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend className="mt-4 grid grid-cols-1 gap-1">
                  {data?.data?.carbon_footprint?.energy_sources?.map(
                    (
                      entry: { color: string; source: string },
                      index: number
                    ) => (
                      <ChartLegendItem
                        key={index}
                        color={entry.color}
                        label={entry.source}
                      />
                    )
                  )}
                </ChartLegend>
              </CardContent>
            </Card>

            {/* Type of Fuel Used in Vehicles */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-emerald-500">
                  Type of Fuel Used in Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Chart className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.data?.carbon_footprint?.type_of_fuel_used_in_vehicles?.map(
                          (entry: {
                            fuel_type: string;
                            usage_percentage: number;
                            color: string;
                          }) => ({
                            name: entry.fuel_type,
                            value: entry.usage_percentage,
                            color: entry.color,
                          })
                        )}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={80}
                        paddingAngle={1}
                        dataKey="value"
                        activeIndex={activeFuelIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_: unknown, index: number) =>
                          setActiveFuelIndex(index)
                        }
                        label={(entry: { name: string; value: number }) =>
                          `${entry.name} ${entry.value}%`
                        }
                        labelLine={false}
                      >
                        {data?.data?.carbon_footprint?.type_of_fuel_used_in_vehicles?.map(
                          (entry: { color: string }, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend className="mt-4 grid grid-cols-2 gap-2">
                  {data?.data?.carbon_footprint?.type_of_fuel_used_in_vehicles?.map(
                    (
                      entry: { fuel_type: string; color: string },
                      index: number
                    ) => (
                      <ChartLegendItem
                        key={index}
                        color={entry.color}
                        label={entry.fuel_type}
                      />
                    )
                  )}
                </ChartLegend>
              </CardContent>
            </Card>

            {/* Carbon Emission Percentage */}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-emerald-500">
                  Carbon emission Business Sector
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between">
                <Chart className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.data?.basic_information?.business_sector?.map(
                          (entry: {
                            sector: string;
                            carbon_emission_percentage: number;
                            color: string;
                          }) => ({
                            name: entry.sector,
                            value: entry.carbon_emission_percentage,
                            color: entry.color,
                          })
                        )}
                        cx="45%"
                        cy="55%"
                        innerRadius={0}
                        outerRadius={80}
                        paddingAngle={1}
                        dataKey="value"
                        activeIndex={businessSector}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_: unknown, index: number) =>
                          setBusinessSector(index)
                        }
                        label={(entry: { name: string; value: number }) =>
                          `${entry.name} ${entry.value}%`
                        }
                        labelLine={false}
                      >
                        {data?.data?.basic_information?.business_sector?.map(
                          (entry: { color: string }, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend className="mt-4 grid grid-cols-1 gap-1">
                  {data?.data?.basic_information?.business_sector?.map(
                    (
                      entry: { color: string; sector: string },
                      index: number
                    ) => (
                      <ChartLegendItem
                        key={index}
                        color={entry.color}
                        label={entry.sector}
                      />
                    )
                  )}
                </ChartLegend>
              </CardContent>
            </Card>

            {/* Primary Transportation Method */}
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 text-center shadow-[0px_0px_6px_0px_#00000040]">
              <h1 className="text-[20px] font-medium">
                Primary Transportation Method
              </h1>
              <p>
                Volume of goods transportation tons:{" "}
                {
                  data?.data.supply_chain_logistics
                    ?.volume_of_goods_transportation_tons
                }
              </p>
            </div>
          </div>

          {/* Percentage of Energy Renewable */}
          {/* <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium text-emerald-500">
                  Percentage of Energy Renewable
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-10">
                <CustomProgress value={90} color="#10b981" label="90%" />
                <CustomProgress value={70} color="#3b82f6" label="70%" />
                <CustomProgress value={80} color="#818cf8" label="80%" />
                <CustomProgress value={50} color="#a855f7" label="50%" />
                <CustomProgress value={65} color="#ec4899" label="65%" />
                <CustomProgress value={60} color="#22c55e" label="60%" />
                <CustomProgress value={70} color="#f97316" label="70%" />
                <CustomProgress value={40} color="#064e3b" label="40%" />
              </CardContent>
            </Card> */}
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Business Sector */}
            {/* <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Business Sector
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data?.data?.basic_information.business_sector.length !== 0 && data?.data?.basic_information.business_sector.map(
                    (source: {
                      _id: string;
                      sector: string;
                      carbon_emission_percentage: number;
                    }) => (
                      <div key={source._id} className="space-y-1">
                        <p>{source.sector}s</p>
                      </div>
                    ),
                  )}
                </CardContent>
              </Card> */}

            {/* Energy Sources */}
            {/* {data?.data?.carbon_footprint?.energy_sources.length !== 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Energy Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {data?.data?.carbon_footprint?.energy_sources?.map(
                    (source: EnergySource, i: number) => {
                      return (
                        <div key={i} className="space-y-1">
                          <p>{source.source}</p>
                        </div>
                      );
                    },
                  )}
                </CardContent>
              </Card>
            )} */}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Total CO2_kg
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data?.data?.calculated_emissions?.totalCO2_kg}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Total CO2_tonnes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data?.data?.calculated_emissions?.totalCO2_tonnes}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Electricity CO2_kg
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {
                    data?.data?.calculated_emissions?.breakdown
                      ?.electricityCO2_kg
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Goods CO2_kg
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data?.data?.calculated_emissions?.breakdown?.goodsCO2_kg}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Travel CO2_kg
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data?.data?.calculated_emissions?.breakdown?.travelCO2_kg}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Vehicle CO2_kg
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data?.data?.calculated_emissions?.breakdown?.vehicleCO2_kg}
                </p>
              </CardContent>
            </Card>

            {/* Average Business Flight Distance */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Average Business Flight Distance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {
                    data?.data?.carbon_footprint?.annual_business_flight_distance
                      ?.distance
                  }
                </p>
              </CardContent>
            </Card>

            {/* Number of Company owned vehicles */}
            {data?.data?.carbon_footprint?.number_of_company_owned_vehicles && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Number of Company owned vehicles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {" "}
                    {
                      data?.data?.carbon_footprint
                        ?.number_of_company_owned_vehicles
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Total Electrical Consumption */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Total Electrical Consumption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {" "}
                  {
                    data?.data?.carbon_footprint
                      ?.total_electrical_consumption_kwh
                  }
                </p>
              </CardContent>
            </Card>

            {/* Number of Employees */}
            {data?.data?.basic_information?.number_of_employees && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Number of Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {" "}
                    {data?.data?.basic_information?.number_of_employees}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Volume of Goods Transportation Method
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Volume of Goods Transportation Method (Tons)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">10</p>
              </CardContent>
            </Card> */}

            {/* Average Distance Travelled per Vehicle Annually */}
            {data?.data?.carbon_footprint
              ?.average_distance_travelled_per_vehicle_annually && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Average Distance Travelled per Vehicle Annually
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {" "}
                    {
                      data?.data?.carbon_footprint
                        ?.average_distance_travelled_per_vehicle_annually
                        .distance
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Total Annual Turnover in the last Financial Year */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Total Annual Turnover in the last Financial Year
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data?.data?.finances?.total_annual_turnover}
                </p>
              </CardContent>
            </Card>

            {/* Annual Business Train Distance */}
            {data?.data?.carbon_footprint?.annual_business_train_distance && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Annual Business Train Distance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {" "}
                    {
                      data?.data?.carbon_footprint
                        ?.annual_business_train_distance.distance
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Supply Chain & Logistics */}
            {data?.data?.supply_chain_logistics && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Supply Chain & Logistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {" "}
                    {
                      data?.data?.supply_chain_logistics
                        .volume_of_goods_transportation_tons
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Type of Organization */}
            {data?.data?.basic_information?.type_of_organization && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Type of Organization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      {" "}
                      {data?.data?.basic_information?.type_of_organization}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Total Value of Assets at End of The Last Financial Year */}
            {data?.data?.finances?.total_value_of_assets && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">
                    Total Value of Assets at End of The Last Financial Year
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {" "}
                    {data?.data?.finances?.total_value_of_assets}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );
}
