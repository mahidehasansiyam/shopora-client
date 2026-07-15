"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";

async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  try {
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      rememberMe: formData.get("remember") === "on",
    };
    const { data: result, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/",
    });
    if (result) console.log("login success", result);
    if (error) console.log("login error", error);
  } catch (err) {
    console.error("Login failed", err);
  }
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your ShopOra account
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <form
            onSubmit={(e) => handleLogin(e)}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="mt-1 relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary accent-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-md border border-input bg-background py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
              G
            </span>
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
