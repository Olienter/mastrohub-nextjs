'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Menu Maker', href: '/menu-maker' },
      { name: 'Restaurant Curator', href: '/restaurant-curator' },
      { name: 'Marketing Assistant', href: '/marketing-assistant' },
    ],
    solutions: [
      { name: 'Small Restaurants', href: '/solutions/small' },
      { name: 'Chain Restaurants', href: '/solutions/chain' },
      { name: 'Fine Dining', href: '/solutions/fine-dining' },
      { name: 'Fast Casual', href: '/solutions/fast-casual' },
      { name: 'Catering', href: '/solutions/catering' },
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Help Center', href: '/help' },
      { name: 'API Documentation', href: '/docs' },
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'Webinars', href: '/webinars' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' },
      { name: 'Partners', href: '/partners' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
      { name: 'Security', href: '/security' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/mastrohub', icon: Twitter },
    { name: 'Facebook', href: 'https://facebook.com/mastrohub', icon: Facebook },
    { name: 'Instagram', href: 'https://instagram.com/mastrohub', icon: Instagram },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/mastrohub', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/mastrohub', icon: Github },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-900">Mastro</span>
              <span className="text-2xl font-bold text-blue-600 ml-1">Hub</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              AI-powered restaurant management platform. By gastro people for gastro people. 
              Professional tools for modern restaurant management.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact & Newsletter */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <a href="mailto:hello@mastrohub.com" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    hello@mastrohub.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <a href="tel:+421-555-123-456" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    +421 (555) 123-456
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600 text-sm">
                    Bratislava, Slovakia
                  </span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the latest restaurant industry insights and MastroHub updates.
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-600 text-sm">
              © {currentYear} MastroHub. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link key={link.name} href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 