import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUpPage from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Website */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
