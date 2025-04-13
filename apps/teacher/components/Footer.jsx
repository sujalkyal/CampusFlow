import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full" style={{ backgroundColor: '#3a3153' }}>
      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="flex flex-col">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 mr-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#5f43b2' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fefdfd" className="w-6 h-6" viewBox="0 0 24 24">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
              </svg>
            </div>
            <span className="text-xl font-bold" style={{ color: '#fefdfd' }}>YourBrand</span>
          </div>
          <p className="mb-6 text-sm" style={{ color: '#b1aebb' }}>
            We're dedicated to providing exceptional products and services that enhance your life.
          </p>
          <div className="flex space-x-4">
            {/* Social Icons */}
            {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
              <a
                key={platform}
                href="#"
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#5f43b2' }}
              >
                <i className={`bi bi-${platform} text-sm`} style={{ color: '#fefdfd' }}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6" style={{ color: '#fefdfd' }}>Quick Links</h3>
          <div className="flex flex-col space-y-3">
            {['About Us', 'Services', 'Team', 'Blog', 'Careers'].map((text, i) => (
              <Link key={i} href={`/${text.toLowerCase().replace(/\s/g, '')}`} className="text-sm hover:underline" style={{ color: '#b1aebb' }}>
                {text}
              </Link>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-6" style={{ color: '#fefdfd' }}>Resources</h3>
          <div className="flex flex-col space-y-3">
            {['Help Center', 'FAQ', 'Privacy Policy', 'Terms', 'Sitemap'].map((text, i) => (
              <Link key={i} href={`/${text.toLowerCase().replace(/\s/g, '')}`} className="text-sm hover:underline" style={{ color: '#b1aebb' }}>
                {text}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-6" style={{ color: '#fefdfd' }}>Stay Updated</h3>
          <p className="mb-4 text-sm" style={{ color: '#b1aebb' }}>
            Subscribe for the latest updates.
          </p>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-md text-sm"
              style={{ backgroundColor: '#010101', color: '#fefdfd', border: '1px solid #b1aebb' }}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
              style={{ backgroundColor: '#5f43b2', color: '#fefdfd' }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t w-full" style={{ borderColor: '#b1aebb' }}>
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm" style={{ color: '#b1aebb' }}>
          <p>&copy; {currentYear} YourBrand. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
