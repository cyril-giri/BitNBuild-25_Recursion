import React, { useState } from 'react';
import { Briefcase, Clock, DollarSign, User, FileText, Star, Calendar, AlertCircle } from 'lucide-react';

const ProjectDetailPage = () => {
  const [userType, setUserType] = useState('client'); // 'client' or 'freelancer'
  const [bidAmount, setBidAmount] = useState('');
  const [etaDays, setEtaDays] = useState('');
  const [proposal, setProposal] = useState('');
  const [selectedBid, setSelectedBid] = useState(null);

  // Mock project data
  const project = {
    id: 1,
    title: "UX Landing Page Revamp",
    description: "We need a complete redesign of our product landing page. The current design feels outdated and doesn't convert well. Looking for someone with strong UX/UI skills who can create a modern, conversion-focused design that works across all devices.",
    budget: "$400-$700",
    timeline: "10-14 days",
    skills: ["Next.js", "Tailwind", "Figma"],
    status: "open",
    clientName: "TechStartup Inc.",
    postedDate: "2024-01-15",
    deliverables: [
      "Wireframes and user flow",
      "High-fidelity mockups",
      "Responsive design implementation",
      "Basic animations and interactions"
    ]
  };

  // Mock bids data
  const bids = [
    {
      id: 1,
      freelancerName: "Student #1",
      initials: "AM",
      bidAmount: 520,
      etaDays: 9,
      proposal: "Can deliver in 9 days",
      rating: 4.8,
      completedProjects: 12
    },
    {
      id: 2,
      freelancerName: "Student #2", 
      initials: "JS",
      bidAmount: 480,
      etaDays: 12,
      proposal: "Includes 2 revisions",
      rating: 4.9,
      completedProjects: 8
    },
    {
      id: 3,
      freelancerName: "Student #3",
      initials: "KP", 
      bidAmount: 650,
      etaDays: 8,
      proposal: "Senior designer",
      rating: 5.0,
      completedProjects: 25
    }
  ];

  const Button = ({ children, variant = "default", size = "default", className = "", disabled = false, onClick }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500 shadow-lg hover:shadow-xl",
      secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500 border border-gray-600",
      outline: "border border-gray-600 text-gray-300 hover:bg-gray-800 focus:ring-gray-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
    };
    const sizes = {
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-4",
      lg: "h-12 px-6 text-lg"
    };
    
    return (
      <button 
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  const Input = ({ placeholder, value, onChange, className = "", ...props }) => (
    <input 
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full h-10 px-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className}`}
      {...props}
    />
  );

  const Textarea = ({ placeholder, value, onChange, className = "", ...props }) => (
    <textarea 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full min-h-[100px] px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${className}`}
      {...props}
    />
  );

  const Badge = ({ children, variant = "default" }) => {
    const variants = {
      default: "bg-gray-700 text-gray-300",
      skill: "bg-teal-900 text-teal-300",
      status: "bg-green-900 text-green-300"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
        {children}
      </span>
    );
  };

  const ProjectCard = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900 rounded-lg">
            <Briefcase className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <p className="text-gray-400">Posted by {project.clientName}</p>
          </div>
        </div>
        <Badge variant="status">Open</Badge>
      </div>

      <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-teal-400" />
          <div>
            <div className="text-sm text-gray-400">Budget</div>
            <div className="text-lg font-semibold text-white">{project.budget}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-teal-400" />
          <div>
            <div className="text-sm text-gray-400">Timeline</div>
            <div className="text-lg font-semibold text-white">{project.timeline}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-teal-400" />
          <div>
            <div className="text-sm text-gray-400">Posted</div>
            <div className="text-lg font-semibold text-white">Jan 15, 2024</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-2">Required Skills</div>
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill, i) => (
            <Badge key={i} variant="skill">{skill}</Badge>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm text-gray-400 mb-3">Deliverables</div>
        <ul className="space-y-2">
          {project.deliverables.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-300">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {userType === 'client' && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <Button variant="danger" size="sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            Cancel Project
          </Button>
        </div>
      )}
    </div>
  );

  const BidCard = ({ bid }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">{bid.initials}</span>
          </div>
          <div>
            <div className="font-medium text-white">{bid.freelancerName}</div>
            <div className="text-sm text-gray-400 flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              {bid.rating} • {bid.completedProjects} projects
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">${bid.bidAmount}</div>
          <div className="text-sm text-gray-400">{bid.etaDays} days</div>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{bid.proposal}</p>

      {userType === 'client' && (
        <Button 
          className="w-full"
          onClick={() => setSelectedBid(bid.id)}
        >
          Accept & Fund Escrow
        </Button>
      )}
    </div>
  );

  const BidForm = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Submit Your Bid</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Proposal
          </label>
          <Textarea 
            placeholder="Describe your approach and why you're the best fit for this project..."
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bid Amount ($)
            </label>
            <Input 
              placeholder="480"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Delivery Time (days)
            </label>
            <Input 
              placeholder="10"
              value={etaDays}
              onChange={(e) => setEtaDays(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Portfolio/Sample (URL)
          </label>
          <Input placeholder="https://your-portfolio.com/sample" />
        </div>

        <Button className="w-full" size="lg">
          Submit Bid
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-teal-500 rounded"></div>
              <span className="text-white font-semibold text-lg">GigCampus</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant={userType === 'client' ? 'default' : 'secondary'} 
                size="sm"
                onClick={() => setUserType('client')}
              >
                Client View
              </Button>
              <Button 
                variant={userType === 'freelancer' ? 'default' : 'secondary'} 
                size="sm"
                onClick={() => setUserType('freelancer')}
              >
                Freelancer View
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2">
            <ProjectCard />
          </div>

          {/* Right Column - Bids/Bid Form */}
          <div className="space-y-6">
            {userType === 'client' ? (
              <>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Recent Bids ({bids.length})
                  </h3>
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <BidCard key={bid.id} bid={bid} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <BidForm />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;