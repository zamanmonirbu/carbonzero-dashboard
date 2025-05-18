"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

export const CarbonEmissionsChart = () => {
  interface ChartData {
    name: string
    value: number
    color: string
  }

  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // Use the exact data that matches the image
        const data = [
          { name: "Transport", value: 50, color: "#1AB394" },
          { name: "Manufacturing", value: 10, color: "#4285F4" },
          { name: "Electricity", value: 5, color: "#5E35B1" },
          { name: "Waste Management", value: 15, color: "#F4B400" },
          { name: "Others", value: 20, color: "#FFD600" },
        ]

        if (isMounted) {
          setChartData(data)
        }
      } catch (err) {
        console.error("Error fetching carbon emissions data:", err)
        if (isMounted) {
          setError("Failed to load chart data")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  const renderCustomizedLegend = () => {
    return (
      <div className="flex flex-col space-y-6 mt-4 w-[303px]">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-4" style={{ backgroundColor: entry.color }} />
              <span className="text-[14px]">{entry.name}</span>
            </div>
            <span className="text-[14px] font-medium">{entry.value.toString().padStart(2, "0")}%</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* <h2 className="text-3xl font-bold">Carbon Emissions by Category</h2> */}
      <div className="h-[400px] w-full">
        <div className="grid grid-cols-2 h-full">
          <div className="flex items-center justify-center w-[317px]">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={1}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center">{renderCustomizedLegend()}</div>
        </div>
      </div>
    </div>
  )
}

