import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on all orders over $50. No hidden fees.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Protected checkout with industry-standard encryption.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy. No questions asked.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our team is here to help anytime, day or night.",
  },
];

export default function WhyShopWithUs() {
  return (
    <section className="border-y border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Why Shop With Us
          </h2>
          <p className="mt-2 text-muted-foreground">
            We make sure you have the best experience
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon size={28} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feat.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
