import React from 'react';

const CTAAndFooter = () => {
  const Section = ({ children, className = "" }) => (
    <section className={`px-6 py-8 ${className}`}>
      {children}
    </section>
  );

  const Button = ({ children, variant = "default", className = "", ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300"
    };
    
    return (
      <button 
        className={`${baseClasses} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
    <main className="w-full">
      {/* CTA Section */}
      <Section className="text-center max-w-4xl mx-auto py-16">
        <h3 className="text-3xl font-semibold text-blue md:text-4xl leading-tight">
          Ready to build your campus micro‑economy?
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600 text-lg">
          Start posting projects or bidding on gigs today. It's free to sign up and takes minutes.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Button className="h-11 px-8 text-base font-medium">
            Get Started — Client
          </Button>
          <Button variant="secondary" className="h-11 px-8 text-base font-medium">
            Get Started — Student
          </Button>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-black">
        <Section className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-teal-500" aria-hidden="true" />
            <span className="font-semibold text-white text-lg">GigCampus</span>
          </div>
          <p className="text-sm text-neutral-400">
            © {new Date().getFullYear()} GigCampus. All rights reserved.
          </p>
        </Section>
      </footer>
    </main>
  );
};

export default CTAAndFooter;