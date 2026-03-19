import { Link } from "react-router";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              <span className="font-bold text-2xl tracking-tight">
                CodeJudge
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
