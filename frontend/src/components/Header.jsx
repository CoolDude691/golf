import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Search, Star, Menu, X } from "lucide-react";
import { stateByCode } from "../constants";
import { getCourses } from "../api";

const Header = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const timer = useRef(null);
  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    setOpen(v.trim().length > 0);
    clearTimeout(timer.current);
    if (!v.trim()) return setResults([]);
    timer.current = setTimeout(() => {
      getCourses({ q: v.trim(), limit: 8 }).then(setResults).catch(() => setResults([]));
    }, 250);
  };

  const go = (c) => {
    setOpen(false);
    setQuery("");
    navigate(`/state/${c.state}/course/${c.id}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <MapPin className="w-6 h-6 text-gray-900 group-hover:text-emerald-500 transition-colors" />
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                MiniGolf USA
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/states"
                className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Browse by State
              </Link>
              <Link
                to="/top-rated"
                className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Top Rated
              </Link>
              <a
                href="#blog"
                className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Blog
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div ref={boxRef} className="relative hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  onFocus={() => query.trim() && setOpen(true)}
                  placeholder="Search mini golf courses..."
                  data-testid="header-search-input"
                  className="w-52 lg:w-64 pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                />
              </div>
              {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden" data-testid="header-search-results">
                  {results.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">No courses found</div>
                  ) : (
                    results.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => go(c)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-50 transition-colors"
                      >
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {c.name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {c.rating} · {c.city}, {stateByCode(c.state)?.name}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link
            to="/states"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700"
          >
            Browse by State
          </Link>
          <Link
            to="/top-rated"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700"
          >
            Top Rated
          </Link>
          <a href="#blog" className="block py-2 text-sm font-medium text-gray-700">
            Blog
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
