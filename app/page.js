'use client'

import Link from 'next/link'
import { FileText, Shield, Sparkles, Crown, CheckCircle, ArrowRight, Star } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Footer from '../app/components/dashboard/Footer'

// Animation hook for scroll reveal
function useScrollAnimation() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible];
}

// Document SVG Component
const DocumentSVG = () => (
  <svg className="w-full h-full" viewBox="0 0 240 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect 
      x="20" 
      y="20" 
      width="200" 
      height="260" 
      rx="10" 
      fill="white" 
      stroke="currentColor" 
      strokeWidth="2"
      className="transition-all duration-300"
    />
    
    <g className="animate-fade-in" style={{ animationDelay: "200ms" }}>
      <rect x="45" y="60" width="150" height="4" rx="2" fill="#333333" opacity="0.7"/>
      <rect x="45" y="80" width="130" height="4" rx="2" fill="#333333" opacity="0.5"/>
      <rect x="45" y="100" width="140" height="4" rx="2" fill="#333333" opacity="0.7"/>
    </g>

    <g className="animate-signature">
      <path 
        d="M45 140 C60 120, 80 160, 100 140 S120 120, 140 140 S160 160, 180 140"
        stroke="url(#signatureGradient)" 
        strokeWidth="3"
        fill="none"
        className="animate-draw"
      />
      <defs>
        <linearGradient id="signatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#333333" />
          <stop offset="100%" stopColor="#666666" />
        </linearGradient>
      </defs>
    </g>

    <g className="animate-fade-in" style={{ animationDelay: "600ms" }}>
      <rect x="45" y="180" width="90" height="4" rx="2" fill="#333333" opacity="0.5"/>
      <rect x="45" y="200" width="120" height="4" rx="2" fill="#333333" opacity="0.7"/>
      <circle cx="45" cy="240" r="4" fill="#333333"/>
      <circle cx="65" cy="240" r="4" fill="#666666"/>
      <circle cx="85" cy="240" r="4" fill="#333333"/>
    </g>

    <g className="animate-pen-move" transform="rotate(-45)">
      <rect x="160" y="100" width="40" height="8" rx="2" fill="#333333"/>
      <path d="M200 100 L210 104 L200 108 Z" fill="#333333"/>
    </g>
  </svg>
)
// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  const [ref, isVisible] = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      className={`p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 transition-all duration-500 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        hover:-translate-y-2 hover:shadow-xl hover:bg-white`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6 transform hover:rotate-6 transition-transform duration-300 hover:shadow-lg group">
        <Icon className="h-7 w-7 text-white transform group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

// Testimonial Card Component
const TestimonialCard = ({ name, role, content, rating, delay }) => {
  const [ref, isVisible] = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      className={`p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 transition-all duration-500
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}
        hover:bg-white hover:shadow-xl`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-gray-800 fill-current" />
        ))}
      </div>
      <p className="text-gray-600 italic mb-6">&quot;{content}&quot;</p>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-semibold">{name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  )
}

// Stats Card Component
const StatsCard = ({ number, label, delay }) => {
  const [ref, isVisible] = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      className={`p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 transition-all duration-500 group
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        hover:-translate-y-2 hover:shadow-xl hover:bg-white`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-4xl font-bold text-black group-hover:text-gray-800 transition-colors duration-300">
        {number}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  )
}

