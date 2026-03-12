import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-foreground text-background/80 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/assets/uploads/WhatsApp-Image-2026-03-12-at-11.05.42-AM-1.jpeg"
                alt="NK Real Estate & Construction Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-background/60 max-w-xs text-sm leading-relaxed mb-4">
              Your trusted partner for buying and selling premium land, plots,
              and commercial properties in Rajamahendravaram.
            </p>
            <div className="space-y-2 text-sm text-background/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Rajamahendravaram</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a
                  href="tel:+917093846299"
                  className="hover:text-background transition-colors"
                >
                  +91 7093846299
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a
                  href="tel:+919398442753"
                  className="hover:text-background transition-colors"
                >
                  +91 9398442753
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a
                  href="mailto:padalasai2021@gmail.com"
                  className="hover:text-background transition-colors"
                >
                  padalasai2021@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <div className="font-semibold text-background mb-3">
                Quick Links
              </div>
              <ul className="space-y-2 text-background/60">
                <li>
                  <a
                    href="/"
                    className="hover:text-background transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/listings"
                    className="hover:text-background transition-colors"
                  >
                    Browse Listings
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-background mb-3">
                Property Types
              </div>
              <ul className="space-y-2 text-background/60">
                <li>Agricultural Land</li>
                <li>Residential Plots</li>
                <li>Commercial Land</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-background/15 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-background/50">
          <span>
            © {year} NK Real Estate & Construction. All rights reserved.
          </span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="underline hover:text-background/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
