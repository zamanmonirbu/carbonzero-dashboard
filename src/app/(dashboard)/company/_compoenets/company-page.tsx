// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";

// // import type React from "react";

// // import { useEffect, useState } from "react";
// // import Link from "next/link";
// // import { Pencil } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { DeleteModal } from "@/components/modals/delete-modal";
// // import { Pagination } from "@/components/pagination";
// // // import { useToast } from "@/components/ui/use-toast";
// // // import { apiService, type Company } from "@/services/api-service";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { useQuery } from "@tanstack/react-query";

// // interface CompanyPageProps {
// //   showAll?: boolean;
// // }

// // export default function CompanyPage({ showAll = false }: CompanyPageProps) {
// //   // const [deleteModalOpen, setDeleteModalOpen] = useState(false);
// //   // const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
// //   // const [companies, setCompanies] = useState<Company[]>([]);
// //   // const [totalCompanies, setTotalCompanies] = useState(0);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [token, setToken] = useState<string | null>(null);
// //   // const QueryClient = useQueryClient();

// //   // const [isLoading, setIsLoading] = useState(true);
// //   // const [searchTerm, ] = useState("");
// //   // const { toast } = useToast();
// //   const itemsPerPage = 10;

// //   useEffect(() => {
// //     const storedToken = sessionStorage.getItem("authToken");
// //     const lstoredToken = localStorage.getItem("authToken");
// //     if (storedToken) {
// //       setToken(storedToken);
// //     } else setToken(lstoredToken);
// //   }, []);

// //   const { data, isLoading, isError } = useQuery({
// //     queryKey: ["company"],
// //     // enabled: token !== null, // Only run query when token is available
// //     queryFn: async () => {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profiles?page=1`,
// //         {
// //           method: "GET",
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );

// //       if (!res.ok) {
// //         throw new Error("Failed to fetch companies");
// //       }
// //       // setCompanies(res.json())
// //       return res.json();
// //     },
// //   });

// //   console.log(data?.data)

// //   // const deleteMutation = useMutation({
// //   //   mutationFn: async (companyId: string) => {

// //   //     const res = await fetch(
// //   //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/company/${companyId}`,
// //   //       {
// //   //         method: "DELETE",
// //   //         headers: {
// //   //           Authorization: `Bearer ${token}`,
// //   //           "Content-Type": "application/json",
// //   //         },
// //   //       }
// //   //     );

// //   //     if (!res.ok) {
// //   //       throw new Error("Failed to delete company");
// //   //     }

// //   //     return res.json();
// //   //   },
// //   //   onSuccess: () => {
// //   //     toast({
// //   //       title: "Company deleted",
// //   //       description: "The company has been deleted successfully.",
// //   //     });

// //   //     // Optional: refetch companies or manually update cache
// //   //     // queryClient.invalidateQueries({ queryKey: ["users"] });
// //   //     QueryClient.invalidateQueries({ queryKey: ["company"] });
// //   //     setDeleteModalOpen(false);
// //   //     setSelectedCompany(null);
// //   //   },
// //   //   onError: (error) => {
// //   //     console.error("Error deleting company:", error);
// //   //     toast({
// //   //       title: "Error",
// //   //       description: "Failed to delete company. Please try again.",
// //   //       variant: "destructive",
// //   //     });
// //   //   },
// //   // });

// //   const handlePageChange = (page: number) => {
// //     setCurrentPage(page);
// //   };

// //   // const handleSearch = (e: React.FormEvent) => {
// //   //   e.preventDefault();
// //   //   setCurrentPage(1);
// //   // };

// //   if (isError) {
// //     return <h1>{"There's an error"}</h1>;
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div className="bg-white rounded-lg border shadow-sm">
// //         <div className="p-6">
// //           <h2 className="text-2xl font-medium mb-6">Company</h2>

// //           {/* <form
// //             onSubmit={handleSearch}
// //             className="relative mb-6 w-full md:w-1/3"
// //           >
// //             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
// //             <Input
// //               type="search"
// //               placeholder="Search companies..."
// //               className="pl-8"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //           </form> */}

// //           {isLoading ? (
// //             <div className="space-y-4">
// //               <Skeleton className="h-10 w-full" />
// //               <Skeleton className="h-20 w-full" />
// //               <Skeleton className="h-10 w-full" />
// //             </div>
// //           ) : (
// //             <div className="overflow-x-auto rounded-t-md">
// //               <table className="w-full border">
// //                 <thead className="bg-[#F9FAFB]">
// //                   <tr className="border-b">
// //                     <th className="px-4 py-3 text-sm font-medium text-gray-500 text-center">
// //                       Identification Number
// //                     </th>
// //                     <th className="px-4 py-3 text-sm font-medium text-center text-gray-500">
// //                       Business License Number
// //                     </th>
// //                     <th className="px-4 py-3 text-sm font-medium text-center text-gray-500">
// //                       Business Entity
// //                     </th>
// //                     <th className="px-4 py-3 text-sm font-medium text-center text-gray-500">
// //                       Business Duration
// //                     </th>
// //                     <th className="px-4 py-3 text-sm font-medium text-center text-gray-500">
// //                       Industry Type
// //                     </th>
// //                     <th className="px-4 py-3 text-sm font-medium text-center text-gray-500">
// //                       Code
// //                     </th>
// //                     <th className="px-4 py-3 text-sm font-medium text-center text-gray-500">
// //                       Actions
// //                     </th>
// //                   </tr>
// //                 </thead>

// //                 {/* new code  */}

