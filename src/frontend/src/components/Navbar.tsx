import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const qc = useQueryClient();
  const { data: isAdmin } = useIsAdmin();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (e: any) {
        if (e.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
      <nav className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/assets/uploads/WhatsApp-Image-2026-03-12-at-11.05.42-AM-1.jpeg"
            alt="NK Real Estate & Construction Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            data-ocid="nav.home.link"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            Home
          </Link>
          <Link
            to="/listings"
            data-ocid="nav.listings.link"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive("/listings")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            Browse Listings
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              data-ocid="nav.admin.link"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/admin")
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAuth}
              data-ocid="nav.logout.button"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleAuth}
              disabled={isLoggingIn}
              data-ocid="nav.login.button"
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? "Signing in..." : "Login"}
            </Button>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-md"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
          <Link
            to="/"
            data-ocid="nav.home.link"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary"
          >
            Home
          </Link>
          <Link
            to="/listings"
            data-ocid="nav.listings.link"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary"
          >
            Browse Listings
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              data-ocid="nav.admin.link"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary"
            >
              Admin
            </Link>
          )}
          <div className="pt-2 border-t border-border">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAuth}
                data-ocid="nav.logout.button"
                className="w-full gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleAuth}
                disabled={isLoggingIn}
                data-ocid="nav.login.button"
                className="w-full gap-2 bg-primary"
              >
                <LogIn className="w-4 h-4" />{" "}
                {isLoggingIn ? "Signing in..." : "Login"}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
