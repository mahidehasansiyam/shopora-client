import Link from "next/link";
import {
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Gamepad2,
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Smartphone, count: "240 items", href: "/explore" },
  { name: "Fashion", icon: Shirt, count: "580 items", href: "/explore" },
  { name: "Home & Living", icon: Home, count: "320 items", href: "/explore" },
  { name: "Sports", icon: Dumbbell, count: "190 items", href: "/explore" },
  { name: "Books", icon: BookOpen, count: "410 items", href: "/explore" },
  { name: "Gaming", icon: Gamepad2, count: "150 items", href: "/explore" },
];

export default function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Shop by Category
        </h2>
        <p className="mt-2 text-muted-foreground">
          Find exactly what you&apos;re looking for
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon size={28} />
              </div>
              <span className="mt-3 text-sm font-semibold text-foreground">
                {cat.name}
              </span>
              <span className="mt-0.5 text-xs text-muted-foreground">
                {cat.count}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
