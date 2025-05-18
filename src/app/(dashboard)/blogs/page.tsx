/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pencil, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function BlogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");  
    setToken(storedToken);
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${slug}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      return res.json();
    },
    onSuccess: () => {
      toast("✅ Blog deleted", {
        description: "The blog has been deleted successfully.",
      });
      setIsModalOpen(false);
      refetch();
    },
    onError: () => {
      toast("❌ Failed to delete", {
        description: "Something went wrong. Please try again.",
      });
    },
  });

  const handleDeleteClick = (slug: string) => {
    setBlogToDelete(slug);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (blogToDelete) {
      deleteBlogMutation.mutate(blogToDelete);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setBlogToDelete(null);
  };

  if (isError) {
    return (
      <h1 className="text-center text-red-500">
        There was an error fetching blogs.
      </h1>
    );
  }

  const filteredUsers =
    data?.data.filter((user: any) =>
      [user.fullName, user.email, user.phoneNumber].join(" ").toLowerCase()
    ) ?? [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-gray-50 p-5 rounded-md border">
          <p className="text-gray-700 text-sm sm:text-base">
          Do you want to add a blog?
          </p>
          <Link href="/blogs/add">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Blog
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">Author</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((post: any) => (
                  <tr key={post._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{post.title}</td>
                    <td className="px-4 py-3">{post.authorName}</td>
                    <td className="px-4 py-3">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/blogs/edit/${post.slug}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteClick(post.slug)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 px-2">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUsers.length}
              />
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this blog?
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
