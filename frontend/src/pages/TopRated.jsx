import React, { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { getCourses } from "../api";
import { TopRatedCard } from "../components/CourseCard";

const PAGE_SIZE = 16;

const TopRated = () => {
  const [all, setAll] = useState([]);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    getCourses({ sort: "top" }).then(setAll).catch(() => {});
  }, []);

  return (
    <div className="min-h-[60vh]" data-testid="top-rated-page">
      <div className="bg-[#ecfbf4] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Top Rated Mini Golf Courses
            </h1>
          </div>
          <p className="mt-3 text-gray-600 max-w-2xl">
            The highest-rated mini golf courses across the United States, ranked by real visitor
            ratings and verified review counts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="top-rated-list">
          {all.slice(0, visible).map((course) => (
            <TopRatedCard key={course.id} course={course} />
          ))}
        </div>
        {visible < all.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              data-testid="load-more-button"
              className="px-6 py-3 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Load More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRated;
