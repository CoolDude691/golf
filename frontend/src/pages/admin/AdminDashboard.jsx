import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Star,
  Trophy,
  Search,
  LayoutDashboard,
  ListChecks,
  FileText,
  ExternalLink,
} from "lucide-react";
import { STATES, stateByCode } from "../../constants";
import { me, getCourses, getContent, createCourse, updateCourse, deleteCourse, updateContent, apiError } from "../../api";
import CourseForm from "./CourseForm";
import { useToast } from "../../hooks/use-toast";
import { Toaster } from "../../components/ui/toaster";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [content, setContent] = useState(null);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  }, [navigate]);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) return navigate("/admin");
    me()
      .then(() => Promise.all([getCourses(), getContent()]))
      .then(([cs, ct]) => {
        setCourses(cs);
        setContent(ct);
      })
      .catch(() => logout());
  }, [navigate, logout]);

  const fail = (err) => toast({ title: "Error", description: apiError(err), variant: "destructive" });

  const handleSave = async (data) => {
    try {
      if (editing === "new") {
        const course = await createCourse(data);
        setCourses([course, ...courses]);
        toast({ title: "Course added", description: `${course.name} has been created.` });
      } else {
        const course = await updateCourse(editing.id, data);
        setCourses(courses.map((c) => (c.id === course.id ? course : c)));
        toast({ title: "Course updated", description: `${course.name} has been saved.` });
      }
      setEditing(null);
    } catch (err) {
      fail(err);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.name}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(course.id);
      setCourses(courses.filter((c) => c.id !== course.id));
      toast({ title: "Course deleted", description: `${course.name} has been removed.` });
    } catch (err) {
      fail(err);
    }
  };

  const toggleFeatured = async (course) => {
    try {
      const updated = await updateCourse(course.id, { ...course, featured: !course.featured });
      setCourses(courses.map((c) => (c.id === course.id ? updated : c)));
    } catch (err) {
      fail(err);
    }
  };

  const saveContent = async () => {
    try {
      setContent(await updateContent(content));
      toast({ title: "Content saved", description: "Homepage content has been updated." });
    } catch (err) {
      fail(err);
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.city.toLowerCase().includes(filter.toLowerCase())
  );

  const featuredCount = courses.filter((c) => c.featured).length;
  const avgRating = courses.length
    ? (courses.reduce((a, c) => a + Number(c.rating || 0), 0) / courses.length).toFixed(2)
    : 0;

  const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      <Toaster />
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-500" />
            <span className="text-lg font-extrabold text-gray-900">MiniGolf USA</span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View Site
            </Link>
            <button
              onClick={logout}
              data-testid="admin-logout-button"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "courses", label: "Courses", icon: ListChecks },
            { id: "content", label: "Site Content", icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-testid={`admin-tab-${t.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-300"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <ListChecks className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="text-sm text-gray-500">Total Courses</div>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mt-3" data-testid="stat-total-courses">{courses.length}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-sm text-gray-500">Featured Courses</div>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mt-3" data-testid="stat-featured-courses">{featuredCount}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mt-3" data-testid="stat-avg-rating">{avgRating}</div>
              </div>
            </div>
          </div>
        )}

        {tab === "courses" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight" data-testid="manage-courses-heading">
                Manage Courses ({filtered.length})
              </h1>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search courses..."
                    data-testid="admin-course-search"
                    className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  onClick={() => setEditing("new")}
                  data-testid="add-course-button"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Course
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="admin-courses-table">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-5 py-3 font-semibold">Course</th>
                      <th className="px-5 py-3 font-semibold">Location</th>
                      <th className="px-5 py-3 font-semibold">Rating</th>
                      <th className="px-5 py-3 font-semibold">Reviews</th>
                      <th className="px-5 py-3 font-semibold">Featured</th>
                      <th className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors" data-testid={`course-row-${c.id}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img src={c.image} alt={c.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <span className="font-semibold text-gray-900">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-600">
                          {c.city}, {stateByCode(c.state)?.name || c.state}
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            {c.rating}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{c.reviewCount}</td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => toggleFeatured(c)}
                            data-testid={`toggle-featured-${c.id}`}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                              c.featured
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {c.featured ? "Featured" : "Standard"}
                          </button>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="inline-flex gap-1">
                            <button
                              onClick={() => setEditing(c)}
                              data-testid={`edit-course-${c.id}`}
                              className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              aria-label="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(c)}
                              data-testid={`delete-course-${c.id}`}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                          No courses match your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "content" && content && (
          <div className="max-w-3xl">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">Homepage Content</h1>
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Title (line 1)</label>
                <input type="text" value={content.heroTitle1} data-testid="content-hero-title1"
                  onChange={(e) => setContent({ ...content, heroTitle1: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Title (line 2, green)</label>
                <input type="text" value={content.heroTitle2} data-testid="content-hero-title2"
                  onChange={(e) => setContent({ ...content, heroTitle2: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hero Subtitle</label>
                <textarea rows={2} value={content.heroSubtitle} data-testid="content-hero-subtitle"
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Intro Title</label>
                <input type="text" value={content.introTitle} data-testid="content-intro-title"
                  onChange={(e) => setContent({ ...content, introTitle: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Intro Paragraphs (separated by blank line)
                </label>
                <textarea rows={10} value={content.introParagraphs.join("\n\n")} data-testid="content-intro-paragraphs"
                  onChange={(e) =>
                    setContent({ ...content, introParagraphs: e.target.value.split(/\n\n+/).filter(Boolean) })
                  }
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">"Why Choose" Title</label>
                <input type="text" value={content.whyTitle} data-testid="content-why-title"
                  onChange={(e) => setContent({ ...content, whyTitle: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  "Why Choose" Paragraphs (separated by blank line)
                </label>
                <textarea rows={6} value={content.whyParagraphs.join("\n\n")} data-testid="content-why-paragraphs"
                  onChange={(e) =>
                    setContent({ ...content, whyParagraphs: e.target.value.split(/\n\n+/).filter(Boolean) })
                  }
                  className={inputCls} />
              </div>
              <button
                onClick={saveContent}
                data-testid="save-content-button"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Save Content
              </button>
            </div>
          </div>
        )}
      </div>

      {editing && (
        <CourseForm
          course={editing === "new" ? null : editing}
          states={STATES}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
