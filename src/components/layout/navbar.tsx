import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import logo from "./../../assets/logo.png";

export default function Navbar({ menuOpen, setMenuOpen }: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
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
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-4 py-6 text-white">
      <div className="max-w-site mx-auto flex justify-between items-center">
        <Link to={"/"} className="text-navbar font-primary tracking-widest">
          <img
            src={logo}
            className="w-[40px] h-[30px] xl:w-[130px] xl:h-[70px] lg:w-[80px] lg:h-[50px]"
            alt=""
          />
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden text-white font-bold md:text-white"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex whitespace-nowrap items-center justify-center w-full lg:pl-7 lg:gap-[20px] xl:gap-[50px]">
          <Link to="/about" className="group flex flex-row gap-4">
            <h1 className="text-navbar uppercase font-primary tracking-widest transition-transform duration-300 group-hover:translate-x-3">
              About
            </h1>
          </Link>

          <Link to="/work" className="group flex flex-row gap-4">
            <span className="text-power font-secondary opacity-80">Studio</span>

            <h1 className="text-navbar uppercase font-primary tracking-widest transition-transform duration-300 group-hover:translate-x-3">
              Work
            </h1>
          </Link>

          <button
            onClick={() => scrollToSection("ourservice")}
            className="group flex flex-row gap-4"
          >
            <span className="text-power font-secondary opacity-80">
              Select{" "}
            </span>
            <h1 className="text-navbar uppercase font-primary tracking-widest transition-transform duration-300 group-hover:translate-x-3">
              Projects
            </h1>
          </button>

          <button
            onClick={() => scrollToSection("faqsection")}
            className="group flex shrink-0 flex-row gap-2"
          >
            <span className="text-power font-secondary opacity-80">Client</span>
            <h1 className="text-navbar uppercase font-primary transition-transform duration-300 group-hover:translate-x-2">
              Faq
            </h1>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[999]  bg-[#f4f4f2] text-black flex flex-col px-6 py-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-navbar font-poppins  "
            >
              <img src={logo} className="w-[40px] h-[30px]" alt="" />
            </button>
            <button
              className="font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="mt-10 text-center flex flex-col">
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-primary py-5 border-b uppercase tracking-[0.1em]"
            >
              About
            </Link>
            <Link
              to="/work"
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-primary py-5 border-b uppercase tracking-[0.1em]"
            >
              Works
            </Link>
            <button
              className="text-3xl font-primary py-5 border-b uppercase tracking-[0.1em]"
              onClick={() => scrollToSection("ourservice")}
            >
              Services
            </button>
            <button
              className="text-3xl font-primary py-5 border-b uppercase tracking-[0.1em]"
              onClick={() => scrollToSection("faqsection")}
            >
              FAQ
            </button>
          </div>

          <div className="mt-auto text-center text-sm space-y-2">
            <p>TERMS & CONDITIONS</p>
            <p>DISCLAIMER</p>
            <p>PRIVACY POLICY</p>
          </div>
        </div>
      )}
    </nav>
  );
}
