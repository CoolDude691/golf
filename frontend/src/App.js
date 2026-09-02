import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import StatePage from "./pages/StatePage";
import CoursePage from "./pages/CoursePage";
import TopRated from "./pages/TopRated";
import StatesIndex from "./pages/StatesIndex";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PublicLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/states" element={<PublicLayout><StatesIndex /></PublicLayout>} />
          <Route path="/top-rated" element={<PublicLayout><TopRated /></PublicLayout>} />
          <Route path="/state/:stateCode" element={<PublicLayout><StatePage /></PublicLayout>} />
          <Route path="/state/:stateCode/course/:courseId" element={<PublicLayout><CoursePage /></PublicLayout>} />
          <Route path="/state/:stateCode/:citySlug" element={<PublicLayout><StatePage /></PublicLayout>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
