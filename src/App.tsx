import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/layout/footer";
import Home from "./pages/Home";
import ScrollExpandSection from "./pages/ProjectDetail";
import Work from "./pages/Work";
import About from "./pages/About";
import ScrollToTop from "./ScrollToTop";

export default function App() {
  return (
    <BrowserRouter basename="/lex_david">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/detail" element={<ScrollExpandSection />} />
        <Route path="/work" element={<Work />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
