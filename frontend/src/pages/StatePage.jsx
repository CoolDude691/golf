import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ChevronRight, Frown } from "lucide-react";
import { stateByCode, slugifyCity } from "../constants";
import { getCourses } from "../api";
import { ListingCard } from "../components/CourseCard";

const StatePage = () => {
  const { stateCode, citySlug } = useParams();
  const state = stateByCode(stateCode);
  const [stateCourses, setStateCourses] = useState(null);

  useEffect(() => {
    if (!state) return;
    setStateCourses(null);
    getCourses({ state: stateCode }).then(setStateCourses).catch(() => setStateCourses([]));
  }, [stateCode, state]);

  if (!state) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900">State not found</h1>
        <Link to="/" className="text-emerald-600 text-sm mt-3 inline-block">Back to home</Link>
      </div>
    );
  }

  const all = stateCourses || [];
  const courses = citySlug ? all.filter((c) => c.citySlug === citySlug) : all;
  const loading = stateCourses === null;

  const cityName = citySlug
    ? courses[0]?.city ||
      citySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : null;

  const cities = [...new Set(all.map((c) => c.city))].sort();

  return (
    <div className="min-h-[60vh]" data-testid="state-page">
      <div className="bg-[#ecfbf4] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/states" className="hover:text-emerald-600 transition-colors">States</Link>
            <ChevronRight className="w-4 h-4" />
            {citySlug ? (
              <>
                <Link to={`/state/${stateCode}`} className="hover:text-emerald-600 transition-colors">
                  {state.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{cityName}</span>
              </>
            ) : (
              <span className="text-gray-900 font-medium">{state.name}</span>
            )}
          </nav>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight" data-testid="state-title">
            Mini Golf in {citySlug ? `${cityName}, ${state.name}` : state.name}
          </h1>
          <p className="mt-3 text-gray-600" data-testid="state-course-count">
            {loading ? "Loading courses..." : `${courses.length} ${courses.length === 1 ? "course" : "courses"} listed in our directory`}
          </p>
          {!citySlug && cities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {cities.map((city) => (
                <Link
                  key={city}
                  to={`/state/${stateCode}/${slugifyCity(city)}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  <MapPin className="w-3 h-3" /> {city}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!loading && courses.length === 0 ? (
          <div className="text-center py-20">
            <Frown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">No courses listed yet</h2>
            <p className="text-gray-500 mt-2 text-sm">
              We haven't added courses for this area yet. Check back soon!
            </p>
            <Link
              to="/states"
              className="inline-block mt-6 px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Browse Other States
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" data-testid="state-course-grid">
            {courses.map((course) => (
              <ListingCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatePage;
