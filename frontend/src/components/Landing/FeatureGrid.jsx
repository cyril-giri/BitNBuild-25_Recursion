import React from 'react';
import { cn } from "@/lib/utils";
import { Briefcase, ShieldCheck, MessageSquare, Star } from "lucide-react";

export function Card({ children, className, ...props }) {
  return (
    <div className={cn("rounded-lg border bg-white shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("border-b p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn("text-lg font-semibold leading-tight", className)} {...props}>
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
      "h-full transition-all duration-200 hover:shadow-md",
      accent && "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20"
    )}>
      <CardHeader className="pb-4">
        <div
          className={cn(
            "mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg",
            accent 
              ? "bg-yellow-400 text-white" 
              : "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-lg font-semibold leading-tight text-black">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm leading-relaxed text-black">
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
        <h2 className="text-pretty text-3xl font-semibold md:text-4xl">
          Everything you need for end‑to‑end projects
        </h2>
        <p className="mt-2 text-muted-foreground">
          Built for campuses and local communities—transparent, secure, and fast.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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