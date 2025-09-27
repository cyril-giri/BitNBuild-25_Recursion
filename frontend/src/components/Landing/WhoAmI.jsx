import React, { useState } from "react"
import { ShieldCheck, Star, FileUp, CheckCircle2 } from "lucide-react"

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
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2", className)} {...props}>
      {children}
    </div>
  )
}

// Button component
function Button({ className, variant = "default", children, ...props }) {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-cyan-400 text-black hover:bg-cyan-300",
    secondary: "bg-neutral-900 text-white hover:bg-neutral-800",
    accent: "bg-yellow-400 text-black hover:bg-yellow-300"
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

// Tabs components
function Tabs({ defaultValue, className, children, ...props }) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  
  return (
    <div className={cn("w-full", className)} data-active-tab={activeTab} {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  )
}

function TabsList({ className, children, activeTab, setActiveTab, ...props }) {
  return (
    <div className={cn("inline-flex h-12 items-center justify-center rounded-xl bg-neutral-900 p-1 w-full mb-8", className)} {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  )
}

function TabsTrigger({ value, className, children, activeTab, setActiveTab, ...props }) {
  const isActive = activeTab === value
  
  return (
    <button
      className={cn(
        "flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2",
        isActive
          ? "bg-black text-white shadow"
          : "text-neutral-400 hover:bg-neutral-800",
        className
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, className, children, activeTab, ...props }) {
  if (activeTab !== value) return null
  
  return (
    <div className={cn("mt-2", className)} {...props}>
      {children}
    </div>
  )
}

// Demo components
function EscrowDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-cyan-400" /> Escrow Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md border border-neutral-800 bg-neutral-900 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-400">Status</div>
              <div className="font-medium text-white">Funded</div>
            </div>
            <Badge className="bg-cyan-400 text-black border-0">Safe</Badge>
          </div>
          <div className="mt-2 text-xs text-neutral-400">
            Funds are released only when the client accepts the milestone.
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <Button variant="secondary">Request Revision</Button>
          <Button variant="accent">Accept & Release</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ChatDemo() {
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>CL</AvatarFallback>
        </Avatar>
        <div className="rounded-md bg-neutral-900 px-3 py-2 text-sm text-white">Could you share a first preview by Friday?</div>
      </div>
      <div className="flex items-end gap-2 justify-end">
        <div className="rounded-md bg-cyan-400 px-3 py-2 text-sm text-black font-medium">
          Uploading a watermarked draft.
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex items-center gap-2">
        <div className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm w-full">
          <div className="flex items-center gap-2">
            <FileUp className="h-4 w-4 text-cyan-400" />
            <span className="text-white">draft-mockup.pdf • 2.1MB</span>
          </div>
          <div className="mt-2 h-24 w-full rounded bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-400"></div>
              </div>
            </div>
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(0,0,0,0.1) 30deg, transparent 60deg)`
            }}></div>
          </div>
          <div className="mt-1 text-xs text-neutral-400">Watermark shown until acceptance</div>
        </div>
        <Button variant="secondary" className="shrink-0">
          Send
        </Button>
      </div>
    </div>
  )
}

function PortfolioDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-cyan-400" /> Portfolio & Reputation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-square overflow-hidden rounded-md border border-neutral-800 bg-gradient-to-br from-orange-200 via-red-300 to-orange-400 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              </div>
              <div className="absolute bottom-2 left-2 right-2 h-4 bg-white/30 rounded"></div>
              <div className="absolute top-2 right-2 w-4 h-4 bg-cyan-400 rounded"></div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-4 w-4", i < 4 ? "fill-cyan-400 text-cyan-400" : "text-neutral-400")} />
          ))}
          <span className="text-sm text-neutral-400">(124 reviews)</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Main WhoAmI component
function WhoAmI() {
  return (
    <Section id="marketplace" className="bg-black rounded-2xl">
      <Tabs defaultValue="client" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">I'm a Client</TabsTrigger>
          <TabsTrigger value="student">I'm a Student</TabsTrigger>
        </TabsList>
        <TabsContent value="client" className="mt-6">
          <div className="grid items-start gap-6 md:grid-cols-2">
            <ul className="space-y-3">
              {[
                "Post scoped projects with budget & timeline",
                "Receive competitive bids with brief proposals",
                "Fund milestones safely in escrow",
                "Chat, share files, and track progress",
                "Approve and release when you're happy",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan-400" />
                  <span className="text-white text-lg">{t}</span>
                </li>
              ))}
            </ul>
            <div className="grid gap-4">
              <EscrowDemo />
              <ChatDemo />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="student" className="mt-6">
          <div className="grid items-start gap-6 md:grid-cols-2">
            <ul className="space-y-3">
              {[
                "Browse local projects that match your skills",
                "Bid with your price and concise proposal",
                "Work confidently—funds secured in escrow",
                "Deliver previews with auto‑watermark",
                "Grow your portfolio & ratings automatically",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan-400" />
                  <span className="text-white text-lg">{t}</span>
                </li>
              ))}
            </ul>
            <div className="grid gap-4">
              <ChatDemo />
              <PortfolioDemo />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Section>
  )
}

export default WhoAmI