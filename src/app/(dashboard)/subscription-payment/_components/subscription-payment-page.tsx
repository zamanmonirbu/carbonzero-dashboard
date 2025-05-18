/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";


export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const localToken = localStorage.getItem("authToken");
    setToken(storedToken || localToken);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/get-subscriptions?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });


  if (isError)
    return (
      <h1 className="text-center text-red-500">
        Theres an error fetching users.
      </h1>
    );



  const filteredUsers =
    data?.data.filter(
      (subs: any) =>
        [subs.subscriptionType, subs.createdAt, subs.status]
          .join(" ")
          .toLowerCase()
      // .includes(searchTerm.toLowerCase())
    ) ?? [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubs = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };



  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-md rounded-xl p-4">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Subscription
        </h2>

        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">DaymentDate</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-center py-4">
                      subscriptionType
                    </TableHead>
                    <TableHead className="text-center py-4">PaymentDate</TableHead>
                    <TableHead className="text-center py-4">Date</TableHead>
                    <TableHead className="text-center py-4">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSubs.map((subscription: any) => (
                    <TableRow key={subscription._id}>
                      <TableCell className="text-center py-4">
                        {subscription.subscriptionType}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {new Date(subscription.paymentDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {new Date(subscription.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {subscription.amount || "N/A"}$
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUsers.length}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
