import React, { useEffect, useState, useMemo } from "react";
import { getLeaderboard } from "../../services/studentService";
import { CardSkeleton, TableRowSkeleton } from "../ui/Skeleton";
import PortalPage from "../shared/PortalPage";
import { 
  Globe, 
  MapPin, 
  School, 
  Award, 
  Crown, 
  Medal, 
  Sparkles, 
  Search, 
  Flame, 
  TrendingUp,
  Filter
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  id?: string | number;
  student_name?: string;
  name?: string;
  score?: number;
  predicted_score?: number;
  xp_points?: number;
  xpPoints?: number;
  streak_days?: number;
}

const REGIONS = [
  "My Region",
  "Addis Ababa",
  "Oromia",
  "Amhara",
  "Tigray",
  "Sidama",
  "Dire Dawa",
  "Harari",
  "Somali",
  "Afar",
  "Benishangul-Gumuz",
  "Gambela"
];

export default function Leaderboard(): React.ReactElement {
  const [scope, setScope] = useState<"national" | "regional" | "school">("national");
  const [selectedRegion, setSelectedRegion] = useState("My Region");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    const regionParam = scope === "regional" && selectedRegion !== "My Region" ? selectedRegion : undefined;
    getLeaderboard(scope, regionParam)
      .then((res) => {
        if (!active) return;
        const raw = res.data ?? res;
        const list = Array.isArray(raw) ? raw : (raw?.nationalRankings || raw?.rankings || raw?.data || []);
        setRows(Array.isArray(list) ? list : []);
      })
      .catch(() => { if (active) { setRows([]); setLoadError(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [scope, selectedRegion, reloadToken]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const name = (r.student_name || r.name || "").toLowerCase();
      const q = searchQuery.toLowerCase();
      return name.includes(q);
    });
  }, [rows, searchQuery]);

  const topThree = useMemo(() => filteredRows.slice(0, 3), [filteredRows]);
  const otherRows = useMemo(() => filteredRows.slice(3), [filteredRows]);

  const scoreOf = (entry: LeaderboardEntry) => entry.score ?? entry.predicted_score;
  const xpOf = (entry: LeaderboardEntry) => entry.xp_points ?? entry.xpPoints;

  return (
    <PortalPage className="space-y-6">

      <div className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold border border-amber-500/20 mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Leaderboard</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#FDFBF7] tracking-tight">
              Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-[#A89C90] mt-1 max-w-2xl">
              Learners appear anonymously. Rankings are ordered by recorded XP points.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-[#201815] p-1.5 rounded-2xl border border-stone-200/80 self-start md:self-auto">
            <button
              onClick={() => setScope("national")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                scope === "national"
                  ? "bg-white dark:bg-[#261E1A] text-stone-950 shadow-sm"
                  : "text-stone-600 dark:text-[#E7E0D6] hover:text-stone-900"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-[#881337] dark:text-[#FBBF24]" />
              <span>National</span>
            </button>
            <button
              onClick={() => setScope("regional")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                scope === "regional"
                  ? "bg-white dark:bg-[#261E1A] text-stone-950 shadow-sm"
                  : "text-stone-600 dark:text-[#E7E0D6] hover:text-stone-900"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Regional</span>
            </button>
            <button
              onClick={() => setScope("school")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                scope === "school"
                  ? "bg-white dark:bg-[#261E1A] text-stone-950 shadow-sm"
                  : "text-stone-600 dark:text-[#E7E0D6] hover:text-stone-900"
              }`}
            >
              <School className="w-3.5 h-3.5 text-[#881337] dark:text-[#FBBF24]" />
              <span>My school</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-stone-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 dark:text-[#A89C90] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anonymous participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs bg-stone-50 dark:bg-[#1C1512] focus:bg-white focus:border-amber-500 outline-none transition-colors"
            />
          </div>

          {scope === "regional" && (
            <div className="w-full sm:w-auto flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400 dark:text-[#A89C90]" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs bg-white dark:bg-[#261E1A] text-stone-800 dark:text-[#FDFBF7] font-semibold focus:border-amber-500 outline-none cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <CardSkeleton count={3} />
          <TableRowSkeleton count={6} />
        </div>
      ) : loadError ? (
        <div role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <p className="text-sm font-semibold text-rose-800 dark:text-rose-100">Rankings could not be loaded.</p>
          <p className="mt-1 text-xs text-rose-700 dark:text-rose-200">Check your connection and try again.</p>
          <button type="button" onClick={() => setReloadToken((token) => token + 1)} className="mt-4 min-h-10 rounded-lg border border-rose-300 px-4 text-xs font-semibold text-rose-800 dark:border-rose-800 dark:text-rose-100">Try again</button>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10">
          <p className="text-sm font-bold text-stone-800 dark:text-[#FDFBF7]">No candidates found</p>
              <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-1">{searchQuery ? "Try another search." : "No ranking records are available for this view yet."}</p>
        </div>
      ) : (
        <>

          {topThree.length >= 3 && !searchQuery && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">

              <div className="bg-gradient-to-b from-stone-50 to-white rounded-3xl border border-stone-200 dark:border-white/10 p-6 shadow-xs relative order-2 md:order-1 hover:border-stone-300 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-stone-200 dark:bg-white/10 text-stone-800 dark:text-[#FDFBF7] text-[11px] font-bold border border-stone-300 dark:border-white/20 flex items-center gap-1 shadow-2xs">
                  <Medal className="w-3.5 h-3.5 text-stone-600 dark:text-[#E7E0D6]" />
                  <span>2nd Place</span>
                </div>
                <div className="text-center pt-2">
                  <div className="w-14 h-14 rounded-2xl bg-stone-200 dark:bg-white/10 text-stone-700 dark:text-[#E7E0D6] font-sans text-xl font-bold flex items-center justify-center mx-auto shadow-inner mb-3">
                    {(topThree[1].student_name || topThree[1].name || "S")[0]}
                  </div>
                  <h3 className="font-bold text-stone-900 dark:text-[#FDFBF7] text-sm truncate">
                    {topThree[1].student_name || topThree[1].name}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-[#A89C90] truncate mt-0.5">
                    Anonymous participant
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-white/10 flex items-center justify-center gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 dark:text-[#A89C90] block">Predicted score</span>
                      <strong className="text-emerald-700 font-bold">{scoreOf(topThree[1]) ?? "Not available"}</strong>
                    </div>
                    <div className="h-6 w-px bg-stone-100 dark:bg-[#201815]" />
                    <div>
                      <span className="text-[10px] text-stone-400 dark:text-[#A89C90] block">Mastery XP</span>
                      <strong className="text-[#881337] dark:text-[#FBBF24] font-bold">{xpOf(topThree[1]) ?? "—"} XP</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl border-2 border-amber-400/80 p-6 shadow-md relative order-1 md:order-2 md:-translate-y-2 hover:border-amber-500 transition-all">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-bold shadow flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-stone-950" />
                  <span>{scope === "national" ? "Top national rank" : "Top rank"}</span>
                </div>
                <div className="text-center pt-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 font-sans text-2xl font-bold flex items-center justify-center mx-auto shadow-md mb-3 ring-4 ring-amber-100">
                    {(topThree[0].student_name || topThree[0].name || "N")[0]}
                  </div>
                  <h3 className="font-bold text-stone-950 text-base truncate">
                    {topThree[0].student_name || topThree[0].name}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-[#E7E0D6] font-medium truncate mt-0.5">
                    Anonymous participant
                  </p>
                  <div className="mt-4 pt-3.5 border-t border-amber-200/50 flex items-center justify-center gap-5 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 dark:text-[#A89C90] block">Predicted score</span>
                      <strong className="text-emerald-700 text-sm font-bold">{scoreOf(topThree[0]) ?? "Not available"}</strong>
                    </div>
                    <div className="h-7 w-px bg-amber-200/50" />
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 dark:text-[#A89C90] block">Mastery XP</span>
                      <strong className="text-[#881337] dark:text-[#FBBF24] text-sm font-bold">{xpOf(topThree[0]) ?? "—"} XP</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-amber-900/5 to-white rounded-3xl border border-amber-800/20 p-6 shadow-xs relative order-3 md:order-3 hover:border-amber-800/30 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 flex items-center gap-1 shadow-2xs">
                  <Medal className="w-3.5 h-3.5 text-amber-800" />
                  <span>3rd Place</span>
                </div>
                <div className="text-center pt-2">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 font-sans text-xl font-bold flex items-center justify-center mx-auto shadow-inner mb-3">
                    {(topThree[2].student_name || topThree[2].name || "T")[0]}
                  </div>
                  <h3 className="font-bold text-stone-900 dark:text-[#FDFBF7] text-sm truncate">
                    {topThree[2].student_name || topThree[2].name}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-[#A89C90] truncate mt-0.5">
                    Anonymous participant
                  </p>
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-white/10 flex items-center justify-center gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 dark:text-[#A89C90] block">Predicted score</span>
                      <strong className="text-emerald-700 font-bold">{scoreOf(topThree[2]) ?? "Not available"}</strong>
                    </div>
                    <div className="h-6 w-px bg-stone-100 dark:bg-[#201815]" />
                    <div>
                      <span className="text-[10px] text-stone-400 dark:text-[#A89C90] block">Mastery XP</span>
                      <strong className="text-[#881337] dark:text-[#FBBF24] font-bold">{xpOf(topThree[2]) ?? "—"} XP</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-[#261E1A] rounded-3xl border border-stone-200 dark:border-white/10 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-[#E7E0D6] uppercase tracking-wider">
                Ranked Candidates ({filteredRows.length})
              </span>
              <span className="text-xs text-stone-400 dark:text-[#A89C90]">
                Sorted by XP points
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50/70 text-stone-500 dark:text-[#A89C90] font-bold uppercase tracking-wider text-[11px] border-b border-stone-100 dark:border-white/10">
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Streak</th>
                    <th className="py-3 px-4">XP Points</th>
                <th className="py-3 px-4 text-right">Predicted score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredRows.map((r, idx) => {
                    const displayRank = r.rank || idx + 1;

                    return (
                      <tr
                        key={r.id || `${r.student_name}-${idx}`}
                        className="transition-colors hover:bg-stone-50/60"
                      >
                        <td className="py-3.5 px-4 text-center">
                          {displayRank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-stone-950 font-bold text-[11px] shadow-2xs">
                              1
                            </span>
                          ) : displayRank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-300 text-stone-800 dark:text-[#FDFBF7] font-bold text-[11px]">
                              2
                            </span>
                          ) : displayRank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-800/20 text-amber-900 font-bold text-[11px]">
                              3
                            </span>
                          ) : (
                            <span className="font-mono text-stone-400 dark:text-[#A89C90] font-semibold">#{displayRank}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 dark:text-[#FDFBF7]">
                              {r.student_name || r.name || "Student"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 dark:text-[#E7E0D6]">
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span>{r.streak_days ?? "—"}{r.streak_days == null ? "" : "d"}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#881337] dark:text-[#FBBF24]">
                          {xpOf(r) ?? "—"} XP
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-700 text-sm">
                          {scoreOf(r) ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </PortalPage>
  );
}
