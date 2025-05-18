"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pencil, Trash, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeleteModal } from "@/components/modals/delete-modal";
import { Pagination } from "@/components/pagination";
import { useToast } from "@/components/ui/use-toast";
import {
  apiService,
  type Subscription,
  type Payment,
} from "@/services/api-service";
import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import Image from "next/image";
import pay from "../Public/assets/pay.png";

export default function PaymentButtonPage() {
  const [activeTab, setActiveTab] = useState("subscription");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
//   const [paymentFilters, setPaymentFilters] = useState({
//     fromDate: "",
//     toDate: "",
//     method: "All Methods",
//     status: "All",
//   });
  const { toast } = useToast();

  const itemsPerPage = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (activeTab === "subscription") {
          const { data, total } = await apiService.getSubscriptions(
            currentPage,
            itemsPerPage,
            searchTerm
          );
          if (isMounted) {
            setSubscriptions(data);
            setTotalSubscriptions(total);
          }
        } else {
          const { data, total } = await apiService.getPayments(
            currentPage,
            itemsPerPage,
            {
            //   ...paymentFilters,
              search: searchTerm,
            }
          );
          if (isMounted) {
            setPayments(data);
            setTotalPayments(total);
          }
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} data:`, error);
        if (isMounted) {
          toast({
            title: "Error",
            description: `Failed to load ${activeTab} data. Please try again.`,
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
  }, [activeTab, currentPage, searchTerm, toast, itemsPerPage]);

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      let success = false;

      if (activeTab === "subscription") {
        success = await apiService.deleteSubscription(selectedItem);
      } else {
        // Implement payment deletion if needed
        success = true;
      }

      if (success) {
        toast({
          title: `${
            activeTab === "subscription" ? "Subscription" : "Payment"
          } deleted`,
          description: `The ${activeTab} has been deleted successfully.`,
        });

        // Refresh data
        if (activeTab === "subscription") {
          const { data, total } = await apiService.getSubscriptions(
            currentPage,
            itemsPerPage,
            searchTerm
          );
          setSubscriptions(data);
          setTotalSubscriptions(total);
        } else {
          const { data, total } = await apiService.getPayments(
            currentPage,
            itemsPerPage,
            {
            //   ...paymentFilters,
              search: searchTerm,
            }
          );
          setPayments(data);
          setTotalPayments(total);
        }
      } else {
        throw new Error(`Failed to delete ${activeTab}`);
      }
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${activeTab}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSearchTerm("");
  };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setCurrentPage(1);
  // };

//   const handleFilterChange = (key: string, value: string) => {
//     setPaymentFilters((prev) => ({ ...prev, [key]: value }));
//     setCurrentPage(1);
//   };

  return (
    <div className="space-y-6">
      <div className="bg-white">
        <div className="p-6">
          <Tabs defaultValue="subscription" onValueChange={handleTabChange}>
            <TabsContent value="subscription" className="mt-0">
              {/* <div className="mb-4">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search subscriptions..."
                    className="pl-8 w-full md:w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div> */}

              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md ">
                  <div className="bg-white rounded-md shadow-sm p-4">
                    <div className="flex justify-between">
                      <div className="flex gap-[30px]">
                        <div>
                          <label
                            htmlFor="from"
                            className="block text-sm text-start font-medium text-gray-700"
                          >
                            From
                          </label>
                          <input
                            type="text"
                            id="from"
                            className="mt-1 border text-[14px] font-medium border-[#09B850] text-xs w-[180px] h-[40px] block rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="from"
                            className="block text-sm text-start font-medium text-gray-700"
                          >
                            To
                          </label>
                          <input
                            type="text"
                            id="from"
                            className="mt-1 border text-[14px] font-medium border-[#09B850] text-xs w-[180px] h-[40px] block rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="paymentMethod"
                            className="block text-[14px] text-start font-medium"
                          >
                            Payment Method
                          </label>
                          <div className="relative">
                            <select
                              id="paymentMethod"
                              className="mt-1 text-xs w-[180px] h-[40px] block rounded-md border border-[#09B850] bg-white py-2 px-3 shadow-sm focus:border-[#09B850] focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              <option>All Methods</option>
                              <option>Visa</option>
                              <option>Mastercard</option>
                              <option>PayPal</option>
                            </select>
                            {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div> */}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="paymentMethod"
                            className="block text-[14px] text-start font-medium"
                          >
                            Status
                          </label>
                          <div className="relative text-xs">
                            <select
                              id="paymentMethod"
                              className="mt-1 block text-xs w-[180px] h-[40px] rounded-md border border-[#09B850] bg-white py-2 px-3 shadow-sm focus:border-[#09B850] focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              <option>All Methods</option>
                              <option>Visa</option>
                              <option>Mastercard</option>
                              <option>PayPal</option>
                            </select>
                            {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div> */}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="search"
                          className="block text-sm text-start font-medium text-gray-700"
                        >
                          Search
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search
                              className="h-4 w-4 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="text"
                            name="search"
                            id="search"
                            className="mt-1 pl-10 border text-[14px] font-medium border-[#09B850] text-xs w-[374px] px-3 h-[40px] block rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Search by ID or name"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="h-[1px] bg-[#09B850] border-0 my-5" />

                    <div className="flex justify-end relative">
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 w-[128px] h-[37px] bg-[#09B850] text-[14px] text-white font-medium rounded-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-centertext-sm font-medium text-gray-500 ">
                          Payment ID
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                          Customer Id
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                          Customer Email
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                          Payment Method
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                          Date
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.map((subscription) => (
                        <tr key={subscription.id} className="border">
                          <td className="px-4 py-3 text-sm text-center">
                            {subscription.packageId}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {subscription.type}
                          </td>
                          <td className="px-4 py-3 text-sm whitespace-pre-line text-start">
                            <p className="flex justify-center">
                              {subscription.feature}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {subscription.amount}
                          </td>

                          <td className="px-4 py-3 text-sm text-center">
                            <div className="flex justify-center items-center gap-3">
                              <Image
                                src={pay}
                                alt="payment"
                                width={22}
                                height={17}
                                className="w-[22px] h-[17px]"
                              />
                              <p>{subscription.date}</p>
                            </div>
                          </td>

                          <td className="px-4 py-3 text-sm text-center">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              {subscription.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-2 justify-center">
                              <Link
                                href={`/subscription-payment/edit-subscription-payment`}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setSelectedItem(subscription.id);
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
                      totalItems={totalSubscriptions}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
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
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Customer Id
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Customer Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Payment Method
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="table-row-alternate">
                          <td className="px-4 py-3 text-sm">
                            {payment.paymentId}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {payment.amount}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {payment.customerId}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {payment.customerEmail}
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
                          <td className="px-4 py-3 text-sm">{payment.date}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                payment.status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {payment.status}
                            </span>
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
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={`Delete ${
          activeTab === "subscription" ? "Subscription" : "Payment"
        }`}
        description={`Are you sure you want to delete this ${activeTab}? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
