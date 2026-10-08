import React, { useState, useMemo } from "react";
import { 
  X, 
  Search, 
  Atom, 
  Calculator, 
  FlaskConical, 
  Sparkles, 
  Copy, 
  Check,
  BookOpen
} from "lucide-react";
import MathText from "../shared/MathText";

interface FormulaItem {
  id: string;
  category: "constants" | "physics" | "math" | "chemistry";
  title: string;
  formula: string;
  description: string;
  unitsOrNotes?: string;
}

const FORMULA_DATABASE: FormulaItem[] = [
  // Physical Constants
  {
    id: "const-g",
    category: "constants",
    title: "Acceleration Due to Gravity",
    formula: "g = 9.8 \\text{ m/s}^2",
    description: "Standard acceleration due to Earth's gravity at sea level.",
    unitsOrNotes: "9.80665 m/s² (approx. 9.8 or 10 in exam drills)"
  },
  {
    id: "const-c",
    category: "constants",
    title: "Speed of Light in Vacuum",
    formula: "c = 3.00 \\times 10^8 \\text{ m/s}",
    description: "Universal physical constant fundamental in electromagnetism & relativity.",
    unitsOrNotes: "2.9979 \\times 10^8 m/s"
  },
  {
    id: "const-h",
    category: "constants",
    title: "Planck Constant",
    formula: "h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}",
    description: "Relates the photon energy to its frequency (E = hf).",
    unitsOrNotes: "6.626 \\times 10^{-34} \\text{ m}^2\\text{kg}/\\text{s}"
  },
  {
    id: "const-g-univ",
    category: "constants",
    title: "Universal Gravitational Constant",
    formula: "G = 6.674 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2",
    description: "Constant in Newton's Law of Universal Gravitation.",
    unitsOrNotes: "F = G \\frac{m_1 m_2}{r^2}"
  },
  {
    id: "const-na",
    category: "constants",
    title: "Avogadro Constant",
    formula: "N_A = 6.022 \\times 10^{23} \\text{ mol}^{-1}",
    description: "Number of constituent particles in one mole of a substance.",
    unitsOrNotes: "6.022 \\times 10^{23} \\text{ particles/mol}"
  },
  {
    id: "const-r",
    category: "constants",
    title: "Universal Gas Constant",
    formula: "R = 8.314 \\text{ J}/(\\text{mol}\\cdot\\text{K})",
    description: "Ideal gas constant in PV = nRT.",
    unitsOrNotes: "0.0821 \\text{ L}\\cdot\\text{atm}/(\\text{mol}\\cdot\\text{K})"
  },
  {
    id: "const-e",
    category: "constants",
    title: "Elementary Charge",
    formula: "e = 1.602 \\times 10^{-19} \\text{ C}",
    description: "Magnitude of electric charge carried by a single proton or electron.",
    unitsOrNotes: "Coupled with electron mass m_e = 9.109 \\times 10^{-31} kg"
  },
  {
    id: "const-eps0",
    category: "constants",
    title: "Permittivity of Free Space",
    formula: "\\varepsilon_0 = 8.854 \\times 10^{-12} \\text{ F/m}",
    description: "Electric constant in Coulomb's Law and vacuum capacitance.",
    unitsOrNotes: "k = \\frac{1}{4\\pi\\varepsilon_0} \\approx 8.99 \\times 10^9 \\text{ N}\\cdot\\text{m}^2/\\text{C}^2"
  },

  // Physics Mechanics & Electromagnetism
  {
    id: "phys-kin-1",
    category: "physics",
    title: "Velocity-Time Relation",
    formula: "v = u + at",
    description: "Final velocity under uniform linear acceleration.",
    unitsOrNotes: "u = initial velocity, a = acceleration, t = time"
  },
  {
    id: "phys-kin-2",
    category: "physics",
    title: "Displacement-Time Relation",
    formula: "s = ut + \\frac{1}{2}at^2",
    description: "Linear displacement under uniform acceleration.",
    unitsOrNotes: "s = displacement, u = initial velocity"
  },
  {
    id: "phys-kin-3",
    category: "physics",
    title: "Torricelli Equation (No Time)",
    formula: "v^2 = u^2 + 2as",
    description: "Relates final velocity directly to displacement without explicit time.",
    unitsOrNotes: "Kinematics with constant acceleration"
  },
  {
    id: "phys-work-energy",
    category: "physics",
    title: "Work-Kinetic Energy Theorem",
    formula: "W = \\Delta KE = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2",
    description: "Net work done on an object equals the change in its kinetic energy.",
    unitsOrNotes: "KE = \\frac{1}{2}mv^2, PE_{grav} = mgh"
  },
  {
    id: "phys-ohm",
    category: "physics",
    title: "Ohm's Law & Electric Power",
    formula: "V = IR, \\quad P = VI = I^2 R = \\frac{V^2}{R}",
    description: "Relationship between potential difference, current, and circuit power.",
    unitsOrNotes: "V in Volts, I in Amperes, R in Ohms, P in Watts"
  },
  {
    id: "phys-coulomb",
    category: "physics",
    title: "Coulomb's Law of Electrostatics",
    formula: "F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2}",
    description: "Electrostatic force of attraction or repulsion between two point charges.",
    unitsOrNotes: "Inverse square law for electrostatic field"
  },

  // Mathematics & Trigonometry
  {
    id: "math-quad",
    category: "math",
    title: "Quadratic Formula",
    formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    description: "Solutions of standard quadratic polynomial ax^2 + bx + c = 0.",
    unitsOrNotes: "Discriminant \\Delta = b^2 - 4ac defines nature of roots"
  },
  {
    id: "math-trig-pyth",
    category: "math",
    title: "Pythagorean Trigonometric Identities",
    formula: "\\sin^2\\theta + \\cos^2\\theta = 1, \\quad 1 + \\tan^2\\theta = \\sec^2\\theta",
    description: "Fundamental trigonometric relations on the unit circle.",
    unitsOrNotes: "1 + \\cot^2\\theta = \\csc^2\\theta"
  },
  {
    id: "math-trig-double",
    category: "math",
    title: "Double-Angle Formulas",
    formula: "\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta, \\quad \\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta",
    description: "Trigonometric expansion for double angles.",
    unitsOrNotes: "\\cos(2\\theta) = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta"
  },
  {
    id: "math-logs",
    category: "math",
    title: "Logarithmic Identities",
    formula: "\\log_b(xy) = \\log_b x + \\log_b y, \\quad \\log_b(x^k) = k\\log_b x",
    description: "Core properties for solving exponential and logarithmic equations.",
    unitsOrNotes: "\\log_b\\left(\\frac{x}{y}\\right) = \\log_b x - \\log_b y"
  },
  {
    id: "math-seq-ap",
    category: "math",
    title: "Arithmetic Progression (AP)",
    formula: "T_n = a + (n - 1)d, \\quad S_n = \\frac{n}{2}\\left(2a + (n-1)d\\right)",
    description: "nth term and partial sum for an arithmetic sequence.",
    unitsOrNotes: "a = first term, d = common difference"
  },
  {
    id: "math-seq-gp",
    category: "math",
    title: "Geometric Progression (GP)",
    formula: "T_n = a r^{n-1}, \\quad S_n = \\frac{a(1 - r^n)}{1 - r} \\quad (r \\neq 1)",
    description: "nth term and partial sum for a geometric sequence.",
    unitsOrNotes: "Infinite sum S_\\infty = \\frac{a}{1 - r} for |r| < 1"
  },

  // Chemistry Foundations
  {
    id: "chem-ideal-gas",
    category: "chemistry",
    title: "Ideal Gas Law",
    formula: "PV = nRT",
    description: "Equation of state for a hypothetical ideal gas.",
    unitsOrNotes: "P = pressure, V = volume, n = moles, R = 8.314 J/(mol K), T = Kelvin"
  },
  {
    id: "chem-molarity",
    category: "chemistry",
    title: "Molarity & Dilution Law",
    formula: "M = \\frac{n_{\\text{solute}}}{V_{\\text{solution (L)}}}, \\quad M_1 V_1 = M_2 V_2",
    description: "Molar concentration and conservation of moles during dilution.",
    unitsOrNotes: "Units in mol/L (Molar, M)"
  },
  {
    id: "chem-ph",
    category: "chemistry",
    title: "pH & Autoionization of Water",
    formula: "\\text{pH} = -\\log[H^+], \\quad \\text{pH} + \\text{pOH} = 14",
    description: "Acidity scale at standard 25°C temperature.",
    unitsOrNotes: "K_w = [H^+][OH^-] = 1.0 \\times 10^{-14} \\text{ at } 25^\\circ\\text{C}"
  },
  {
    id: "chem-gibbs",
    category: "chemistry",
    title: "Gibbs Free Energy & Spontaneity",
    formula: "\\Delta G = \\Delta H - T\\Delta S",
    description: "Thermodynamic criterion for reaction spontaneity at constant T and P.",
    unitsOrNotes: "\\Delta G < 0 \\text{ (spontaneous)}, \\Delta G = 0 \\text{ (equilibrium)}"
  }
];

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FormulaSheetModal({ isOpen, onClose }: FormulaSheetModalProps): React.ReactElement | null {
  const [activeTab, setActiveTab] = useState<"all" | "constants" | "physics" | "math" | "chemistry">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFormulas = useMemo(() => {
    return FORMULA_DATABASE.filter((item) => {
      const matchesTab = activeTab === "all" || item.category === activeTab;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.formula.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleCopy = (formula: string, id: string) => {
    navigator.clipboard?.writeText(formula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-white">
                  Formula & Constants Reference Sheet
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                  EUEE Standard
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Official national curriculum identities, formulas, and physical constants.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close formula sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Category Filter Tabs */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search constants or formulas (e.g., gravity, kinetic energy, quadratic, pH)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>All ({FORMULA_DATABASE.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("constants")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "constants"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Atom className="w-3.5 h-3.5 text-sky-400" />
              <span>Physical Constants</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("physics")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "physics"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Atom className="w-3.5 h-3.5 text-amber-400" />
              <span>Physics Mechanics & Fields</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("math")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "math"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mathematics & Trigonometry</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("chemistry")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "chemistry"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              <span>Chemistry & Solutions</span>
            </button>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredFormulas.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No formulas matched your search &ldquo;{searchQuery}&rdquo;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFormulas.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.category === "constants"
                          ? "Constant"
                          : item.category.toUpperCase()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.formula, item.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Copy formula text"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                        )}
                      </button>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">
                      {item.title}
                    </h4>

                    {/* Formula Render Container */}
                    <div className="p-3 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs sm:text-sm overflow-x-auto flex items-center justify-center min-h-[48px] shadow-2xs">
                      <MathText text={`$$${item.formula}$$`} />
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>

                  {item.unitsOrNotes && (
                    <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                      <span className="text-slate-400">Notes:</span>
                      <span className="text-slate-700 truncate max-w-[240px]">
                        {item.unitsOrNotes}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Active during national simulation drills. Does not halt exam timer.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Back to Exam
          </button>
        </div>

      </div>
    </div>
  );
}
