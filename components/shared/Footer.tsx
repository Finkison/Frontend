import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Send, Linkedin } from "lucide-react";
import FinkisonLogo from "./FinkisonLogo";
import Button from "../ui/Button";
import { SITE_CONTENT } from "../../content/siteContent";

export default function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3500);
    }
  };

  return (
    <footer className="w-full bg-[#FAF8F5] text-stone-600 border-t border-[#E7E0D6] dark:bg-[#1C1512] dark:text-stone-300 dark:border-white/10">
      {/* Main Footer Content */}
      <div className="container mx-auto py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Logo + Tagline + Social */}
          <div className="col-span-2 md:col-span-1">
            <FinkisonLogo variant="horizontal" size="md" to="/" />
            <p className="text-xs text-neutral-600 dark:text-stone-400 mt-3 leading-relaxed">
              {SITE_CONTENT.footer.tagline}
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://facebook.com/finkison"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-200 dark:bg-[#261E1A] hover:bg-[#881337] hover:text-white flex items-center justify-center transition-colors text-stone-700 dark:text-stone-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://t.me/finkison_support"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-200 dark:bg-[#261E1A] hover:bg-[#881337] hover:text-white flex items-center justify-center transition-colors text-stone-700 dark:text-stone-300"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com/company/finkison"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-200 dark:bg-[#261E1A] hover:bg-[#881337] hover:text-white flex items-center justify-center transition-colors text-stone-700 dark:text-stone-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wider mb-3">
              {SITE_CONTENT.footer.columns.platform.title}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SITE_CONTENT.footer.columns.platform.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wider mb-3">
              {SITE_CONTENT.footer.columns.solutions.title}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SITE_CONTENT.footer.columns.solutions.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Organization */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 dark:text-white uppercase tracking-wider mb-3">
              {SITE_CONTENT.footer.columns.organization.title}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SITE_CONTENT.footer.columns.organization.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              {SITE_CONTENT.footer.columns.newsletter.title}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-stone-400 mb-3 leading-relaxed">
              {SITE_CONTENT.footer.columns.newsletter.description}
            </p>
            
            {subscribed ? (
              <div className="p-3 rounded-xl bg-brand-tint border border-brand-tint-border text-brand-accent text-xs font-medium">
                {SITE_CONTENT.footer.columns.newsletter.successMessage}
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={SITE_CONTENT.footer.columns.newsletter.placeholder}
                  required
                  className="w-full h-9 px-3 text-xs rounded-md border border-stone-300 dark:border-white/20 bg-white dark:bg-[#261E1A] text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#881337] dark:focus:ring-[#FBBF24] transition-colors"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-full"
                >
                  {SITE_CONTENT.footer.columns.newsletter.button}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Section: Copyright + Legal Links */}
        <div className="pt-8 border-t border-stone-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              © {currentYear} Finkison Education Platform. All rights reserved.
            </p>
            <span className="hidden md:inline text-xs text-stone-400">•</span>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {SITE_CONTENT.footer.passingStandardStatement}
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link to="/privacy" className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="text-stone-600 dark:text-stone-400 hover:text-[#881337] dark:hover:text-[#FBBF24] transition-colors">
              Support
            </Link>
            <span className="text-stone-500 dark:text-stone-400">{SITE_CONTENT.footer.legal.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
