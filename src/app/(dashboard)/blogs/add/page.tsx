/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ImageIcon, StepBack } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; // Import sonner toast

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);

      const reader = new FileReader();
      reader.onload = () => setMainImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setGalleryImages(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMainImage(file);

      const reader = new FileReader();
      reader.onload = () => setMainImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const createBlogMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tag", tag);
      formData.append("authorName", "Admin");
      if (mainImage) {
        formData.append("mainImage", mainImage);
      }
      galleryImages.forEach((img) => {
        formData.append("subImages", img);
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to create blog");
      }

      return res.json();
    },
    onSuccess: () => {
      // Show success toast
      toast.success("Blog created successfully!", {
        description: "Your blog has been published.",
      });

      // Delay redirect to let toast be visible
      setTimeout(() => {
        router.push("/blogs");
      }, 2000);
    },
    onError: (error: any) => {
      // Show error toast
      toast.error("Failed to create blog", {
        description:
          error?.message || "Something went wrong while creating the blog.",
      });
      console.error("Blog post error:", error?.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (createBlogMutation.isPending) return;

    if (!title || !description) {
      // Show validation error toast
      toast.error("Missing required fields", {
        description: "Please fill in both title and description.",
      });
      return;
    }

    createBlogMutation.mutate();
  };

  const isLoading = createBlogMutation.isPending;

  return (
    <div className="space-y-6 mt-10">
      <div className="bg-[#09B850] text-white rounded-sm">
        <h2 className="text-[20px] font-medium px-5 py-5">Add Blog</h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-[20px] mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter your blog title here..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                required
                className="w-full border py-6 border-gray-300 rounded-sm"
              />
            </div>

            <div>
              <label className="block font-medium text-[20px] mb-1">
                Blog Description <span className="text-red-500">*</span>
              </label>
              <Textarea
              placeholder="Write your blog description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                required
                className="w-full border border-gray-300 rounded-sm h-[150px]"
              />
            </div>

            <div>
              <label className="block font-medium text-[20px] mb-1">
                Tag <span className="text-red-500">*</span>
              </label>
              <Input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                disabled={isLoading}
                required
                placeholder="Enter tags "
                className="w-full border border-gray-300 rounded-sm h-[51px]"
              />
            </div>
            <div>
              <label className="block font-medium text-[20px] mb-1">
                Additional Images
              </label>
              <Input
                type="file"
                accept=".jpeg,.jpg,.png"
                multiple
                onChange={handleGalleryImagesChange}
                disabled={isLoading}
                className="w-full"
              />
            </div>
          </div>

          <div className="shadow-[0px_0px_6px_0px_#00000040] py-4 rounded-lg px-3 flex flex-col justify-center">
            <label className="block text-[20px] mb-2 font-medium">
              Main Image
            </label>
            <div
              className="border border-dashed border-gray-400 rounded-sm p-4 flex flex-col items-center justify-center h-[150px]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {mainImagePreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={mainImagePreview || "/placeholder.svg"}
                    alt="Blog preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setMainImage(null);
                      setMainImagePreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <ImageIcon className="h-8 w-8 text-gray-500 mb-2" />
                    <p className="text-sm text-center text-gray-600">
                      Drop your image here, or <span>browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      .jpeg, .png are allowed
                    </p>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".jpeg,.jpg,.png"
                    onChange={handleMainImageChange}
                    disabled={isLoading}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <Link href="/blogs">
            <div className="relative flex items-center">
              <StepBack className="absolute ml-1 text-white w-4" />
              <Button className="px-5">Back</Button>
            </div>
          </Link>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#09B850] hover:bg-[#0ea271] text-white px-8 flex items-center gap-2"
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
