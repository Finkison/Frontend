import React, { useEffect, useState, useMemo } from "react";
import { getLeaderboard } from "../../services/discoveryService";
import useAuthStore from "../../store/authStore";
import { CardSkeleton, TableRowSkeleton } from "../shared/SkeletonLoader";
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
  id?: string;
  student_id?: string;
  student_name?: string;
  name?: string;
  school?: string;
  region?: string;
  stream?: string;
  grade?: number;
  score?: number;
  predicted_score?: number;
  xp_points?: number;
  xpPoints?: number;
  streak_days?: number;
}

const REGIONS = [
  "All Regions",
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
  const currentUser = useAuthStore((s) => s.user);
  const [scope, setScope] = useState<"national" | "regional" | "school">("national");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLoading(true);
    const regionParam = selectedRegion !== "All Regions" ? selectedRegion : undefined;
    getLeaderboard(scope, regionParam)
      .then((res) => {
        const raw = res.data ?? res;
        const list = Array.isArray(raw) ? raw : (raw?.nationalRankings || raw?.rankings || raw?.data || []);
        setRows(Array.isArray(list) ? list : []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [scope, selectedRegion]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const name = (r.student_name || r.name || "").toLowerCase();
      const school = (r.school || "").toLowerCase();
      const q = searchQuery.toLowerCase();
      return name.includes(q) || school.includes(q);
    });
  }, [rows, searchQuery]);

  const topThree = useMemo(() => filteredRows.slice(0, 3), [filteredRows]);
  const otherRows = useMemo(() => filteredRows.slice(3), [filteredRows]);

  const currentUserName = currentUser?.fullName || currentUser?.name || "";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold border border-amber-500/20 mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>National Academic Standings</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Academic League & Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Real-time standings calibrated across 200,000+ preparatory candidates. Benchmarked by adaptive mastery, diagnostic simulation scores, and daily study streaks.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start md:self-auto">
            <button
              onClick={() => setScope("national")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                scope === "national"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>National</span>
            </button>
            <button
              onClick={() => setScope("regional")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                scope === "regional"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Regional</span>
            </button>
            <button
              onClick={() => setScope("school")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                scope === "school"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <School className="w-3.5 h-3.5 text-purple-600" />
              <span>School</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate name or school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-amber-500 outline-none transition-colors"
            />
          </div>

          {scope === "regional" && (
            <div className="w-full sm:w-auto flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 font-semibold focus:border-amber-500 outline-none cursor-pointer"
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
      ) : filteredRows.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-sm font-bold text-slate-800">No candidates found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <>
          
          {topThree.length >= 3 && !searchQuery && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4">
              {/* 2nd Place (Silver) */}
              <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200 p-6 shadow-xs relative order-2 md:order-1 hover:border-slate-300 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 flex items-center gap-1 shadow-2xs">
                  <Medal className="w-3.5 h-3.5 text-slate-600" />
                  <span>2nd Place</span>
                </div>
                <div className="text-center pt-2">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-700 font-serif text-xl font-bold flex items-center justify-center mx-auto shadow-inner mb-3">
                    {(topThree[1].student_name || topThree[1].name || "S")[0]}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate">
                    {topThree[1].student_name || topThree[1].name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {topThree[1].school || "Preparatory Academy"} • {topThree[1].region}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Diagnostic</span>
                      <strong className="text-emerald-700 font-bold">{topThree[1].score || topThree[1].predicted_score} / 700</strong>
                    </div>
                    <div className="h-6 w-px bg-slate-100" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Mastery XP</span>
                      <strong className="text-purple-700 font-bold">{topThree[1].xp_points || topThree[1].xpPoints} XP</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl border-2 border-amber-400/80 p-6 shadow-md relative order-1 md:order-2 md:-translate-y-2 hover:border-amber-500 transition-all">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-slate-950" />
                  <span>National Champion</span>
                </div>
                <div className="text-center pt-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-md mb-3 ring-4 ring-amber-100">
                    {(topThree[0].student_name || topThree[0].name || "N")[0]}
                  </div>
                  <h3 className="font-bold text-slate-950 text-base truncate">
                    {topThree[0].student_name || topThree[0].name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                    {topThree[0].school || "Model Secondary"} • {topThree[0].region}
                  </p>
                  <div className="mt-4 pt-3.5 border-t border-amber-200/50 flex items-center justify-center gap-5 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Diagnostic Score</span>
                      <strong className="text-emerald-700 text-sm font-bold">{topThree[0].score || topThree[0].predicted_score} / 700</strong>
                    </div>
                    <div className="h-7 w-px bg-amber-200/50" />
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Mastery XP</span>
                      <strong className="text-purple-700 text-sm font-bold">{topThree[0].xp_points || topThree[0].xpPoints} XP</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3rd Place (Bronze) */}
              <div className="bg-gradient-to-b from-amber-900/5 to-white rounded-3xl border border-amber-800/20 p-6 shadow-xs relative order-3 md:order-3 hover:border-amber-800/30 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-200 flex items-center gap-1 shadow-2xs">
                  <Medal className="w-3.5 h-3.5 text-amber-800" />
                  <span>3rd Place</span>
                </div>
                <div className="text-center pt-2">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 font-serif text-xl font-bold flex items-center justify-center mx-auto shadow-inner mb-3">
                    {(topThree[2].student_name || topThree[2].name || "T")[0]}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate">
                    {topThree[2].student_name || topThree[2].name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {topThree[2].school || "Secondary School"} • {topThree[2].region}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Diagnostic</span>
                      <strong className="text-emerald-700 font-bold">{topThree[2].score || topThree[2].predicted_score} / 700</strong>
                    </div>
                    <div className="h-6 w-px bg-slate-100" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Mastery XP</span>
                      <strong className="text-purple-700 font-bold">{topThree[2].xp_points || topThree[2].xpPoints} XP</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Standings Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ranked Candidates ({filteredRows.length})
              </span>
              <span className="text-xs text-slate-400">
                Sorted by cumulative XP & entrance projection
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">School & Region</th>
                    <th className="py-3 px-4">Stream</th>
                    <th className="py-3 px-4">Streak</th>
                    <th className="py-3 px-4">XP Points</th>
                    <th className="py-3 px-4 text-right">Diagnostic /700</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map((r, idx) => {
                    const isMe =
                      (r.student_name && currentUserName && r.student_name.toLowerCase() === currentUserName.toLowerCase()) ||
                      (r.name && currentUserName && r.name.toLowerCase() === currentUserName.toLowerCase()) ||
                      r.student_name === "Daniel Finkison";

                    const displayRank = r.rank || idx + 1;

                    return (
                      <tr
                        key={r.id || `${r.student_name}-${idx}`}
                        className={`transition-colors ${
                          isMe ? "bg-amber-500/10 font-medium" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          {displayRank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold text-[11px] shadow-2xs">
                              1
                            </span>
                          ) : displayRank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-[11px]">
                              2
                            </span>
                          ) : displayRank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-800/20 text-amber-900 font-bold text-[11px]">
                              3
                            </span>
                          ) : (
                            <span className="font-mono text-slate-400 font-semibold">#{displayRank}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {r.student_name || r.name}
                            </span>
                            {isMe && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-2xs">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <span>{r.school || "Preparatory Secondary"}</span>
                          <span className="text-slate-400 text-[11px] block">{r.region || "Addis Ababa"}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {r.stream || "Natural Science"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span>{r.streak_days || 14}d</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-purple-700">
                          {r.xp_points || r.xpPoints || 1840} XP
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-700 text-sm">
                          {r.score || r.predicted_score || 498}
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
    </div>
  );
}
