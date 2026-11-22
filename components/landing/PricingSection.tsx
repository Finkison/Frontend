import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/** A compact route to the published school plans. */
export default function PricingSection(): React.ReactElement {
  return (
    <section className="rounded-2xl border border-[#E7E0D6] bg-white p-6 dark:border-white/10 dark:bg-[#261E1A] sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-[#261E1A] dark:text-white">Clear pricing for school learning plans</h2>
          <p className="text-sm leading-6 text-[#5C5046] dark:text-stone-300">
            Compare school plans from ETB 250 per student each month, with separate options for students who subscribe on their own.
          </p>
        </div>
        <Link
          to="/pricing#school-plans"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#881337] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9F1239] focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2 dark:focus:ring-offset-[#261E1A]"
        >
          View school plans
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
