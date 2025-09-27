import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  DollarSign, 
  User, 
  Upload, 
  Download, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MessageSquare,
  Shield,
  Calendar,
  Target
} from 'lucide-react';

const ContractPage = () => {
  const [userType, setUserType] = useState('client'); // 'client' or 'freelancer'
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Mock contract data
  const contract = {
    id: 1,
    projectTitle: "UX Landing Page Revamp",
    clientName: "TechStartup Inc.",
    freelancerName: "Alex Morgan (Student #1)",
    status: "active",
    totalAmount: 520,
    startDate: "2024-01-20",
    endDate: "2024-01-29",
    terms: "Complete redesign of landing page with responsive design, user testing, and 2 rounds of revisions included.",
    escrowFunded: true
  };

  // Mock milestones data
  const milestones = [
    {
      id: 1,
      title: "Initial Research & Wireframes",
      description: "User research, competitor analysis, and initial wireframes",
      amount: 156,
      dueDate: "2024-01-23",
      status: "completed",
      deliverables: [
        { id: 1, name: "User Research Report.pdf", uploadedAt: "2024-01-22", size: "2.1 MB" },
        { id: 2, name: "Wireframes_v1.fig", uploadedAt: "2024-01-23", size: "4.8 MB" }
      ]
    },
    {
      id: 2,
      title: "High-Fidelity Design",
      description: "Complete visual design with desktop and mobile versions",
      amount: 208,
      dueDate: "2024-01-26",
      status: "in_progress",
      deliverables: []
    },
    {
      id: 3,
      title: "Implementation & Testing",
      description: "Code implementation and user testing with final revisions",
      amount: 156,
      dueDate: "2024-01-29",
      status: "pending",
      deliverables: []
    }
  ];

  // Mock messages data
  const messages = [
    {
      id: 1,
      sender: "client",
      senderName: "TechStartup Inc.",
      message: "Hi Alex! Looking forward to working with you on this project.",
      timestamp: "2024-01-20 10:30 AM",
      type: "text"
    },
    {
      id: 2,
      sender: "freelancer", 
      senderName: "Alex Morgan",
      message: "Thank you! I've started the research phase and will have the wireframes ready by tomorrow.",
      timestamp: "2024-01-20 2:45 PM",
      type: "text"
    },
    {
      id: 3,
      sender: "freelancer",
      senderName: "Alex Morgan", 
      message: "I've uploaded the initial wireframes and research findings. Please review and let me know your thoughts!",
      timestamp: "2024-01-23 11:20 AM",
      type: "deliverable"
    },
    {
      id: 4,
      sender: "client",
      senderName: "TechStartup Inc.",
      message: "The wireframes look great! I especially like the new user flow. Please proceed with the visual design.",
      timestamp: "2024-01-23 3:15 PM", 
      type: "text"
    }
  ];

  const Button = ({ children, variant = "default", size = "default", className = "", disabled = false, onClick }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500 shadow-lg hover:shadow-xl",
      secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500 border border-gray-600",
      success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
      outline: "border border-gray-600 text-gray-300 hover:bg-gray-800 focus:ring-gray-500"
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

  const Badge = ({ children, variant = "default" }) => {
    const variants = {
      default: "bg-gray-700 text-gray-300",
      success: "bg-green-900 text-green-300",
      warning: "bg-yellow-900 text-yellow-300",
      danger: "bg-red-900 text-red-300",
      info: "bg-blue-900 text-blue-300"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
        {children}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: "success", text: "Completed", icon: CheckCircle },
      in_progress: { variant: "warning", text: "In Progress", icon: Clock },
      pending: { variant: "default", text: "Pending", icon: Target },
      active: { variant: "success", text: "Active", icon: CheckCircle }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const ContractSummary = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-900 rounded-lg">
            <FileText className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{contract.projectTitle}</h1>
            <p className="text-gray-400">
              {userType === 'client' ? `With ${contract.freelancerName}` : `For ${contract.clientName}`}
            </p>
          </div>
        </div>
        {getStatusBadge(contract.status)}
      </div>

      <p className="text-gray-300 mb-6 leading-relaxed">{contract.terms}</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-teal-400" />
          <div>
            <div className="text-sm text-gray-400">Total Value</div>
            <div className="text-lg font-semibold text-white">${contract.totalAmount}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-teal-400" />
          <div>
            <div className="text-sm text-gray-400">Start Date</div>
            <div className="text-lg font-semibold text-white">{new Date(contract.startDate).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-teal-400" />
          <div>
            <div className="text-sm text-gray-400">End Date</div>
            <div className="text-lg font-semibold text-white">{new Date(contract.endDate).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-teal-400" />
          <div>
            <div className="text-sm text-gray-400">Escrow</div>
            <div className="text-lg font-semibold text-white">
              {contract.escrowFunded ? "Funded" : "Pending"}
            </div>
          </div>
        </div>
      </div>

      {userType === 'client' && !contract.escrowFunded && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Action Required</span>
          </div>
          <p className="text-gray-300 mb-3">Fund escrow to activate the contract and allow work to begin.</p>
          <Button variant="warning">
            Fund Escrow (${contract.totalAmount})
          </Button>
        </div>
      )}
    </div>
  );

  const MilestoneCard = ({ milestone }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{milestone.title}</h3>
          <p className="text-gray-400 text-sm">{milestone.description}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">${milestone.amount}</div>
          <div className="text-sm text-gray-400">Due: {new Date(milestone.dueDate).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        {getStatusBadge(milestone.status)}
      </div>

      {milestone.deliverables.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Deliverables</h4>
          <div className="space-y-2">
            {milestone.deliverables.map((file) => (
              <div key={file.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-white">{file.name}</div>
                    <div className="text-xs text-gray-400">{file.size} • {file.uploadedAt}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {userType === 'freelancer' && milestone.status !== 'completed' && (
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Deliverables
          </Button>
        )}
        
        {userType === 'client' && milestone.status === 'in_progress' && milestone.deliverables.length > 0 && (
          <>
            <Button variant="success" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept Work
            </Button>
            <Button variant="danger" size="sm">
              <XCircle className="h-4 w-4 mr-2" />
              Request Revision
            </Button>
          </>
        )}
      </div>
    </div>
  );

  const ChatPanel = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Project Chat
      </h3>
      
      <div className="h-80 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => {
          const isOwn = (userType === 'client' && msg.sender === 'client') || 
                        (userType === 'freelancer' && msg.sender === 'freelancer');
          
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isOwn 
                  ? 'bg-teal-600 text-white' 
                  : msg.type === 'deliverable'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200'
              }`}>
                <div className="text-xs opacity-75 mb-1">{msg.senderName}</div>
                <div className="text-sm">{msg.message}</div>
                <div className="text-xs opacity-75 mt-1">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 h-10 px-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <Button>
          <Send className="h-4 w-4" />
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Contract & Milestones */}
          <div className="xl:col-span-2 space-y-6">
            <ContractSummary />
            
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Milestones</h2>
              {milestones.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </div>

            {userType === 'client' && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contract Actions</h3>
                <div className="flex gap-3">
                  <Button variant="danger">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Raise Dispute
                  </Button>
                  <Button variant="outline">
                    View Contract Terms
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Chat */}
          <div>
            <ChatPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContractPage;