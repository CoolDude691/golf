import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Building2 } from "lucide-react";
import { slugifyCity } from "../constants";
import { getStates } from "../api";

const StatesIndex = () => {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();
  const [states, setStates] = useState([]);

  useEffect(() => {
    getStates().then(setStates).catch(() => {});
  }, []);

  const statesWithData = useMemo(
    () =>
      states.filter((s) =>
        q ? s.name.toLowerCase().includes(q) || s.cities.some((c) => c.toLowerCase().includes(q)) : true
      ),
    [q, states]
  );

  return (
    <div className="min-h-[60vh]" data-testid="states-index-page">
      <div className="bg-[#ecfbf4] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-500" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Browse All Cities by State
            </h1>
          </div>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Explore mini golf courses in all 50 states. Click a state to view its courses, or jump
            straight to a city.
          </p>
          {q && (
            <p className="mt-2 text-sm text-emerald-700 font-medium" data-testid="search-results-label">
              Showing results for "{params.get("q")}"
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="states-list">
          {statesWithData.map((s) => (
            <div
              key={s.code}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <Link
                  to={`/state/${s.code}`}
                  className="text-lg font-bold text-gray-900 hover:text-emerald-600 transition-colors"
                >
                  {s.name}
                </Link>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  {s.count} {s.count === 1 ? "course" : "courses"}
                </span>
              </div>
              {s.cities.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {s.cities.slice(0, 6).map((city) => (
                    <Link
                      key={city}
                      to={`/state/${s.code}/${slugifyCity(city)}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                    >
                      <MapPin className="w-3 h-3" /> {city}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-3">No courses listed yet</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatesIndex;
