import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#resources", label: "Resources" },
  { href: "/#priorities", label: "Priorities" },
  { href: "/#team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/donate", label: "Donate" },
  { href: "/#issues", label: "Voice Issues" },
  { href: "/#contact", label: "Contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textClass = scrolled || !isHome ? "text-foreground" : "text-primary-foreground/90";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-smooth ${
        scrolled || !isHome ? "bg-background/85 backdrop-blur-lg shadow-soft" : "bg-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-lg bg-earth-gradient grid place-items-center text-primary-foreground font-display font-bold">C</span>
          <span className={`font-display font-bold text-lg ${textClass}`}>CFBUF</span>
        </Link>

        <div className="hidden lg:flex items-center gap-5">
          {links.map((l) => (
            l.href.startsWith("/#") ? (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-smooth hover:text-accent ${textClass}`}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={l.href}
                className={`text-sm font-medium transition-smooth hover:text-accent ${
                  location.pathname === l.href ? "text-accent" : textClass
                }`}
              >
                {l.label}
              </Link>
            )
          ))}
        </div>

        <Button asChild variant="hero" size="sm" className="hidden md:inline-flex">
          <a href="/#appointment">Book Appointment</a>
        </Button>

        <button
          className={`lg:hidden ${scrolled || !isHome ? "text-foreground" : "text-primary-foreground"}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              l.href.startsWith("/#") ? (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground py-2.5 px-2 rounded-lg hover:bg-secondary transition-smooth"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground py-2.5 px-2 rounded-lg hover:bg-secondary transition-smooth"
                >
                  {l.label}
                </Link>
              )
            ))}
            <div className="pt-2 border-t border-border mt-1">
              <a
                href="/#appointment"
                onClick={() => setOpen(false)}
                className="block text-center py-2.5 px-4 rounded-lg bg-accent text-accent-foreground text-sm font-medium"
              >
                Book Appointment
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
