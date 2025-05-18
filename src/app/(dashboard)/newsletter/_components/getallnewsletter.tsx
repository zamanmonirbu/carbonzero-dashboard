"use client";

import { Pagination } from "@/components/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const GetallNewsletter = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const localToken = localStorage.getItem("authToken");
    setToken(storedToken || localToken);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["newsletter"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletter`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch newsletter data.");
      return res.json();
    },
  });

  const newsletters = data?.data || [];
  const totalItems = newsletters.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = newsletters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isError) {
    return (
      <h1 className="text-center text-red-500 mt-6">
        There was an error fetching the newsletters.
      </h1>
    );
  }

  return (
    <div className="mx-auto p-4">
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: itemsPerPage }).map((_, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
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
                  <TableHead className="text-left px-4 py-4">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((newsletter: any) => (
                  <TableRow
                    key={newsletter._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="text-left px-4 py-4">
                      {newsletter.email}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GetallNewsletter;
