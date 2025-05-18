"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function NewsletterFrom() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const lstoredToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    } else setToken(lstoredToken);
  }, []);

  const sendNewsletterMutation = useMutation({
    mutationFn: async (data: { body: string; sub: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletter/send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to send newsletter.");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Newsletter sent successfully!");
      setIsSubmitting(false)
    },
    onError: () => {
        setIsSubmitting(false)
      toast.error("Failed to send the newsletter. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    sendNewsletterMutation.mutate({ body, sub:subject });
  };

  return (
    <div className=" mx-auto p-4">
      <Card className="border-2 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-400" />
            <CardTitle className="text-2xl font-bold">
              Create Newsletter
            </CardTitle>
          </div>
          <CardDescription>
            Compose your newsletter and send it to your subscribers
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Enter newsletter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="body" className="text-sm font-medium">
                Body
              </label>
              <Textarea
                id="body"
                placeholder="Write your newsletter content here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                className="min-h-[200px] resize-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-4">
            <div className="text-sm text-muted-foreground">
              All fields are required
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !subject || !body}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Newsletter
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
