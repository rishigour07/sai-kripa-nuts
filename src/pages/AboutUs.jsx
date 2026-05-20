import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, ShieldCheck, Truck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import story from '../assets/story_image.png';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Leaf, title: '100% Organic', desc: 'Sourced from natural farms' },
  { icon: ShieldCheck, title: 'Premium Quality', desc: 'Handpicked and sorted' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Secure & hygienic packaging' },
];

const AboutUs = () => {
  useEffect(() => {
    // GSAP Scroll Animations
    const elements = document.querySelectorAll('.gsap-reveal');
    elements.forEach((el) => {
      gsap.fromTo(el, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-brand-cream min-h-screen pt-32">
      <Navbar />

      {/* Page Header */}
      <section className="py-20 text-center px-6">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-dark mb-6">Our <span className="text-brand-gold italic font-light">Story</span></h1>
        <p className="text-lg md:text-xl text-brand-dark/70 max-w-2xl mx-auto font-light">
          Discover the journey of Sai Kripa Nuts, bringing the purest and finest dry fruits directly from nature to your home.
        </p>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 gsap-reveal">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-gold translate-x-4 translate-y-4 rounded-2xl"></div>
                <img 
                  src={story} 
                  alt="Our Story" 
                  className="relative z-10 w-full h-[600px] object-cover rounded-2xl shadow-xl"
                />
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10 gsap-reveal">
              <span className="text-brand-gold uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">Tradition & Purity</span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-dark font-bold mb-6 leading-tight">
                Rooted in Nature, <br/><span className="italic font-light">Crafted for You</span>
              </h2>
              <p className="text-brand-dark/70 text-lg font-light leading-relaxed mb-6">
                Sai Kripa Nuts was born from a passion for authentic, unadulterated nature. We travel the globe to source directly from farmers who share our commitment to sustainable and traditional agricultural practices. 
              </p>
              <p className="text-brand-dark/70 text-lg font-light leading-relaxed mb-8">
                Every almond, pistachio, and walnut is a testament to our dedication to bringing you the highest quality, most nutritious, and flavorful dry fruits possible. We believe that what you eat should not only be delicious but also wholesome and natural.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Why Choose Us */}
      <section className="py-24 bg-brand-dark text-brand-cream relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 gsap-reveal">
            <span className="text-brand-gold uppercase tracking-[0.2em] text-sm font-semibold mb-2 block">Our Promise</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white font-bold">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {features.map((feature, index) => (
              <div key={index} className="gsap-reveal flex flex-col items-center p-8 rounded-2xl glass-dark">
                <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-10 h-10 text-brand-gold" />
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-white/70 font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-6 md:px-12 bg-brand-cream">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Photo */}
            <div className="lg:w-1/2 gsap-reveal order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-gold opacity-20 rounded-3xl transform -rotate-2 scale-105"></div>
                <img 
                  src="/founder-photo.jpg" 
                  alt="Founder" 
                  className="relative z-10 w-full h-auto rounded-3xl shadow-2xl object-cover"
                />
                <div className="absolute -inset-8 border-2 border-brand-gold/30 rounded-3xl opacity-50"></div>
              </div>
            </div>

            {/* Founder Bio */}
            <div className="lg:w-1/2 gsap-reveal order-1 lg:order-2">
              <span className="text-brand-gold uppercase tracking-[0.2em] text-sm font-semibold mb-4 block">Meet Our Founder</span>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-dark font-bold mb-6 leading-tight">
                Vision Born from <br/><span className="italic font-light text-brand-gold">Passion & Purpose</span>
              </h2>
              <p className="text-brand-dark/70 text-lg font-light leading-relaxed mb-6">
                Our founder built Sai Kripa Nuts on a simple yet powerful belief: that premium quality and authenticity should never be compromised. With years of experience in sustainable agriculture, every decision is made with integrity and dedication to excellence.
              </p>
              <p className="text-brand-dark/70 text-lg font-light leading-relaxed mb-8">
                Today, Sai Kripa Nuts stands as a testament to meticulous sourcing, rigorous quality control, and an unwavering commitment to bringing nature's finest offerings directly to discerning customers worldwide.
              </p>
              
              {/* Quote */}
              <div className="pl-6 border-l-4 border-brand-gold bg-brand-gold/5 py-6 px-6 rounded-lg">
                <p className="text-brand-dark italic font-light text-lg leading-relaxed">
                  "Quality is not an act, it is a habit. Every nut that leaves our hands must be perfect, because your trust in us is sacred."
                </p>
                <p className="text-brand-gold font-semibold mt-4 tracking-wide">— Founder, Sai Kripa Nuts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
