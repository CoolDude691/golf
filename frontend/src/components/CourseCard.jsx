import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Star, MapPin } from "lucide-react";

export const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1.5">
    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
    <span className="text-sm font-semibold text-gray-900">{rating}</span>
  </div>
);

// Card used in "Top Rated Courses" sections - trophy icon, no image
export const TopRatedCard = ({ course }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-[box-shadow,transform] duration-200">
    <Trophy className="w-8 h-8 text-amber-500 mb-4" strokeWidth={2} />
    <h3 className="text-lg font-bold text-gray-900 leading-snug">{course.name}</h3>
    <div className="mt-2">
      <StarRating rating={course.rating} />
    </div>
    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
      <MapPin className="w-3.5 h-3.5" />
      {course.city}
    </div>
    <p className="text-sm text-gray-600 mt-3 flex-1">
      Rated {course.rating} out of 5 stars from {course.reviewCount} verified reviews — one of
      the top-rated mini golf courses in the area.
    </p>
    <Link
      to={`/state/${course.state}/course/${course.id}`}
      className="mt-5 block w-full text-center text-sm font-medium text-gray-900 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 hover:border-gray-400 transition-colors"
    >
      Learn More
    </Link>
  </div>
);

// Card used in "Featured Courses" - with image
export const FeaturedCard = ({ course }) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-[box-shadow,transform] duration-300 flex flex-col">
    <div className="h-48 overflow-hidden">
      <img
        src={course.image}
        alt={course.name}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
      <div className="flex items-center justify-between mt-2">
        <StarRating rating={course.rating} />
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          {course.city}
        </div>
      </div>
      <Link
        to={`/state/${course.state}/course/${course.id}`}
        className="mt-4 block w-full text-center text-sm font-semibold text-white bg-emerald-500 rounded-lg py-2.5 hover:bg-emerald-600 transition-colors"
      >
        View Details
      </Link>
    </div>
  </div>
);

// Card used on state/city listing pages - with image
export const ListingCard = ({ course }) => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-[box-shadow,transform] duration-200 flex flex-col">
    <div className="h-40 overflow-hidden">
      <img src={course.image} alt={course.name} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-base font-bold text-gray-900 leading-snug">{course.name}</h3>
      <div className="flex items-center gap-3 mt-2">
        <StarRating rating={course.rating} />
        <span className="text-xs text-gray-400">({course.reviewCount} reviews)</span>
      </div>
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
        <MapPin className="w-3.5 h-3.5" />
        {course.city}
      </div>
      <Link
        to={`/state/${course.state}/course/${course.id}`}
        className="mt-4 block w-full text-center text-sm font-medium text-gray-900 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition-colors"
      >
        View Details
      </Link>
    </div>
  </div>
);
