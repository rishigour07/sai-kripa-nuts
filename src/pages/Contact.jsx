import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
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
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-dark mb-6">Get in <span className="text-brand-gold italic font-light">Touch</span></h1>
        <p className="text-lg md:text-xl text-brand-dark/70 max-w-2xl mx-auto font-light">
          We'd love to hear from you. Whether you have a question about our products, pricing, or anything else, our team is ready to answer all your questions.
        </p>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 md:px-12 bg-white mb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Contact Info */}
            <div className="lg:w-1/3 gsap-reveal">
              <h2 className="text-3xl font-serif font-bold text-brand-dark mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-semibold text-brand-dark mb-1">Our Location</h4>
                    <p className="text-brand-dark/70 font-light leading-relaxed">
                      Shree Dhar Rao Gadre, Market New Market, Timarni, <br/>
                      District - Harda (M.P.)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-semibold text-brand-dark mb-1">Phone Number</h4>
                    <p className="text-brand-dark/70 font-light leading-relaxed">
                      +91 77229 25011
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-semibold text-brand-dark mb-1">Email Address</h4>
                    <p className="text-brand-dark/70 font-light leading-relaxed">
                      Gurjarpritam443@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-semibold text-brand-dark mb-1">Business Hours</h4>
                    <p className="text-brand-dark/70 font-light leading-relaxed">
                      Monday - Saturday <br/>
                      09:00 AM - 08:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3 gsap-reveal">
              <div className="bg-brand-cream p-10 md:p-14 rounded-2xl">
                <h2 className="text-3xl font-serif font-bold text-brand-dark mb-8">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-brand-dark/80 text-sm font-medium mb-2">First Name</label>
                      <input type="text" className="w-full px-5 py-4 bg-white border border-brand-dark/10 rounded-lg focus:outline-none focus:border-brand-gold transition-colors" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-brand-dark/80 text-sm font-medium mb-2">Last Name</label>
                      <input type="text" className="w-full px-5 py-4 bg-white border border-brand-dark/10 rounded-lg focus:outline-none focus:border-brand-gold transition-colors" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-brand-dark/80 text-sm font-medium mb-2">Email Address</label>
                    <input type="email" className="w-full px-5 py-4 bg-white border border-brand-dark/10 rounded-lg focus:outline-none focus:border-brand-gold transition-colors" placeholder="john@example.com" />
                  </div>

                  <div>
                    <label className="block text-brand-dark/80 text-sm font-medium mb-2">Subject</label>
                    <input type="text" className="w-full px-5 py-4 bg-white border border-brand-dark/10 rounded-lg focus:outline-none focus:border-brand-gold transition-colors" placeholder="How can we help you?" />
                  </div>

                  <div>
                    <label className="block text-brand-dark/80 text-sm font-medium mb-2">Message</label>
                    <textarea rows="5" className="w-full px-5 py-4 bg-white border border-brand-dark/10 rounded-lg focus:outline-none focus:border-brand-gold transition-colors resize-none" placeholder="Write your message here..."></textarea>
                  </div>

                  <button type="button" className="w-full px-8 py-4 bg-brand-gold text-white font-medium uppercase tracking-widest hover:bg-brand-dark transition-colors rounded-lg shadow-lg">
                    Send Message
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
