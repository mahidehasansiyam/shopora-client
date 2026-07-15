"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(Date.now() + 24 * 60 * 60 * 1000);

    function tick() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {(["hours", "minutes", "seconds"] as const).map((unit) => (
        <div key={unit} className="flex flex-col items-center">
          <span className="text-3xl font-bold text-white sm:text-4xl">
            {String(timeLeft[unit]).padStart(2, "0")}
          </span>
          <span className="text-xs uppercase text-white/70">{unit}</span>
        </div>
      ))}
    </div>
  );
}

export default function FlashSaleBanner() {
  return (
    <section className="bg-gradient-to-r from-purple-700 via-violet-600 to-purple-800 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white">
              <Zap size={16} /> Flash Sale
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Up to 60% Off — Today Only
            </h2>
            <p className="text-lg text-white/80">
              Grab the best deals before they&apos;re gone
            </p>
          </div>
          <div className="flex flex-col items-center gap-6 md:items-end">
            <Countdown />
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-purple-900 transition-opacity hover:opacity-90"
            >
              Shop the Sale <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
