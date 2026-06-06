import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "./../../assets/logo.png";
export default function StickyNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 300);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 py-3 xl:pt-6 bg-white/85 backdrop-blur-md">
        <div className="max-w-site mx-auto w-full flex items-center justify-between">
          {/* LOGO */}
          <Link to={"/"} className="text-navbar font-primary tracking-widest">
            <img
              src={logo}
              className="w-[40px] h-[30px] xl:w-[130px] xl:h-[70px] lg:w-[100px] lg:h-[50px]"
              alt=""
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center justify-center w-full lg:pl-7 lg:gap-[10px] xl:gap-[40px]">
            <Link to="/about" className="group">
              <h1 className="text-navbar uppercase font-primary tracking-widest transition-transform duration-300 group-hover:translate-x-3">
                About
              </h1>
            </Link>

            <Link to="/work" className="group flex flex-row gap-4">
              <span className="text-power font-secondary opacity-90">
                Studio
              </span>
              <h1 className="text-navbar uppercase font-primary tracking-widest transition-transform duration-300 group-hover:translate-x-3">
                Work
              </h1>
            </Link>

            <button
              onClick={() => scrollToSection("ourservice")}
              className="group flex flex-row gap-4"
            >
              <span className="text-power font-secondary opacity-90">
                Select{" "}
              </span>
              <h1 className="text-navbar uppercase font-primary tracking-widest transition-transform duration-300 group-hover:translate-x-3">
                Projects
              </h1>
            </button>

            <button
              onClick={() => scrollToSection("faqsection")}
              className="group flex flex-row gap-4"
            >
              <span className="text-power font-secondary opacity-90">
                Client
              </span>
              <h1 className="text-navbar uppercase font-primary tracking-widest transition-transform duration-300 group-hover:translate-x-2">
                FAQ
              </h1>
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="lg:hidden text-black text-xl"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* SMOKE LAYER */}
      <div className="relative w-full h-[30px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-transparent" />
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-[999] bg-[#f4f4f2] text-black flex flex-col px-6 py-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-navbar font-primary"
            >
              <img src={logo} className="w-[40px] h-[30px]" alt="" />
            </button>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="mt-10 flex pt-10 flex-col">
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="text-3xl font-primary uppercase text-center py-5 border-b tracking-[0.1em]"
            >
              About
            </Link>
            <Link
              to="/work"
              onClick={() => setOpen(false)}
              className="text-3xl font-primary uppercase text-center py-5 border-b tracking-[0.1em]"
            >
              Works
            </Link>
            <button
              className="text-3xl font-primary uppercase py-5 border-b tracking-[0.1em]"
              onClick={() => scrollToSection("ourservice")}
            >
              Services
            </button>
            <button
              className="text-3xl font-primary uppercase py-5 tracking-[0.1em]"
              onClick={() => scrollToSection("faqsection")}
            >
              Faq
            </button>
          </div>

          <div className="mt-auto text-center  text-sm space-y-2 ">
            <p>TERMS & CONDITIONS</p>
            <p>DISCLAIMER</p>
            <p>PRIVACY POLICY</p>
          </div>
        </div>
      )}
    </div>
  );
}
