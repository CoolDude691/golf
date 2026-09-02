import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Building2, Star, ClipboardCheck, RefreshCw, Trophy } from "lucide-react";
import { HERO_IMAGE, STATES } from "../constants";
import { getContent, getCourses, getPopularCities } from "../api";
import { FeaturedCard, TopRatedCard } from "../components/CourseCard";
import ShareSection from "../components/ShareSection";

const statIcons = [MapPin, ClipboardCheck, RefreshCw];

const Home = () => {
  const [search, setSearch] = useState("");
  const [c, setContent] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getContent().then(setContent).catch(() => {});
    getCourses({ featured: true }).then(setFeatured).catch(() => {});
    getCourses({ sort: "top", limit: 12 }).then(setTopRated).catch(() => {});
    getPopularCities().then(setPopular).catch(() => {});
  }, []);

  const handleFind = (e) => {
    e.preventDefault();
    const q = search.trim().toLowerCase();
    if (!q) return navigate("/states");
    const st = STATES.find((s) => s.name.toLowerCase() === q || s.code === q);
    if (st) return navigate(`/state/${st.code}`);
    navigate(`/states?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div data-testid="home-page">
      {/* ================= HERO ================= */}
      <section className="relative h-[520px] flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Mini golf course with vibrant obstacles" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02]" data-testid="hero-title">
              <span className="text-white">{c?.heroTitle1}</span>
              <br />
              <span className="text-[#18d97e]">{c?.heroTitle2}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-200 max-w-xl">{c?.heroSubtitle}</p>
            <form onSubmit={handleFind} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter your state or city..."
                data-testid="hero-search-input"
                className="flex-1 px-5 py-3.5 rounded-lg bg-white/95 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                data-testid="hero-search-button"
                className="px-7 py-3.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-[background-color,transform]"
              >
                Find Courses
              </button>
            </form>
            <Link
              to="/states"
              className="inline-flex items-center gap-1.5 mt-5 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <MapPin className="w-4 h-4" /> Find courses near me
            </Link>
          </div>
        </div>
      </section>

      {/* ================= INTRO SEO CONTENT ================= */}
      {c && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-8">
            {c.introTitle}
          </h2>
          <div className="space-y-5">
            {c.introParagraphs.map((p, i) => (
              <p key={i} className="text-[15px] leading-7 text-gray-600">{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* ================= FEATURED COURSES ================= */}
      <section className="bg-[#ecfbf4] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-7 h-7 text-emerald-500" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight" data-testid="featured-heading">
              Featured Courses ({featured.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="featured-grid">
            {featured.map((course) => (
              <FeaturedCard key={course.id} course={course} />
            ))}
          </div>

          {c && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14">
              {c.stats.map((s, i) => {
                const Icon = statIcons[i % statIcons.length];
                return (
                  <div key={i} className="bg-white rounded-xl border border-emerald-100 p-6 text-center hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{s.text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      {c && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-8">
            {c.whyTitle}
          </h2>
          <div className="space-y-5">
            {c.whyParagraphs.map((p, i) => (
              <p key={i} className="text-[15px] leading-7 text-gray-600">{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* ================= POPULAR CITIES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="w-7 h-7 text-emerald-500" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Popular Cities for Mini Golf
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="popular-cities-grid">
          {popular.map((pc) => (
            <Link
              key={`${pc.state}-${pc.slug}`}
              to={`/state/${pc.state}/${pc.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-[border-color,box-shadow]"
            >
              <div className="font-bold text-gray-900">
                {pc.city}, {pc.state.toUpperCase()}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {pc.courses} courses · {pc.avgRating} avg rating
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/states"
            className="inline-block px-6 py-3 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            Browse All Cities by State
          </Link>
        </div>
      </section>

      {/* ================= BROWSE BY STATE ================= */}
      <section className="bg-[#ecfbf4] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-7 h-7 text-emerald-500" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Browse by State
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" data-testid="states-grid">
            {STATES.map((s) => (
              <Link
                key={s.code}
                to={`/state/${s.code}`}
                data-testid={`state-link-${s.code}`}
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 text-center hover:border-emerald-400 hover:text-emerald-600 hover:shadow-sm transition-[border-color,color,box-shadow]"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TOP RATED ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Top Rated Courses
            </h2>
          </div>
          <Link
            to="/top-rated"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="top-rated-grid">
          {topRated.map((course) => (
            <TopRatedCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <ShareSection content={c} />
    </div>
  );
};

export default Home;
