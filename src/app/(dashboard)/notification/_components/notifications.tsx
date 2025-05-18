// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { Bell } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Pagination } from "@/components/pagination";

// export default function NotificationPage() {
//   const [token, setToken] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const storedToken =
//       sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
//     setToken(storedToken);
//   }, []);

//   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["notifications", currentPage, token],
//     queryFn: async () => {
//       if (!token || !backendUrl) return null;

//       const res = await fetch(`${backendUrl}/api/notification/admin`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         if (res.status === 404) {
//           return {
//             data: [],
//             pagination: {
//               totalPages: 1,
//               currentPage: 1,
//               totalNotifications: 0,
//             },
//           };
//         }
//         throw new Error("Failed to fetch notifications");
//       }

//       return res.json();
//     },
//     enabled: !!token && !!backendUrl,
//   });

//   const notifications = data?.data || [];
//   console.log(notifications);
//   const paginationData = data?.pagination || {
//     totalPages: 1,
//     currentPage: 1,
//     totalNotifications: 0,
//   };

//   const totalPages = Number(paginationData.totalPages);
//   const totalItems = Number(paginationData.totalNotifications);
//   const currentApiPage = Number(paginationData.currentPage);
//   const itemsPerPage = notifications.length || 10; // fallback to 10

//   return (
//     <div>
//       <h1 className="mb-6 border-b border-[#CECECE] pb-4 text-2xl font-bold">
//         Notifications
//       </h1>

//       {isLoading ? (
//         <p className="text-center py-6">Loading...</p>
//       ) : isError ? (
//         <p className="text-center text-red-500 py-6">
//           Failed to load notifications.
//         </p>
//       ) : notifications.length === 0 ? (
//         <p className="text-center py-6">No notifications found.</p>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {notifications.map((notification: any) => (
//               <div
//                 key={notification._id}
//                 className="flex items-start justify-between border-b p-4"
//               >
//                 <div className="flex gap-4">
//                   <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#282828]">
//                     <Bell className="h-5 w-5 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-[18px] font-[500] text-[#000000]">
//                       {notification.title}
//                     </h3>
//                     <p className="text-[16px] text-[#595959]">
//                       {notification.message}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-e nd">
//                   <span className="text-xs text-muted-foreground">
//                     {new Date(notification.createdAt).toLocaleDateString(
//                       "en-US",
//                       {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       }
//                     )}
//                   </span>
//                   {/* <Button
//                     variant="ghost"
//                     className="h-6 p-2 text-[16px] font-[500] text-red-500 hover:bg-red-50 hover:text-red-700"
//                   >
//                     Delete
//                   </Button> */}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination Controls */}
//           {/* <div className="mt-6 flex justify-end">
//             <Pagination
//               totalPages={totalPages}
//               currentPage={currentApiPage}
//               onPageChange={(page) => setCurrentPage(page)}
//               totalItems={totalItems}
//               itemsPerPage={itemsPerPage}
//             />
//           </div> */}

//           <div className="mt-6 flex justify-end">
//             <Pagination
//               totalPages={totalPages}
//               currentPage={currentApiPage}
//               onPageChange={(page) => setCurrentPage(page)}
//               totalItems={totalItems}
//               itemsPerPage={itemsPerPage}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/components/pagination";
import { Bell } from "lucide-react";

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken =
      sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
    if (storedToken) setToken(storedToken);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notification/admin`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
  });

  const allNotifications = data?.data ?? [];
  const totalItems = allNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const notifications = allNotifications.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Notification</h2>

        {isLoading ? (
          <p className="text-center py-6">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500 py-6">Failed to load notifications.</p>
        ) : notifications.length === 0 ? (
          <p className="text-center py-6">No notifications found.</p>
        ) : (
          <>
            <div className="space-y-4">
              {notifications.map((notification: any) => (
                <div
                  key={notification._id}
                  className="flex items-start justify-between border-b p-4"
                >
                  <div className="flex gap-4">
                    <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#282828]">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-[500] text-[#000000]">
                        {notification.title}
                      </h3>
                      <p className="text-[16px] text-[#595959]">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
