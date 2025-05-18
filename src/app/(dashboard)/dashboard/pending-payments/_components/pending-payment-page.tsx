"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Pencil, Trash, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteModal } from "@/components/modals/delete-modal";
import { Pagination } from "@/components/pagination";
import { useToast } from "@/components/ui/use-toast";
import { apiService, type PendingPayment } from "@/services/api-service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export default function PendingPaymentsPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    method: "All Methods",
    amountRange: "All Amounts",
  });
  const { toast } = useToast();

  const itemsPerPage = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const { data, total } = await apiService.getPendingPayments(
          currentPage,
          itemsPerPage,
          {
            ...filters,
            search: searchTerm,
          }
        );

        if (isMounted) {
          setPendingPayments(data);
          setTotalPayments(total);
        }
      } catch (error) {
        console.error("Error fetching pending payments:", error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to load pending payments. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, [currentPage, searchTerm, filters, toast, itemsPerPage]);

  const handleDelete = async () => {
    if (!selectedPayment) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Payment deleted",
        description: "The payment has been deleted successfully.",
      });

      // Refresh data
      const { data, total } = await apiService.getPendingPayments(
        currentPage,
        itemsPerPage,
        {
          ...filters,
          search: searchTerm,
        }
      );

      setPendingPayments(data);
      setTotalPayments(total);
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteModalOpen(false);
      setSelectedPayment(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Pending Payments{" "}
          <span className="ml-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-white">
            {totalPayments} pending
          </span>
        </h1>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">From</label>
              <Input
                type="date"
                className="mt-1"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">To</label>
              <Input
                type="date"
                className="mt-1"
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <Select
                value={filters.method}
                onValueChange={(value) => handleFilterChange("method", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Methods">All Methods</SelectItem>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Amount Range</label>
              <Select
                value={filters.amountRange}
                onValueChange={(value) =>
                  handleFilterChange("amountRange", value)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Amounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Amounts">All Amounts</SelectItem>
                  <SelectItem value="$0 - $100">$0 - $100</SelectItem>
                  <SelectItem value="$100 - $500">$100 - $500</SelectItem>
                  <SelectItem value="$500+">$500+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by ID or name"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Payment ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Payment Method
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((payment) => (
                    <tr key={payment.id} className="table-row-alternate">
                      <td className="px-4 py-3 text-sm">{payment.paymentId}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                            <Image
                              src={payment.user.avatar || "/placeholder.svg"}
                              alt={payment.user.name}
                              fill
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{payment.user.name}</p>
                            <p className="text-xs text-gray-500">
                              {payment.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {payment.method === "Visa" ? (
                          <div className="flex items-center gap-1">
                            <div className="h-5 w-8 bg-black rounded"></div>
                            <span>Visa</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                              P
                            </div>
                            <span>PayPal</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{payment.amount}</td>
                      <td className="px-4 py-3 text-sm">{payment.date}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedPayment(payment.id);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 p-4">
                <Pagination
                  totalItems={totalPayments}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Payment"
        description="Are you sure you want to delete this payment? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
