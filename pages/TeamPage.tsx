import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Mail, 
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function TeamPage(): React.ReactElement {
  const leadership = [
    {
      name: "Dr. Dawit Abebe",
      role: "Chief Academic Officer & Curriculum Chair",
      bio: "Former Ministry of Education Entrance Exam reviewer and Associate Professor at Addis Ababa University. 20+ years of Ethiopian educational leadership.",
      avatar: "DA",
      color: "bg-blue-600"
    },
    {
      name: "Sara Mengistu, MSc",
      role: "Head of AI & Adaptive Psychometrics",
      bio: "Specializes in Item Response Theory (IRT) and Socratic LLM prompt engineering for multilingual pedagogical delivery in African indigenous languages.",
      avatar: "SM",
      color: "bg-amber-600"
    },
    {
      name: "Yared Tadesse",
      role: "Director of Question Bank & Verification",
      bio: "Senior Master Physics Educator at Menelik II Secondary School. Led digitization and solution reviews of past entrance papers spanning 2012–2016 E.C.",
      avatar: "YT",
      color: "bg-emerald-600"
    },
    {
      name: "Chaltu Wakgari",
      role: "Bilingual Pedagogy Lead",
      bio: "Linguist and educator specializing in Amharic and English mathematical concept translation and national curriculum pedagogical alignment.",
      avatar: "CW",
      color: "bg-purple-600"
    }
  ];

  const advisors = [
    {
      name: "Prof. Solomon Haile",
      institution: "Addis Ababa University (AAU)",
      expertise: "Computational Psychometrics & Large-Scale Student Assessment"
    },
    {
      name: "Dr. Aster Lemma",
      institution: "Adama Science & Technology University (ASTU)",
      expertise: "STEM Curriculum Innovation & Gender Equity in Science"
    },
    {
      name: "Ato Bekele Tsegaye",
      institution: "National Educational Assessment Specialist",
      expertise: "Standardized Exam Reliability & Question Difficulty Calibration"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#0F2744] via-[#143257] to-[#0F2744] text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Users className="w-3.5 h-3.5" />
            Leadership & Advisory
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            The Educators & Engineers Behind Finkison
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            A dedicated collective of Ethiopian university professors, master secondary school teachers, and AI engineers committed to national educational equity.
          </p>
        </div>
      </section>

      {/* Leadership Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Core Team</span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">Academic & Technical Leadership</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((member, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className={`w-14 h-14 rounded-2xl ${member.color} text-white font-serif font-bold text-xl flex items-center justify-center mb-5 shadow-sm`}>
                  {member.avatar}
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-900">{member.name}</h3>
                <p className="text-xs font-semibold text-amber-600 mb-3">{member.role}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified MoE Contributor</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advisory Board */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Institutional Governance</span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">Advisory Board & Reviewers</h2>
            <p className="text-xs text-slate-500 mt-2">
              Providing independent oversight on psychometric validity and curriculum compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {advisors.map((adv, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/60">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-base text-slate-900">{adv.name}</h4>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{adv.institution}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{adv.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Authors Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-slate-900">
          Interested in Contributing Exam Solutions or Socratic Content?
        </h3>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          We welcome licensed Ethiopian high school teachers and university instructors to join our curriculum review board.
        </p>
        <div className="pt-2">
          <a
            href="mailto:curriculum@finkison.et"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-900 hover:bg-slate-950 text-white text-sm shadow"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Curriculum Board</span>
          </a>
        </div>
      </section>
    </div>
  );
}
