"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/password-input";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useRouter } from "next/navigation";

export function OrganizationLoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = React.useState({
    email: "", // Using 'email' key since backend DTO has 'email' which we map to username/email
    password: "",
  });
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(formData);
      router.push("/organization/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Organization Login</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your organization dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Username or Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            required
            placeholder="Enter username or email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="remember" 
            className="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background"
          />
          <Label htmlFor="remember" className="font-normal cursor-pointer">Remember me</Label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an organization account?{" "}
        <Link href="/organization/register" className="font-medium text-primary hover:underline">
          Register here
        </Link>
      </div>
    </motion.div>
  );
}
