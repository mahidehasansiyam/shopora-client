"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-purple-900 px-6 py-12 text-center sm:px-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySCI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <Mail size={24} className="text-white" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-white">
              Stay in the Loop
            </h2>
            <p className="mt-2 text-white/80">
              Subscribe to get exclusive deals, new arrivals, and more.
            </p>
            {status === "success" ? (
              <p className="mt-6 text-lg font-semibold text-white">
                You&apos;re subscribed! 🎉
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-6 flex max-w-md items-center gap-3"
              >
                <div className="relative flex-1">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder-white/50 backdrop-blur-sm focus:border-white/40 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-purple-900 transition-opacity hover:opacity-90"
                >
                  Subscribe <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
