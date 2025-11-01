import React, { useState, useEffect } from 'react';
import { 
  AcademicCapIcon,
  CheckCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVotingOpen, setIsVotingOpen] = useState(true);

  // Sample statistics data
  const stats = [
    // { value: '10', label: 'Elections', icon: AcademicCapIcon, color: 'text-orange-600' },
    { value: '5+', label: 'Elections', icon: AcademicCapIcon, color: 'text-orange-600' },
    { value: '1,254+', label: 'Registered Students', icon: UserGroupIcon, color: 'text-blue-600' },
    { value: '987+', label: 'Votes Cast', icon: CheckCircleIcon, color: 'text-green-600' },
    { value: '78.9%+', label: 'Participation Rate', icon: ChartBarIcon, color: 'text-purple-600' },
  ];

  // Features data
  const features = [
    {
      title: 'Secure Voting',
      description: 'Our blockchain-based system ensures your vote is secure and tamper-proof.',
      icon: ShieldCheckIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Instant Results',
      description: 'See real-time results as votes are cast with our live updating system.',
      icon: ChartBarIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Mobile Friendly',
      description: 'Vote from any device - your phone, tablet, or computer.',
      icon: AcademicCapIcon,
      color: 'bg-purple-100 text-purple-600'
    },
  ];

  // Testimonials
const testimonials = [
  {
    quote: "Hanaanka codbixintu wuxuu ahaa mid fudud oo ammaan ah. Waxaan hubay in codkayga si sax ah loo tiriyey.",
    author: "Ayaan Cabdi",
    role: "Ardayda Cilmiga Kombiyuutarka"
  },
  {
    quote: "Waan jeclaa inaan taleefankayga kaga codeeyo. Barnaamijku wuxuu ahaa mid si fudud loo isticmaali karo.",
    author: "Mahad Maxamed",
    role: "Ardayda Maamulka Ganacsiga"
  },
  {
    quote: "Aad bay u xiiso lahayd inaan arko natiijooyinka tooska ah! Waxa ay iga dhigtay inaan dareemo inaan qayb ka ahay doorashada.",
    author: "Ifraax Xasan",
    role: "Ardayda Cilmiga Siyaasadda"
  }
];


  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">
              Your Voice Matters
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-up">
              Participate in the most secure and transparent student election system. 
              Make your vote count in the 2026 Student Council Elections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {isVotingOpen ? (
                <a
                  href="/voting"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-gray-50 transition-all transform hover:-translate-y-1"
                >
                  Vote Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-500 bg-gray-200"
                >
                  Voting Closed
                  <ClockIcon className="ml-2 h-5 w-5" />
                </button>
              )}
              
              <a
                href="/voting"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:bg-opacity-10 transition-all"
              >
                View Candidates
                <PlayIcon className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.color} bg-opacity-20 mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Voting System</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We've built the most advanced student voting platform with security, transparency, and accessibility in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${feature.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from students who have used our voting system.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-50 p-8 rounded-2xl shadow-sm">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                >
                  <p className="text-xl italic text-gray-700 mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.author.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make Your Voice Heard?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of students who have already participated in the most secure election system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isVotingOpen ? (
              <a
                href="/voting"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-gray-50 transition-all transform hover:-translate-y-1"
              >
                Vote Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </a>
            ) : (
              <div className="text-center">
                <p className="text-lg mb-4">Voting has ended. Results will be available soon.</p>
                <a
                  href="/results"
                  className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  View Results
                  <ChartBarIcon className="ml-2 h-5 w-5" />
                </a>
              </div>
            )}
            
            <a
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:bg-opacity-10 transition-all"
            >
              Learn More
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <AcademicCapIcon className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold">EduVote</span>
              </div>
              <p className="mt-4 text-gray-400">
                The most secure and transparent student voting platform.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Navigation</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="/voting" className="text-gray-400 hover:text-white">Vote</a></li>
                <li><a href="/results" className="text-gray-400 hover:text-white">Results</a></li>
                
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
                {/* <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li> */}
                <li><a href="/contact-us" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
              <p className="mt-4 text-gray-400">
                Have questions? Reach out to our support team.
              </p>
              <div className="mt-4">
                <a href="mailto:support@eduvote.edu" className="text-blue-400 hover:text-blue-300">
                  mohamedmohamudabdulahiabdi@gmail.com
                </a>
              </div>
              <div className="mt-4">
                <a href="mailto:support@eduvote.edu" className="text-blue-400 hover:text-blue-300">
                  +252 613149900                
                  </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} EduVote. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Add CSS animations */}
      <style >{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;