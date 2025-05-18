/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ImageIcon, StepBack } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function EditBlogPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    setToken(storedToken);
  }, []);

  const { data: blogData, isLoading: isLoadingBlog } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch blog");
      const data = await res.json();
      return data;
    },
    enabled: !!token && !!id,
  });

  const post: any = blogData?.data || null;

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setTag(post.tag);
      setMainImagePreview(post.image);

      if (post.subImages && Array.isArray(post.subImages)) {
        setExistingGalleryImages(post.subImages);
      }
    }
  }, [post]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);

      const reader = new FileReader();
      reader.onload = () => setMainImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryImages((prev) => [...prev, ...Array.from(e.target.files || [])]);
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

  const updateBlogMutation = useMutation({
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

      if (existingGalleryImages.length > 0) {
        existingGalleryImages.forEach(url => {
          formData.append("existingSubImages", url);
        });
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update blog");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Blog updated successfully!", {
        description: "Your changes have been saved.",
      });
      setTimeout(() => {
        router.push("/blogs");
      }, 2000);
    },
    onError: (error: any) => {
      toast.error("Failed to update blog", {
        description: error?.message || "Something went wrong while updating the blog.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Please fill in both title and description!");
      return;
    }

    updateBlogMutation.mutate();
  };

  const isLoading = updateBlogMutation.isPending || isLoadingBlog;

  if (isLoadingBlog) {
    return <div className="flex justify-center items-center h-64">Loading blog data...</div>;
  }

  return (
    <div className="space-y-6 mt-10">
      <div className="bg-[#09B850] text-white rounded-sm">
        <h2 className="text-[20px] font-medium px-5 py-5">Edit Blog</h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-[20px] mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
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

              {/* {existingGalleryImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Current Gallery Images:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {existingGalleryImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative h-24 border rounded-sm overflow-hidden group"
                      >
                        <Image
                          src={img}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setExistingGalleryImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

{existingGalleryImages.length > 0 && (
  <div className="mt-4">
    <p className="text-sm font-medium mb-2">Current Gallery Images:</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {existingGalleryImages.map((img, index) => {
        const isLastImage = existingGalleryImages.length === 1;

        return (
          <div
            key={index}
            className="relative h-24 border rounded-sm overflow-hidden group"
          >
            <Image
              src={img}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => {
                if (!isLastImage) {
                  setExistingGalleryImages((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }
              }}
              className={`absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity ${
                isLastImage
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-0 group-hover:opacity-100"
              }`}
              disabled={isLastImage}
              title={isLastImage ? "At least one image is required" : "Remove image"}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  </div>
)}
            </div>
          </div>

          <div className="shadow-[0px_0px_6px_0px_#00000040] py-4 rounded-lg px-3 flex flex-col justify-center">
            <label className="block text-[20px] mb-2 font-medium">Main Image</label>
            <div
              className="border border-dashed border-gray-400 rounded-sm p-4 flex flex-col items-center justify-center h-[150px]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {mainImagePreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={mainImagePreview}
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
                  <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
                    <ImageIcon className="h-8 w-8 text-gray-500 mb-2" />
                    <p className="text-sm text-center text-gray-600">
                      Drop your image here, or <span>browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">.jpeg, .png are allowed</p>
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
            className="bg-[#09B850] hover:bg-[#0ea271] text-white px-8"
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}

