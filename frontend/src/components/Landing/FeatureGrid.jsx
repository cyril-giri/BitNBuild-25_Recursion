import React from 'react';
import { cn } from "@/lib/utils";
import { Briefcase, ShieldCheck, MessageSquare, Star } from "lucide-react";

export function Card({ children, className, ...props }) {
  return (
    <div className={cn(
      "rounded-2xl border border-neutral-800 bg-transparent shadow-sm transition-all duration-200",
      className
    )} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("p-6 pt-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("p-6 pb-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold leading-tight text-white", className)} {...props}>
      {children}
    </h3>
  );
}

function Section({ className, ...props }) {
  return <section className={cn("mx-auto w-full max-w-6xl px-4 py-12 md:py-16", className)} {...props} />
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  accent = false,
}) {
  return (
    <Card className={cn(
      "h-full group flex flex-col justify-between border border-neutral-800 bg-neutral-950/80 hover:shadow-lg",
      accent && "border-yellow-400 bg-yellow-900/20"
    )}>
      <CardHeader>
        <div
          className={cn(
            "mb-4 mt-2 inline-flex h-12 w-12 items-center justify-center rounded-lg",
            accent
              ? "bg-yellow-400 text-black"
              : "bg-neutral-900 text-cyan-400"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-bold text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-neutral-400 leading-relaxed">
          {desc}
        </p>
      </CardContent>
    </Card>
  )
}

const FeatureGrid = () => {
  return (
    <Section>
      <div className="mb-8">
        <h2 className="text-pretty text-4xl font-semibold md:text-5xl text-white">
          Everything you need for end‑to‑end projects
        </h2>
        <p className="mt-2 text-lg text-neutral-400">
          Built for campuses and local communities—transparent, secure, and fast.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={Briefcase}
          title="Project Marketplace & Bidding"
          desc="Clients post detailed briefs; verified students place bids with proposals and pricing."
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Secure Payment Escrow"
          desc="Funds are held safely and only released once milestones are approved."
          accent
        />
        <FeatureCard
          icon={MessageSquare}
          title="Real‑Time Chat + Files"
          desc="Keep all communication in one place with messages, previews, and status updates."
        />
        <FeatureCard
          icon={Star}
          title="Portfolio & Reputation"
          desc="Completed deliverables auto‑add to portfolios; both sides rate and review."
        />
      </div>
    </Section>
  );
};

export default FeatureGrid;