import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Sparkles, 
  QrCode, 
  Palette, 
  Globe, 
  TrendingUp,
  ChefHat,
  Star,
  ArrowRight,
  Check
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [ref1, inView1] = useInView({ threshold: 0.2, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.2, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.2, triggerOnce: true });

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Custom Website Creation",
      description: "Full setup tailored to your café's unique vibe with mobile-friendly, modern design",
      details: ["SEO-optimized for local search", "Location & contact integration", "Review showcase"]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Zomato & Swiggy Optimization",
      description: "Improve your listing descriptions, photos, and boost your reach",
      details: ["Smart offers & combos", "Performance analytics", "Increased visibility"]
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Branded QR Code Menus",
      description: "Interactive digital menu system with real-time updates",
      details: ["Custom design matching theme", "Instant menu updates", "Customer feedback"]
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Aesthetic Menu Cards",
      description: "Premium printed & digital menu designs styled to your café's theme",
      details: ["Professional graphics", "Brand-consistent colors", "Print-ready formats"]
    }
  ];

  const stats = [
    { number: "500+", label: "Cafés Transformed" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "2.5x", label: "Average Sales Boost" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-[#FFE8E0] to-[#FFF8F3]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <ChefHat className="w-8 h-8 text-[#FF6B6B]" />
              <h1 className="text-3xl font-bold text-gradient">SavoroAI</h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button 
                onClick={() => navigate('/create-menu')}
                className="bg-[#FF6B6B] hover:bg-[#E85555] text-white px-6 py-2 rounded-full font-medium shadow-lg"
                data-testid="nav-create-menu-btn"
              >
                Create Menu
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FF6B6B]/20">
                <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
                <span className="text-sm font-medium text-[#2C1810]">AI-Powered Café Branding</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C1810] leading-tight">
                Transform Your Café's
                <span className="text-gradient block mt-2">Digital Presence</span>
              </h1>
              
              <p className="text-lg text-[#6B5B50] leading-relaxed">
                From custom websites to AI-generated menus and QR codes, we provide everything your café needs to stand out in the digital age.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate('/create-menu')}
                  size="lg"
                  className="bg-[#FF6B6B] hover:bg-[#E85555] text-white px-8 py-6 rounded-full text-lg font-semibold shadow-xl btn-hover"
                  data-testid="hero-get-started-btn"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white px-8 py-6 rounded-full text-lg font-semibold"
                  data-testid="hero-learn-more-btn"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FFA07A] border-2 border-white" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFD93D] text-[#FFD93D]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#6B5B50] mt-1">Trusted by 500+ cafés</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop" 
                  alt="Beautiful café interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF6B6B] rounded-full flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B5B50]">Digital Menu</p>
                    <p className="font-bold text-[#2C1810]">Ready in Minutes</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-gradient mb-2">{stat.number}</h3>
                <p className="text-[#6B5B50]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={ref1} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2C1810] mb-4">
              Everything Your Café Needs
            </h2>
            <p className="text-lg text-[#6B5B50] max-w-2xl mx-auto">
              Comprehensive solutions to elevate your café's brand and customer experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView1 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
                data-testid={`feature-card-${index}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] to-[#FFA07A] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#2C1810] mb-3">{feature.title}</h3>
                <p className="text-[#6B5B50] mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#6B5B50]">
                      <Check className="w-4 h-4 text-[#FF6B6B]" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={ref2} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-[#2C1810] mb-4">
              Get Started in 3 Simple Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Menu", desc: "Add your café name and start building your digital menu" },
              { step: "02", title: "Add Dishes with AI", desc: "Use AI to generate descriptions and beautiful food images" },
              { step: "03", title: "Generate QR Code", desc: "Get your QR code and share your menu instantly" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView2 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B6B] to-[#FFA07A] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[#2C1810] mb-3">{item.title}</h3>
                <p className="text-[#6B5B50]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ref3} className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView3 ? { opacity: 1, scale: 1 } : {}}
          className="max-w-4xl mx-auto bg-gradient-to-br from-[#FF6B6B] to-[#FFA07A] rounded-3xl p-12 text-center shadow-2xl"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Café?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of cafés already using SavoroAI to create stunning digital experiences
          </p>
          <Button 
            onClick={() => navigate('/create-menu')}
            size="lg"
            className="bg-white text-[#FF6B6B] hover:bg-gray-50 px-10 py-6 rounded-full text-lg font-semibold shadow-xl"
            data-testid="cta-start-now-btn"
          >
            Start Now - It's Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C1810] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="w-6 h-6" />
            <h3 className="text-2xl font-bold">SavoroAI</h3>
          </div>
          <p className="text-white/70 mb-6">Empowering cafés with AI-driven digital solutions</p>
          <p className="text-sm text-white/50">© 2025 SavoroAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;