// Background Components
const ParticlesBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < 10; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 100 + 50,
          left: Math.random() * 100,
          animationDelay: Math.random() * 20,
          animationDuration: Math.random() * 10 + 20
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}vw`,
            animationDelay: `${bubble.animationDelay}s`,
            animationDuration: `${bubble.animationDuration}s`
          }}
        />
      ))}
    </div>
  );
};

const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50/20 to-transparent" />
    <div className="wave" />
    <div className="wave" style={{ animationDelay: '-2s', opacity: 0.5 }} />
    <div className="wave" style={{ animationDelay: '-4s', opacity: 0.3 }} />
  </div>
);
export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {isClient && <ParticlesBackground />}
      <WaveBackground />
      
      {/* Navigation */}
      <nav className="fixed w-full backdrop-blur-xl bg-white/90 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-2 group">
              <Crown className="h-8 w-8 text-black transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-semibold text-black">
                SmartSignGPT
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-black transition-colors">Features</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-black transition-colors">Pricing</Link>
              <Link href="#about" className="text-gray-600 hover:text-black transition-colors">About</Link>
              <Link 
                href="/routes/dashboard"
                className="px-6 py-2.5 bg-black text-white rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-24">
            <div className="flex-1 text-left">
              <div className="inline-flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2 mb-8 hover:bg-gray-100 transition-colors border border-gray-200">
                <Sparkles className="w-4 h-4 text-gray-600 animate-pulse" />
                <span className="text-sm font-medium text-gray-800">Powered by Advanced AI</span>
              </div>

              <h1 className="text-6xl font-bold tracking-tight mb-6 text-gray-900 animate-fade-in">
                Transform Your 
                <span className="block mt-2">Documents with</span>
                <span className="text-5xl text-black animate-gradient">
                  Smart Automation
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 max-w-xl leading-relaxed animate-fade-in">
                Experience the future of document management with AI-powered analysis,
                intelligent insights, and unmatched security.
              </p>

              <Link 
                href="/routes/dashboard"
                className="inline-flex relative items-center px-8 py-4 bg-black text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group animate-slide-up"
              >
                Get Started & Try Demo 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Illustration */}
            <div className="flex-1 relative">
              <div className="relative w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-400/20 to-gray-400/20 rounded-3xl transform rotate-6 opacity-30 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-gray-400/20 to-gray-400/20 rounded-3xl transform -rotate-3 opacity-30 animate-pulse delay-100"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200">
                  <DocumentSVG />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
            <StatsCard number="10M+" label="Documents Processed" delay={0} />
            <StatsCard number="99.9%" label="Accuracy Rate" delay={200} />
            <StatsCard number="5000+" label="Enterprise Users" delay={400} />
          </div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <FeatureCard 
              icon={FileText}
              title="Smart Processing"
              description="Advanced AI technology analyzes and processes your documents with incredible speed and accuracy."
              delay={0}
            />
            <FeatureCard 
              icon={Shield}
              title="Bank-Grade Security"
              description="Enterprise-level encryption and security protocols keep your sensitive documents protected."
              delay={200}
            />
            <FeatureCard 
              icon={CheckCircle}
              title="Automated Workflow"
              description="Streamline your document workflow with intelligent automation and real-time collaboration."
              delay={400}
            />
          </div>

          {/* Testimonials */}
          <div id="about" className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
              Trusted by Industry Leaders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard 
                name="Sarah Johnson"
                role="Legal Director, TechCorp"
                content="SmartSignGPT has revolutionized our document workflow. The AI analysis is incredibly accurate and has saved us countless hours."
                rating={5}
                delay={0}
              />
              <TestimonialCard 
                name="Michael Chen"
                role="CEO, Innovation Labs"
                content="The security and automation capabilities are unmatched. It's become an indispensable tool for our operations."
                rating={5}
                delay={200}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes gradient-move {
          0% { background-position: 0 0, 30px 30px; }
          100% { background-position: 60px 60px, 90px 90px; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pen-move {
          0% { transform: translate(-50px, -50px) rotate(-45deg); }
          20% { transform: translate(0px, 0px) rotate(-45deg); }
          80% { transform: translate(150px, 0px) rotate(-45deg); }
          100% { transform: translate(200px, -50px) rotate(-45deg); }
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) scale(2);
            opacity: 0;
          }
        }

        @keyframes wave {
          0% { transform: translateX(0) translateZ(0) scaleY(1); }
          50% { transform: translateX(-25%) translateZ(0) scaleY(0.8); }
          100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
        }

        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100px;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.03));
          transform-origin: bottom center;
          animation: wave 12s linear infinite;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05));
          animation: float 20s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% 200%;
        }

        .animate-signature path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: signature 4s ease-in-out forwards;
        }

        .animate-pen-move {
          animation: pen-move 4s ease-in-out infinite;
        }

        @keyframes signature {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
