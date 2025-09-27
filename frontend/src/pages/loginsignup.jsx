import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    university: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const Button = ({ children, variant = "default", size = "default", className = "", disabled = false, onClick, type = "button" }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      default: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500 shadow-lg hover:shadow-xl",
      secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500 border border-gray-600",
      outline: "border border-gray-600 text-gray-300 hover:bg-gray-800 focus:ring-gray-500"
    };
    const sizes = {
      sm: "h-8 px-3 text-sm",
      default: "h-11 px-6",
      lg: "h-12 px-8 text-lg"
    };
    
    return (
      <button 
        type={type}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  const Input = ({ placeholder, type = "text", value, onChange, className = "", icon: Icon, ...props }) => (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-12 ${Icon ? 'pl-11' : 'pl-4'} pr-4 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );

  const PasswordInput = ({ placeholder, value, onChange, className = "" }) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Lock className="h-5 w-5 text-gray-400" />
      </div>
      <input 
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-12 pl-11 pr-11 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );

  const UserTypeSelector = () => (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <button
        type="button"
        onClick={() => setUserType('student')}
        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
          userType === 'student'
            ? 'border-teal-500 bg-teal-900/20 text-teal-300'
            : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
        }`}
      >
        <GraduationCap className="h-6 w-6 mx-auto mb-2" />
        <div className="font-medium">Student</div>
        <div className="text-xs opacity-75">Find gigs & earn</div>
      </button>
      <button
        type="button"
        onClick={() => setUserType('client')}
        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
          userType === 'client'
            ? 'border-teal-500 bg-teal-900/20 text-teal-300'
            : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-500'
        }`}
      >
        <Briefcase className="h-6 w-6 mx-auto mb-2" />
        <div className="font-medium">Client</div>
        <div className="text-xs opacity-75">Hire talent</div>
      </button>
    </div>
  );

  const LoginForm = () => (
    <div className="space-y-5">
      <Input
        placeholder="Your university email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        icon={Mail}
      />
      
      <PasswordInput
        placeholder="Password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
      />

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500" />
          <span className="text-gray-300">Remember me</span>
        </div>
        <button type="button" className="text-teal-400 hover:text-teal-300 transition-colors">
          Forgot password?
        </button>
      </div>

      <Button className="w-full text-lg font-semibold" size="lg">
        Sign In
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );

  const SignupForm = () => (
    <div className="space-y-5">
      <UserTypeSelector />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="First name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          icon={User}
        />
        <Input
          placeholder="Last name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          icon={User}
        />
      </div>

      <Input
        placeholder="Your university email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        icon={Mail}
      />

      {userType === 'student' && (
        <Input
          placeholder="University name"
          value={formData.university}
          onChange={(e) => handleInputChange('university', e.target.value)}
          icon={GraduationCap}
        />
      )}

      <PasswordInput
        placeholder="Create password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
      />

      <PasswordInput
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
      />

      <div className="flex items-start space-x-2">
        <input type="checkbox" className="mt-1 rounded border-gray-600 bg-gray-800 text-teal-500 focus:ring-teal-500" />
        <div className="text-sm text-gray-300">
          I agree to the <button type="button" className="text-teal-400 hover:text-teal-300">Terms of Service</button> and <button type="button" className="text-teal-400 hover:text-teal-300">Privacy Policy</button>
        </div>
      </div>

      <Button className="w-full text-lg font-semibold" size="lg">
        Create Account
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">GigCampus</span>
          </div>
          <p className="text-gray-400">
            {isLogin 
              ? 'Welcome back to your campus marketplace' 
              : 'Join the campus micro-economy today'
            }
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Tab Switcher */}
          <div className="flex bg-gray-700 rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Welcome back!' : 'Create your account'}
              </h2>
              <p className="text-gray-400">
                {isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Get started with your free account today'
                }
              </p>
            </div>

            {isLogin ? <LoginForm /> : <SignupForm />}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
              >
                {isLogin ? 'Sign up for free' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Secure authentication • University email verification • Free to join
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPage;