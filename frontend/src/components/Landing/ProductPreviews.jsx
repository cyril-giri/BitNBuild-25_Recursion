import React, { useState } from 'react';

const ProductPreviews = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [milestones, setMilestones] = useState([
    { name: '', payment: '', deadline: '' },
    { name: '', payment: '', deadline: '' }
  ]);

  // Sample data for dashboard projects
  const allProjects = [
    { title: "Mobile App QA", budget: 300, bids: 4, due: "7d" },
    { title: "Design Audit", budget: 450, bids: 5, due: "8d" },
    { title: "Landing Rework", budget: 600, bids: 6, due: "9d" }
  ];

  const bids = [
    { id: 1, price: "$520", time: "9d" },
    { id: 2, price: "$480", time: "11d" }
  ];

  const Card = ({ children, className = "" }) => (
    <div className={`bg-neutral-950 border border-neutral-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );

  const CardHeader = ({ children }) => (
    <div className="px-6 py-4 border-b border-neutral-800">
      {children}
    </div>
  );

  const CardTitle = ({ children }) => (
    <h3 className="text-lg font-semibold text-white">{children}</h3>
  );

  const CardContent = ({ children, className = "" }) => (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );

  const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-cyan-400 text-black hover:bg-cyan-300 focus:ring-cyan-400",
      secondary: "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-500",
      outline: "border border-neutral-800 bg-transparent text-white hover:bg-neutral-900 focus:ring-neutral-500"
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm"
    };
    
    return (
      <button 
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  const Input = ({ placeholder, className = "", ...props }) => (
    <input 
      type="text"
      placeholder={placeholder}
      className={`flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );

  const Textarea = ({ placeholder, className = "", ...props }) => (
    <textarea 
      placeholder={placeholder}
      className={`flex min-h-[80px] w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );

  const Badge = ({ children, variant = "default" }) => {
    const variants = {
      default: "bg-neutral-900 text-white",
      secondary: "bg-neutral-800 text-cyan-400"
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
        {children}
      </span>
    );
  };

  const TabButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
        active 
          ? 'bg-neutral-800 text-white' 
          : 'text-white hover:text-cyan-400 hover:bg-neutral-900'
      }`}
    >
      {children}
    </button>
  );

  return (
    <section className="w-full max-w-7xl mx-auto p-6">
      <div className="rounded-2xl border border-neutral-800 bg-black p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white md:text-4xl mb-2">
            Product Previews
          </h2>
          <p className="text-neutral-400">
            From posting and bidding to escrow, chat, delivery, reputation, and admin.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 1. Login Card */}
          <Card>
            <CardHeader>
              <CardTitle>Login (University Only)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-neutral-400">Use your @university.edu email</div>
              <div className="flex gap-2">
                <Input placeholder="you@university.edu" className="flex-1" />
                <Button>Continue</Button>
              </div>
              <div className="text-xs text-neutral-500">SSO-ready. Email domain enforcement.</div>
            </CardContent>
          </Card>

          {/* 2. Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex bg-neutral-900 p-1 rounded-md">
                <TabButton 
                  active={activeTab === 'all'} 
                  onClick={() => setActiveTab('all')}
                >
                  All Projects
                </TabButton>
                <TabButton 
                  active={activeTab === 'mine'} 
                  onClick={() => setActiveTab('mine')}
                >
                  My Projects
                </TabButton>
                <TabButton 
                  active={activeTab === 'bids'} 
                  onClick={() => setActiveTab('bids')}
                >
                  My Bids
                </TabButton>
              </div>
              
              <div className="space-y-3">
                {allProjects.map((project, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 p-3">
                    <div>
                      <div className="text-sm font-medium text-white">{project.title}</div>
                      <div className="text-xs text-neutral-400">
                        Budget: ${project.budget} • Bids: {project.bids}
                      </div>
                    </div>
                    <Badge variant="secondary">Due {project.due}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3. Post Project Form */}
          <Card>
            <CardHeader>
              <CardTitle>Post Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Title" />
              <Textarea placeholder="Description & deliverables" />
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-white">Milestones</div>
                {milestones.map((milestone, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <Input placeholder={`Milestone ${i + 1}`} />
                    <Input placeholder="% Payment" />
                    <Input placeholder="Deadline" />
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Budget Min" />
                <Input placeholder="Budget Max" />
              </div>
              
              <Button className="w-full">Submit</Button>
            </CardContent>
          </Card>

          {/* 4. Project Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Project Detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-neutral-800 bg-neutral-900 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-white">Milestone 1 • Design draft</div>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
                <div className="text-xs text-neutral-400">Budget: $600 • Deadline: 10d</div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-white">Bids</div>
                {bids.map((bid, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 p-3">
                    <div className="text-sm text-neutral-300">Proposal #{bid.id}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-white">{bid.price}</div>
                      <Badge variant="secondary">{bid.time}</Badge>
                      <Button size="sm">Accept & Fund Escrow</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 5. Bid Form */}
          <Card>
            <CardHeader>
              <CardTitle>Bid Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Brief proposal" />
              
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Bid price" />
                <Input placeholder="Delivery time (days)" />
              </div>
              
              <div className="flex gap-2">
                <Input placeholder="Attach sample (URL)" className="flex-1" />
                <Button>Submit</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductPreviews;