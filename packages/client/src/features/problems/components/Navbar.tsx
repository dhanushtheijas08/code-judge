import {
  Bell,
  ChevronDown,
  Code2,
  Search,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router";

const NAV_LINKS = [
  { label: "Problems", href: "/problems" },
  { label: "Explore", href: "/explore" },
  { label: "Contest", href: "/contest" },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Code2 className="size-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-base tracking-tight">
                CodeJudge
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Bell */}
            <button className="relative flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full ring-1 ring-card" />
            </button>

            {/* Avatar */}
            <button className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg hover:bg-accent transition-colors group">
              <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-primary to-secondary-foreground rounded-full">
                <User className="size-3.5 text-primary-foreground" />
              </div>
              <ChevronDown className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
