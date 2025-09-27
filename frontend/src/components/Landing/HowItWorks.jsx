import React from 'react';
import { Briefcase, HandCoins, MessageSquare, ShieldCheck } from 'lucide-react';

const HowItWorks = () => {
  const Section = ({ children, id, className = "" }) => (
    <section
      id={id}
      className={`w-full max-w-7xl mx-auto p-8 rounded-2xl border border-neutral-800 bg-black ${className}`}
    >
      {children}
    </section>
  );

  const steps = [
    { 
      icon: Briefcase, 
      title: "Post", 
      text: "Share scope, budget, and timeline." 
    },
    { 
      icon: HandCoins, 
      title: "Bid & Hire", 
      text: "Compare proposals and accept the best bid." 
    },
    { 
      icon: MessageSquare, 
      title: "Work & Chat", 
      text: "Share files and track updates in one thread." 
    },
    { 
      icon: ShieldCheck, 
      title: "Approve & Pay", 
      text: "Release escrow when you’re satisfied." 
    }
  ];

  return (
    <Section id="how">
      <div className="grid gap-8 md:grid-cols-4">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <div key={i} className="space-y-3 text-center md:text-left">
            <div className="inline-flex rounded-md bg-neutral-900 p-3 text-cyan-400">
              <Icon className="h-8 w-8" />
            </div>
            <div className="text-lg font-bold text-white">{title}</div>
            <p className="text-base text-neutral-400 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default HowItWorks;