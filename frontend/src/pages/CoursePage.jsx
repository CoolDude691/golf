import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Globe,
  ChevronRight,
  DollarSign,
  Trophy,
} from "lucide-react";
import { stateByCode } from "../constants";
import { getCourse, getCourses } from "../api";
import { ListingCard } from "../components/CourseCard";

const CoursePage = () => {
  const { stateCode, courseId } = useParams();
  const state = stateByCode(stateCode);
  const [course, setCourse] = useState(undefined);
  const [nearby, setNearby] = useState([]);

  useEffect(() => {
    setCourse(undefined);
    getCourse(courseId).then(setCourse).catch(() => setCourse(null));
    getCourses({ state: stateCode, limit: 5 })
      .then((cs) => setNearby(cs.filter((c) => c.id !== courseId).slice(0, 4)))
      .catch(() => {});
  }, [courseId, stateCode]);

  if (course === undefined) {
    return <div className="max-w-4xl mx-auto px-4 py-24 text-center text-gray-500" data-testid="course-loading">Loading...</div>;
  }

  if (!course || !state) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center" data-testid="course-not-found">
        <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
        <Link to="/" className="text-emerald-600 text-sm mt-3 inline-block">Back to home</Link>
      </div>
    );
  }

  return (
    <div data-testid="course-page">
      {/* Hero image */}
      <div className="relative h-[340px] sm:h-[420px]">
        <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <nav className="flex items-center gap-1.5 text-sm text-gray-300 mb-3">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={`/state/${stateCode}`} className="hover:text-white transition-colors">
                {state.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{course.name}</span>
            </nav>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight" data-testid="course-title">
                {course.name}
              </h1>
              {course.featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                  <Trophy className="w-3.5 h-3.5" /> Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-200">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <strong className="text-white">{course.rating}</strong> ({course.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {course.city}, {state.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-4">
            About This Course
          </h2>
          <p className="text-[15px] leading-7 text-gray-600">{course.description}</p>

          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mt-10 mb-4">
            Visitor Rating
          </h2>
          <div className="bg-[#ecfbf4] rounded-xl p-6 flex items-center gap-6">
            <div className="text-5xl font-extrabold text-gray-900">{course.rating}</div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i <= Math.round(course.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1.5">
                Based on {course.reviewCount} verified reviews
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Course Information</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Address</div>
                  <div className="text-gray-600 mt-0.5">{course.address}</div>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Phone</div>
                  <div className="text-gray-600 mt-0.5">{course.phone}</div>
                </div>
              </li>
              <li className="flex gap-3">
                <DollarSign className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Pricing</div>
                  <div className="text-gray-600 mt-0.5">{course.priceRange}</div>
                </div>
              </li>
              <li className="flex gap-3">
                <Globe className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Website</div>
                  <a
                    href={course.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 mt-0.5 inline-block transition-colors"
                  >
                    Visit website
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">Hours</div>
                  <div className="space-y-1.5">
                    {Object.entries(course.hours).map(([day, hrs]) => (
                      <div key={day} className="flex justify-between gap-4 text-xs">
                        <span className="text-gray-500">{day}</span>
                        <span className="text-gray-800 font-medium">{hrs}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Nearby */}
      {nearby.length > 0 && (
        <div className="bg-[#ecfbf4] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
              More Courses in {state.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {nearby.map((c) => (
                <ListingCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
