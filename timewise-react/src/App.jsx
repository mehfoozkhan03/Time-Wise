import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import About from "./pages/About";
import Contact from "./pages/Contact";
<<<<<<< HEAD
import SignUpPage from "./pages/Login";
=======
import BubbleCursor from "./components/BubbleArrow/bubbleArrow";
import ProgressBar from "./components/ProgressBar/progressBar"
>>>>>>> e2e7f883aefbbe8f73cb944fd8f8ce9c04c1375c

export default function App() {
  return (
    <BrowserRouter>
      <BubbleCursor />
      <ProgressBar/>
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
