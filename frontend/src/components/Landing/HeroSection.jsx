import React from "react"
import { Briefcase, Sparkles } from "lucide-react"

// Utility function for className concatenation
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Section component
function Section({ className, ...props }) {
  return <section className={cn("mx-auto w-full max-w-6xl px-4 py-12 md:py-16", className)} {...props} />
}

// Badge component
function Badge({ className, children, ...props }) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
      className
    )} {...props}>
      {children}
    </div>
  )
}

// Button component
function Button({ className, variant = "default", children, ...props }) {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-cyan-400 text-black hover:bg-cyan-300",
    secondary: "bg-neutral-900 text-white hover:bg-neutral-800"
  }
  
  return (
    <button className={cn(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}

// Card components
function Card({ className, children, ...props }) {
  return (
    <div className={cn("rounded-2xl border border-neutral-800 bg-neutral-950 text-white shadow-sm", className)} {...props}>
      {children}
    </div>
  )
}

function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  )
}

function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  )
}

function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}

// Avatar component
function Avatar({ className, children, ...props }) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}>
      {children}
    </div>
  )
}

function AvatarFallback({ className, children, ...props }) {
  return (
    <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-neutral-800 text-white", className)} {...props}>
      {children}
    </div>
  )
}

// Metric component
function Metric({ value, label }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-left">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-sm text-neutral-400">{label}</div>
    </div>
  )
}

// MarketplaceDemo component
function MarketplaceDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-cyan-400" /> UX Landing Page Revamp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 rounded-md border border-neutral-800 p-3 md:grid-cols-2 bg-neutral-900">
          <div>
            <div className="text-sm text-neutral-400">Budget</div>
            <div className="font-medium text-white">$400–$700</div>
          </div>
          <div>
            <div className="text-sm text-neutral-400">Timeline</div>
            <div className="font-medium text-white">10–14 days</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-neutral-400">Skills</div>
            <div className="mt-1 flex flex-wrap gap-2">
              <Badge className="bg-neutral-800 text-white border-0">Next.js</Badge>
              <Badge className="bg-neutral-800 text-white border-0">Tailwind</Badge>
              <Badge className="bg-neutral-800 text-white border-0">Figma</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-white">Recent Bids</div>
          <div className="grid gap-2">
            {[
              { name: "AM", price: "$520", note: "Can deliver in 9 days" },
              { name: "JS", price: "$480", note: "Includes 2 revisions" },
              { name: "KP", price: "$650", note: "Senior designer" },
            ].map((b, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-neutral-800 p-3 bg-neutral-900">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{b.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-white">Student #{i + 1}</div>
                    <div className="text-xs text-neutral-400">{b.note}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-white">{b.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 h-11 text-base font-semibold">Post a Project</Button>
          <Button variant="secondary" className="flex-1 h-11 text-base font-semibold">
            Browse Projects
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Main HeroSection component
function HeroSection() {
  return (
    <Section id="top" className="pt-16">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Badge className="w-fit bg-yellow-400 text-black border-0">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Introducing GigCampus
          </Badge>
          <h1 className="text-pretty text-4xl font-semibold leading-tight md:text-6xl text-white">
            The campus marketplace for real‑world projects
          </h1>
          <p className="text-pretty text-neutral-400">
            Connect local clients with verified student talent. Post projects, compare bids, work securely with
            escrow, chat & share files, and build a portfolio that opens doors.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="h-11 px-6 text-base font-semibold">Hire Talent</Button>
            <Button variant="secondary" className="h-11 px-6 text-base font-semibold">
              Find Gigs
            </Button>
          </div>
          <p className="text-sm text-neutral-400">Sign in with your @university.edu email</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric value="2,300+" label="Students" />
            <Metric value="850+" label="Projects" />
            <Metric value="$420k" label="Paid via Escrow" />
            <Metric value="4.8/5" label="Avg. Rating" />
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 md:p-6">
          <MarketplaceDemo />
        </div>
      </div>
    </Section>
  )
}

export default HeroSection