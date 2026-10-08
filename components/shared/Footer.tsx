import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Swords,
  Bot,
  School,
  HeartHandshake,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-800/50">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-[18px] h-[18px] text-amber-400" />
              </div>
              <div>
                <span className="font-bold text-[15px] text-white tracking-tight">
                  FINKISON
                </span>
                <p className="text-[10px] font-semibold tracking-wider uppercase text-amber-500/90 mt-0.5">
                  National Exam Platform
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 max-w-xs">
              Ethiopia's enterprise-grade learning engine. Powered by FSRS spaced repetition,
              IRT adaptive difficulty, and Socratic AI tutoring. Engineered for EUEE scores of 500+/700.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                <span>MoE Verified</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/academics?stream=natural" className="text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" /> Natural Science
                </Link>
              </li>
              <li>
                <Link to="/academics?stream=social" className="text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" /> Social Science
                </Link>
              </li>
              <li>
                <Link to="/student/practice" className="text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Bot className="w-3 h-3" /> Question Bank
                </Link>
              </li>
              <li>
                <Link to="/student/ai-tutor" className="text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Bot className="w-3 h-3" /> AI Tutor
                </Link>
              </li>
              <li>
                <Link to="/student/battle" className="text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Swords className="w-3 h-3" /> Quiz Arena
                </Link>
              </li>
            </ul>
          </div>

          {/* Stakeholders */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Institutions & Stakeholders
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/school" className="text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <School className="w-3 h-3" /> School Portal
                </Link>
              </li>
              <li>
                <Link to="/parent" className="text-xs text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <HeartHandshake className="w-3 h-3" /> Family Portal
                </Link>
              </li>
              <li>
                <Link to="/student/departments" className="text-xs text-slate-500 hover:text-amber-400 transition-colors">
                  University Pathways
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-xs text-slate-500 hover:text-amber-400 transition-colors">
                  About Finkison
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-xs text-slate-500 hover:text-amber-400 transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <span className="text-xs text-slate-600 cursor-default">Careers</span>
              </li>
              <li>
                <span className="text-xs text-slate-600 cursor-default">Privacy Policy</span>
              </li>
              <li>
                <span className="text-xs text-slate-600 cursor-default">Terms of Service</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 col-span-2 md:col-span-2 lg:col-span-1">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2.5">
              <li className="text-xs text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-slate-600 shrink-0" />
                <span>support@finkison.com</span>
              </li>
              <li className="text-xs text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-600 shrink-0" />
                <span>+251 911 000 000</span>
              </li>
              <li className="text-xs text-slate-500 flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-slate-600 shrink-0 mt-0.5" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
            </ul>

            {/* Language badges */}
            <div className="flex items-center gap-1.5 pt-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-400 border border-slate-700/50">
                English
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-400 border border-slate-700/50">
                አማርኛ
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-400 border border-slate-700/50">
                Oromoo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600 text-center sm:text-left">
            © {currentYear} Finkison Technologies. All rights reserved. Aligned with Ethiopian Ministry of Education National Curriculum.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-slate-600">Built for 🇪🇹 Ethiopia</span>
            <span className="text-[11px] text-slate-700 font-semibold flex items-center gap-1">
              <Globe className="w-3 h-3" /> EN | አማ | OM
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
