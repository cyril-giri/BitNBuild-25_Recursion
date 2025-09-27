import React from 'react';
import { Briefcase, HandCoins, MessageSquare, ShieldCheck } from 'lucide-react';

const HowItWorks = () => {
  const Section = ({ children, id, className = "" }) => (
    <section id={id} className={`p-8 ${className}`}>
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
      text: "Release escrow when you're satisfied." 
    }
  ];

  return (
    <Section id="how" className="rounded-2xl border border-gray-200 bg-white">
      <div className="grid gap-8 md:grid-cols-4">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <div key={i} className="space-y-3 text-center md:text-left">
            <div className="inline-flex rounded-md bg-teal-50 p-3 text-teal-600">
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-lg font-semibold text-gray-900">{title}</div>
            <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default HowItWorks;