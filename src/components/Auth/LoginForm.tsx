"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import formLogo from "../../Public/assets/fomrLogo.png";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    role: "SuperAdmin" | "Admin";
    user: {
      email: string;
      fullName: string;
      hasActiveSubscription: boolean;
      isEntryComplete: boolean;
      phoneNumber: string;
      profileImage: string;
      subscriptionExpireDate: string;
      uniqueCode: string;
      _id: string;
    };
  };
  token?: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { setUser, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
    mutationKey: ["loginKey"],
    mutationFn: (credentials: LoginCredentials) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }).then((res) => res.json()),
    onSuccess: (data: LoginResponse) => {
      const allowedRoles = ["SuperAdmin", "Admin"];

      if (!allowedRoles.includes(data.data.role)) {
        toast.warning("You are not allowed to access this system.");
        return;
      }

      // const storage = rememberMe ? localStorage : sessionStorage

      if (data.data) {
        sessionStorage.setItem("authToken", data.data.accessToken);
        sessionStorage.setItem("userData", JSON.stringify(data.data));
      }

      setUser({
        name: data.data.user.fullName,
        email: data.data.user.email,
        role: data.data.role,
        image: data.data.user.profileImage, // Assuming profileImage corresponds to the 'image' property
      });

      console.log("datfrom", data.data);
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      const message = error.message || "Login failed. Please try again.";

      toast.error(message);

      if (message === "Please complete your entry payment before logging in.") {
        router.push("/subscription");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center pt-[70px] justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#09B850] bg-white p-8">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center">
            <div className=" flex justify-center">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Image
                    src={formLogo}
                    alt="Business Consultation Logo"
                    width={140}
                    height={140}
                    className="mr-2"
                  />
                  <p className="-ml-[30px] text-[14px] font-medium text-[#09B850]">
                    {" "}
                    Going 2{"  "}
                    <span className={"text-black"}>Zero</span>
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold">Log In</h1>
        <p className="mb-8 text-center text-gray-400">
          Continue to register as a admin, Please provide the information.
        </p>

        <form onSubmit={handleSubmit}>
          <h2 className="mb-6 text-xl font-semibold text-gray-800">
            Enter your Personal Information
          </h2>

          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-gray-400">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Write your email"
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loginMutation.isPending}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="mb-2 block text-gray-400">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loginMutation.isPending}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loginMutation.isPending}
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-700">
                Remember me?
              </label>
            </div>
            <Link
              href="/forget-password"
              className="text-green-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-500 py-3 text-center font-medium text-white hover:bg-green-600 focus:outline-none disabled:bg-green-300"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <span className="flex items-center justify-center">
                <Loader2 size={20} className="mr-2 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>

          {loginMutation.isError && (
            <p className="mt-4 text-center text-red-500">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : "Login failed. Please try again."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