// //                 <tbody>
// //                   {(showAll
// //                     ? data?.data
// //                     : data?.data.slice(
// //                         (currentPage - 1) * itemsPerPage,
// //                         currentPage * itemsPerPage
// //                       )
// //                   )?.map((company: any) => (
// //                     <tr key={company?._id} className="border">
// //                       <td className="px-4 py-3 text-base text-center">
// //                         {company?.identificationNumber}
// //                       </td>
// //                       <td className="px-4 py-3 text-base text-center">
// //                         {company?.businessLicenseNumber}
// //                       </td>
// //                       <td className="px-4 py-3 text-base text-center">
// //                         {company?.businessEntity}
// //                       </td>
// //                       <td className="px-4 py-3 text-base text-center">
// //                         {company?.businessDuration}
// //                       </td>
// //                       <td className="px-4 py-3 text-base text-center">
// //                         <span className="text-green-500 text-center">
// //                           {company?.industryType}
// //                         </span>
// //                       </td>
// //                       <td className="px-4 py-3 text-base text-center">
// //                         <span className="text-green-500 text-center">
// //                           {company?.uniqueCode}
// //                         </span>
// //                       </td>
// //                       <td className="px-4 py-3 text-sm">
// //                         <div className="flex items-center justify-center gap-2">
// //                           <Link href={`/company/edit-company/${company._id}`}>
// //                             <Button
// //                               variant="ghost"
// //                               size="icon"
// //                               className="h-8 w-8"
// //                             >
// //                               <Pencil className="h-4 w-4" />
// //                             </Button>
// //                           </Link>
// //                           {/* <Button
// //             variant="ghost"
// //             size="icon"
// //             className="h-8 w-8"
// //             onClick={() => {
// //               setSelectedCompany(company._id);
// //               setDeleteModalOpen(true);
// //             }}
// //           >
// //             <Trash className="h-4 w-4" />
// //           </Button> */}
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //               <div className="mt-4 p-4">
// //                 <Pagination
// //                   totalItems={data?.data.length ?? 0}
// //                   itemsPerPage={itemsPerPage}
// //                   currentPage={currentPage}
// //                   onPageChange={handlePageChange}
// //                 />
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* <DeleteModal
// //         isOpen={deleteModalOpen}
// //         onClose={() => setDeleteModalOpen(false)}
// //         title="Delete Company"
// //         description="Are you sure you want to delete this company? This action cannot be undone."
// //         onConfirm={async () => {
// //           if (selectedCompany) {
// //             deleteMutation.mutate(selectedCompany);
// //           }
// //         }}
// //       /> */}
// //     </div>
// //   );
// // }



// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import type React from "react";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Pencil } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Pagination } from "@/components/pagination";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useQuery } from "@tanstack/react-query";

// interface CompanyPageProps {
//   showAll?: boolean;
// }

// export default function CompanyPage({ showAll = false }: CompanyPageProps) {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [token, setToken] = useState<string | null>(null);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     const sessionToken = sessionStorage.getItem("authToken");
//     const localToken = localStorage.getItem("authToken");
//     setToken(sessionToken || localToken);
//   }, []);

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["user", token],
//     enabled: !!token, // Only run query when token is available
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profiles?page=1`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Failed to fetch companies");
//       }

//       return res.json();
//     },
//   });

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   if (isError) {
//     return <h1 className="text-center text-red-500 mt-4">There was an error loading companies.</h1>;
//   }

//   const companies = data?.data || [];
//   console.log("companys",companies)

//   return (
//     <div className="space-y-6">
//       <div className="bg-white rounded-lg border shadow-sm">
//         <div className="p-6">
//           <h2 className="text-2xl font-medium mb-6">Company</h2>

//           {isLoading ? (
//             <div className="space-y-4">
//               <Skeleton className="h-10 w-full" />
//               <Skeleton className="h-20 w-full" />
//               <Skeleton className="h-10 w-full" />
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-t-md">
//               <table className="w-full border">
//                 <thead className="bg-[#F9FAFB]">
//                   <tr className="border-b">
//                     {[
//                       "Identification Number",
//                       "Business License Number",
//                       "Business Entity",
//                       "Business Duration",
//                       "Industry Type",
//                       "Code",
//                       "Actions",
//                     ].map((title, idx) => (
//                       <th
//                         key={idx}
//                         className="px-4 py-3 text-sm font-medium text-gray-500 text-center"
//                       >
//                         {title}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {(showAll
//                     ? companies
//                     : companies.slice(
//                         (currentPage - 1) * itemsPerPage,
//                         currentPage * itemsPerPage
//                       )
//                   ).map((company: any) => (
//                     <tr key={company?._id} className="border">
//                       <td className="px-4 py-3 text-base text-center">
//                         {company?.identificationNumber}
//                       </td>
//                       <td className="px-4 py-3 text-base text-center">
//                         {company?.businessLicenseNumber}
//                       </td>
//                       <td className="px-4 py-3 text-base text-center">
//                         {company?.businessEntity}
//                       </td>
//                       <td className="px-4 py-3 text-base text-center">
//                         {company?.businessDuration}
//                       </td>
//                       <td className="px-4 py-3 text-base text-center text-green-500">
//                         {company?.industryType}
//                       </td>
//                       <td className="px-4 py-3 text-base text-center text-green-500">
//                         {company?.uniqueCode}
//                       </td>
//                       <td className="px-4 py-3 text-sm">
//                         <div className="flex items-center justify-center gap-2">
//                           <Link href={`/company/edit-company/${company._id}`}>
//                             <Button variant="ghost" size="icon" className="h-8 w-8">
//                               <Pencil className="h-4 w-4" />
//                             </Button>
//                           </Link>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {!showAll && (
//                 <div className="mt-4 p-4">
//                   <Pagination
//                     totalItems={companies.length}
//                     itemsPerPage={itemsPerPage}
//                     currentPage={currentPage}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

