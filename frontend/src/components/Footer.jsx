import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#e9faf3] mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/states" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                  Browse by State
                </Link>
              </li>
              <li>
                <Link to="/top-rated" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link to="/top-rated" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                  Best Mini Golf in the USA
                </Link>
              </li>
              <li>
                <span className="text-sm text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">FAQ</span>
              </li>
              <li>
                <span className="text-sm text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">Sitemap</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Popular States</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/state/fl" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                  Florida
                </Link>
              </li>
              <li>
                <Link to="/state/ca" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                  California
                </Link>
              </li>
              <li>
                <Link to="/state/tx" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                  Texas
                </Link>
              </li>
              <li>
                <Link to="/state/ny" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                  New York
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><span className="text-sm text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">Contact</span></li>
              <li><span className="text-sm text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-sm text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="text-sm text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">About Us</span></li>
              <li><span className="text-sm text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">Blog</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-emerald-100 mt-10 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {year} Mini Golf USA Directory. All rights reserved.
          </p>
          <Link
            to="/admin"
            className="inline-block mt-2 text-xs text-gray-400 hover:text-emerald-600 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
