import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Shield,
  Heart,
  Star,
  ChevronRight,
  Send,
  Sparkles,
  Ticket,
  HeartHandshake,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription
      console.log("Newsletter subscription:", email);
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    events: [
      { name: "Trending Events", path: "/events/trending" },
      { name: "Music Concerts", path: "/events/music" },
      { name: "Comedy Shows", path: "/events/standup" },
      { name: "Theater & Plays", path: "/events/plays" },
      { name: "Sports Events", path: "/events/sports" },
      { name: "Workshops", path: "/events/workshop" },
      { name: "Art & Culture", path: "/events/art" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "How It Works", path: "/how-it-works" },
      { name: "Careers", path: "/careers" },
      { name: "Press", path: "/press" },
      { name: "Blog", path: "/blog" },
      { name: "Contact", path: "/contact" },
    ],
    support: [
      { name: "Help Center", path: "/help" },
      { name: "Safety", path: "/safety" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Cookie Policy", path: "/cookies" },
      { name: "Refund Policy", path: "/refunds" },
    ],
    organizers: [
      { name: "Create Event", path: "/create-event" },
      { name: "Pricing", path: "/pricing" },
      { name: "Resources", path: "/resources" },
      { name: "Guidelines", path: "/guidelines" },
      { name: "Success Stories", path: "/success-stories" },
      { name: "Partner With Us", path: "/partners" },
    ],
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:bg-blue-600",
    },
    {
      icon: Twitter,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:bg-sky-500",
    },
    {
      icon: Instagram,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:bg-[#008CFF]",
    },
    {
      icon: Youtube,
      href: "https://youtube.com",
      label: "YouTube",
      color: "hover:bg-red-600",
    },
  ];

  const stats = [
    { icon: Calendar, value: "10K+", label: "Events Hosted" },
    { icon: Users, value: "500K+", label: "Happy Attendees" },
    { icon: Star, value: "4.8", label: "Average Rating" },
    { icon: Shield, value: "100%", label: "Secure Booking" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden">
        <svg
          className="relative block w-full h-12"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#gradient)"
            opacity="0.3"
          ></path>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/*
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2 sm: text-center">
            <Link to="/" className="inline-block mb-4">
              <div className="flex items-center space-x-2">
                 <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                  <Ticket className="w-8 h-8 text-white" />
                </div> 
                <span className="text-6xl p-2 font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  Quiketsy
                </span>
                
              </div>
            </Link>
            <p className="text-2xl ml-30 font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent ">
              Smart Ticket Booking
            </p>
          </div>
        </div>
      </div>
      */}

      <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Brand Section - Left Side */}
          <div className="text-center lg:border-r lg:border-gray-600 lg:pr-8">
            {/* FIX: Removed inline-block and ensured text-center is applied to the link container.
        Since the parent div is already text-center, we just need to ensure the Link does not override that alignment.
      */}
            <Link to="/" className="mb-2 block">
              <span className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                Quiketsy
              </span>
            </Link>
            <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent lg:ml-45">
              Smart Ticket Booking
            </p>
          </div>

          {/* Description Section - Right Side */}
          <div className="text-center lg:text-left">
            <p className="hidden md:block text-gray-400 md:leading-relaxed">
              <b>Quiketsy</b>, as its name shows <b>Quick-Ticket-Easy</b> is an event ticket booking platform.
              Our motive is to make an intelligent and smart system to book tickets,
              so you will not miss your favourite shows.
              Your ultimate destination <br></br>for seamless event discovery and
              booking. We connect passionate event-goers with unforgettable
              experiences across concerts, comedy shows,<br></br> sports events, and cultural
              festivities. With secure payments and instant confirmations.
            </p>
            <p className="block md:hidden text-gray-400 leading-relaxed">
              <b>Quiketsy</b>, as its name shows <b>Quick-Ticket-Easy</b> is an event ticket booking platform.
              Our motive is to make an intelligent and smart system to book tickets,
              so you will not miss your favourite shows.
              Your ultimate destination for seamless event discovery and
              booking. We connect passionate event-goers with unforgettable
              experiences across concerts, comedy shows, sports events, and cultural
              festivities. With secure payments and instant confirmations.
            </p>
            <div className="flex flex-wrap gap-4 mt-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Indore, India</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>quiketsyticketbooking@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

<div className="w-full text-center"> {/* Use w-full and the correct spelling: text-center */}
  <div className="flex items-center gap-2 text-1xl font-bold text-gray-400 mx-auto justify-center">
    <span>Crafted with </span>
    <b><HeartHandshake className="w-4.5 h-4.5 text-red-500 animate-pulse" /></b>
    <span>in Indore, India.</span>
  </div>
</div>

      {/* Newsletter Section */}
      <div className="relative border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-2xl font-bold">Stay in the Loop!</h3>
                </div>
                <p className="text-gray-300">
                  Get exclusive access to early-bird tickets and special offers
                  for trending events.
                </p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
                    isSubscribed
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  }`}
                >
                  {isSubscribed ? (
                    <>✓ Subscribed</>
                  ) : (
                    <>
                      Subscribe <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section
      <div className="border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg group-hover:scale-110 transition-transform">
                    <stat.icon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ml-37.5 lg:ml-41">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Events Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Events
            </h4>
            <ul className="space-y-2">
              {footerLinks.events.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizers Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Organizers</h4>
            <ul className="space-y-2">
              {footerLinks.organizers.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span><b> © {currentYear} Quiketsy.</b> All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm">
              {/* <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link> */}
              <div className="flex gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`p-2 bg-gray-800/50 rounded-lg hover:text-white transition-all transform hover:scale-110 hover:-translate-y-1 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
