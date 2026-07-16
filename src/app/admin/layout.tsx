"use client";

import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  FilePlus,
  Tags,
  Users,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
   
const sidebarLinks = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Post Product", href: "/admin/post-product", icon: FilePlus },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
 

  useEffect(() => {
    if (!isPending && (!session?.user || (session.user as { role?: string }).role !== "admin")) {
      router.replace("/");
    }
  }, [session, isPending, router]);
   
  function closeSidebar() {
    setSidebarOpen(false);
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return null;
  }

  return (
    <div className="-mt-16 flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/" className="text-xl font-bold text-foreground">
            Shop<span className="text-primary">Ora</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Admin
            </span>
            <button
              onClick={closeSidebar}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeSidebar}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                pathname === link.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronLeft size={18} />
            Back to Site
          </Link>
        </div>
      </aside>

      <main className="flex flex-1 flex-col lg:ml-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:justify-end lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Avatar"}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {session.user.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">
                {session.user.name}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
