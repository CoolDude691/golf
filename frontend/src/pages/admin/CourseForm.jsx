import React, { useState } from "react";
import { X } from "lucide-react";

const empty = {
  name: "",
  city: "",
  state: "fl",
  rating: 4.5,
  reviewCount: 0,
  address: "",
  phone: "",
  website: "",
  priceRange: "$8 - $14 per round",
  description: "",
  image: "",
  featured: false,
};

const CourseForm = ({ course, states, onSave, onClose }) => {
  const [form, setForm] = useState(course ? { ...course } : { ...empty });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      rating: Math.min(5, Math.max(0, parseFloat(form.rating) || 0)),
      reviewCount: parseInt(form.reviewCount, 10) || 0,
      hours: form.hours || {
        Monday: "10:00 AM - 9:00 PM",
        Tuesday: "10:00 AM - 9:00 PM",
        Wednesday: "10:00 AM - 9:00 PM",
        Thursday: "10:00 AM - 9:00 PM",
        Friday: "10:00 AM - 11:00 PM",
        Saturday: "9:00 AM - 11:00 PM",
        Sunday: "9:00 AM - 8:00 PM",
      },
    });
  };

  const input =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="course-form-modal">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900">
            {course ? "Edit Course" : "Add New Course"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Name *</label>
            <input required data-testid="course-form-name" className={input} value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
              <input required data-testid="course-form-city" className={input} value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
              <select data-testid="course-form-state" className={input} value={form.state} onChange={(e) => set("state", e.target.value)}>
                {states.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating (0-5)</label>
              <input
                type="number" step="0.1" min="0" max="5"
                className={input}
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Review Count</label>
              <input
                type="number" min="0"
                className={input}
                value={form.reviewCount}
                onChange={(e) => set("reviewCount", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <input className={input} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Range</label>
              <input className={input} value={form.priceRange} onChange={(e) => set("priceRange", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
            <input className={input} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
            <input className={input} value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://... (leave blank for random)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea rows={4} data-testid="course-form-description" className={input} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-emerald-500"
            />
            <span className="text-sm font-medium text-gray-700">Mark as Featured Course</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="course-form-submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
            >
              {course ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
