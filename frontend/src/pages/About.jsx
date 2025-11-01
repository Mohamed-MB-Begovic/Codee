import React from 'react';
import {
  AcademicCapIcon,
 
 
 
  CodeBracketIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import {
  ShieldCheckIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  ClockIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";
import { Link } from 'react-router-dom';
const About = () => {

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Secure Voting",
    description:
      "Advanced security measures ensure that every vote is protected and tamper-proof.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: ChartBarIcon,
    title: "Real-time Results",
    description:
      "Watch live results as they come in with our real-time updating system.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Mobile Friendly",
    description: "Vote from any device - smartphone, tablet, or computer.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: UserGroupIcon,
    title: "Student-Focused",
    description:
      "Designed specifically for student elections and campus needs.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: ClockIcon,
    title: "24/7 Access",
    description:
      "Access the voting system anytime, anywhere during election periods.",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: GlobeAltIcon,
    title: "Accessible",
    description:
      "WCAG compliant design ensuring accessibility for all students.",
    color: "bg-indigo-100 text-indigo-600",
  },
];

const teamMembers = [
{
  name: 'Dr. Ayaan Warsame',
  role: 'Hoggaamiyaha Mashruuca',
  image: 'https://plus.unsplash.com/premium_photo-1664301969414-d8435c2b91bb?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29tZW4lMjBpbiUyMHRlY2h8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000',
  bio: 'Bare sare oo ku takhasusay Cilmiga Kombiyuutarka, leh in ka badan 10 sano oo waayo-aragnimo ah tiknoolajiyada waxbarashada.'
}

,
  {
    name: 'Mohamed Mohamud abdulahi',
    role: 'Horumariye Sare',
    image: 'http://localhost:8000/uploads/p-3.jpeg',
    bio: 'Full-stack horumariye diiradda saara amniga nidaamyada codbixinta iyo khibradda isticmaalaha.'
  },
  {
    name: 'Ifraax Maxamed',
    role: 'Naqshadeeye UI/UX',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face',
    bio: 'Khabiir naqshadeed oo abuurta wejiyo isticmaale oo fudud, casri ah, oo la fahmi karo.'
  },
  {
    name: 'Sulieman Mohamed',
    role: 'Khabiirka Amniga',
    image: 'http://localhost:8000/uploads/p-2.jpeg',
    bio: 'Khabiir dhinaca amniga internet-ka ah, hubiya badbaadada iyo hufnaanta nidaamka codbixinta.'
  }
];


  const stats = [
    { number: '10+', label: 'Votes Processed' },
    { number: '25+', label: 'Institutions' },
    { number: '99.9%', label: 'Uptime' },
    { number: '0', label: 'Security Incidents' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AcademicCapIcon className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About EduVote</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Empowering educational institutions with secure, transparent, and accessible voting solutions.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                EduVote was born from a simple idea: every student's voice matters. We believe that 
                democratic processes in educational institutions should be as accessible, secure, and 
                transparent as possible.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our platform combines cutting-edge technology with user-centered design to create 
                voting experiences that are not only secure but also engaging and easy to use for 
                students of all technical backgrounds.
              </p>
         
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stat.number}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
  <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Why Choose EduVote?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for students and administrators — our platform ensures secure,
            fair, and transparent campus elections with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                {/* ICON CONTAINER */}
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-xl mb-5 ${feature.color.split(" ")[0]} group-hover:scale-110 transform transition-transform duration-300`}
                >
                  <Icon
                    className={`w-7 h-7 ${feature.color.split(" ")[1]} transition-transform duration-300 group-hover:rotate-6`}
                  />
                </div>

                {/* TEXT */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Register & Verify</h3>
              <p className="text-gray-600">
                Students register using their institutional credentials. Identity verification ensures one vote per student.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CodeBracketIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Cast Your Vote</h3>
              <p className="text-gray-600">
                Browse candidate profiles and cast your vote securely. The process is simple, intuitive, and confidential.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Real-time Results</h3>
              <p className="text-gray-600">
                Watch live results as votes are counted. Transparent reporting ensures trust in the outcome.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A diverse team of professionals dedicated to improving student democracy through technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <ShieldCheckIcon className="h-12 w-12 text-green-600 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Security & Privacy</h2>
              <p className="text-lg text-gray-600 mb-6">
                We take security seriously. Our platform employs multiple layers of protection to ensure 
                the integrity of every election.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>End-to-end encryption for all data</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Regular security audits and penetration testing</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>GDPR and FERPA compliant data handling</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Anonymous voting to protect voter privacy</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-lg font-semibold text-gray-900">Security Success Rate</div>
                <p className="text-gray-600 mt-2">Zero security breaches since launch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Campus Elections?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hundreds of educational institutions already using EduVote to empower their students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
            <Link to ="/voting"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started Today 
            </Link>
            <Link to="/" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 hover:text-blue-600 transition-colors">
              Schedule a Demo
            </Link>
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
                Secure, transparent voting solutions for educational institutions.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} EduVote. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;