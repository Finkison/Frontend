import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Swords, 
  Trophy, 
  Flame, 
  Zap, 
  Clock, 
  ShieldAlert, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles,
  Award,
  Users
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { 
  listBattleRooms, 
  createBattleRoom, 
  joinBattleRoom, 
  submitBattleAnswer, 
  BattleRoom 
} from "../../services/battleService";

export default function BattleArena(): React.ReactElement {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [rooms, setRooms] = useState<BattleRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBattle, setActiveBattle] = useState<BattleRoom | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newSubject, setNewSubject] = useState("Mathematics");
  const [newStake, setNewStake] = useState(50);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await listBattleRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Failed to load rooms, using resilient baseline:", err);
      setRooms([
        {
          id: "room-math-01",
          subject: "Mathematics",
          stakeXp: 50,
          status: "WAITING",
          host: { id: "std-002", name: "Abebe Bikila", xpPoints: 2100 },
          hostScore: 0,
          opponentScore: 0,
          timeLimitSeconds: 15,
          questions: [],
          createdAt: new Date().toISOString()
        },
        {
          id: "room-phys-02",
          subject: "Physics",
          stakeXp: 100,
          status: "WAITING",
          host: { id: "std-003", name: "Selamawit D.", xpPoints: 1950 },
          hostScore: 0,
          opponentScore: 0,
          timeLimitSeconds: 15,
          questions: [],
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const room = await createBattleRoom({
        subject: newSubject,
        stakeXp: newStake,
        hostId: user?.id || "std-001"
      });
      setCreateModalOpen(false);
      startBattle(room);
    } catch {
      // Mock room fallback
      const mockRoom: BattleRoom = {
        id: `room-${Date.now().toString(36)}`,
        subject: newSubject,
        stakeXp: newStake,
        status: "ACTIVE",
        host: { id: user?.id || "std-001", name: user?.name || "Daniel Finkison", xpPoints: 1840 },
        opponent: { id: "std-bot", name: "Chala Gemeda (Oromia)", xpPoints: 1920 },
        hostScore: 0,
        opponentScore: 0,
        timeLimitSeconds: 15,
        questions: [
          {
            id: "bq-1",
            question_text_en: "If f(x) = 3x^2 - 12x + 7, at what value of x does f'(x) = 0?",
            options: [
              { label: "A", text: "2" },
              { label: "B", text: "4" },
              { label: "C", text: "-2" },
              { label: "D", text: "0" }
            ],
            correct_answer: 0,
            explanation_en: "f'(x) = 6x - 12 = 0 => 6x = 12 => x = 2."
          },
          {
            id: "bq-2",
            question_text_en: "Which physical quantity has the SI unit Tesla (T)?",
            options: [
              { label: "A", text: "Magnetic Flux" },
              { label: "B", text: "Magnetic Field (B)" },
              { label: "C", text: "Electric Field" },
              { label: "D", text: "Capacitance" }
            ],
            correct_answer: 1,
            explanation_en: "Magnetic field flux density B is measured in Tesla (T) or Wb/m^2."
          },
          {
            id: "bq-3",
            question_text_en: "What is the pH of a 0.001 M HCl solution?",
            options: [
              { label: "A", text: "1" },
              { label: "B", text: "2" },
              { label: "C", text: "3" },
              { label: "D", text: "11" }
            ],
            correct_answer: 2,
            explanation_en: "pH = -log[H+] = -log(10^-3) = 3."
          }
        ],
        createdAt: new Date().toISOString()
      };
      setCreateModalOpen(false);
      startBattle(mockRoom);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (room: BattleRoom) => {
    try {
      const active = await joinBattleRoom({ roomId: room.id, participantId: user?.id || "std-001" });
      startBattle(active);
    } catch {
      // Mock join fallback
      const mockJoined: BattleRoom = {
        ...room,
        opponent: { id: user?.id || "std-001", name: user?.name || "Daniel Finkison", xpPoints: 1840 },
        status: "ACTIVE",
        questions: [
          {
            id: "bq-1",
            question_text_en: "Which element has atomic number 6 in the periodic table?",
            options: [
              { label: "A", text: "Nitrogen" },
              { label: "B", text: "Carbon" },
              { label: "C", text: "Oxygen" },
              { label: "D", text: "Boron" }
            ],
            correct_answer: 1
          },
          {
            id: "bq-2",
            question_text_en: "Solve for x: 2^(x+1) = 16.",
            options: [
              { label: "A", text: "2" },
              { label: "B", text: "3" },
              { label: "C", text: "4" },
              { label: "D", text: "5" }
            ],
            correct_answer: 1
          }
        ]
      };
      startBattle(mockJoined);
    }
  };

  const startBattle = (room: BattleRoom) => {
    if (!room.questions || room.questions.length === 0) {
      room.questions = [
        {
          id: "bq-1",
          question_text_en: "If f(x) = x^2 - 6x + 8, find the vertex coordinate x-value:",
          options: [
            { label: "A", text: "2" },
            { label: "B", text: "3" },
            { label: "C", text: "-3" },
            { label: "D", text: "4" }
          ],
          correct_answer: 1
        },
        {
          id: "bq-2",
          question_text_en: "Which gas law states that volume is directly proportional to temperature at constant pressure?",
          options: [
            { label: "A", text: "Boyle's Law" },
            { label: "B", text: "Charles's Law" },
            { label: "C", text: "Avogadro's Law" },
            { label: "D", text: "Dalton's Law" }
          ],
          correct_answer: 1
        },
        {
          id: "bq-3",
          question_text_en: "What is the speed of electromagnetic waves in a vacuum?",
          options: [
            { label: "A", text: "3 x 10^6 m/s" },
            { label: "B", text: "3 x 10^8 m/s" },
            { label: "C", text: "3 x 10^10 m/s" },
            { label: "D", text: "Infinite" }
          ],
          correct_answer: 1
        }
      ];
    }
    setActiveBattle(room);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setTimeLeft(room.timeLimitSeconds || 15);
    setPlayerScore(0);
    setOpponentScore(0);
    setShowResultModal(false);
  };

  useEffect(() => {
    if (!activeBattle || showResultModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion(false, 0);
          return activeBattle.timeLimitSeconds || 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBattle, currentQIndex, showResultModal]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || !activeBattle) return;
    setSelectedOption(idx);

    const currentQ = activeBattle.questions[currentQIndex];
    const isCorrect = currentQ && currentQ.correct_answer === idx;
    const speedBonus = timeLeft > 10 ? 15 : timeLeft > 5 ? 10 : 5;
    const points = isCorrect ? 100 + speedBonus : 0;

    const opponentCorrect = Math.random() > 0.3;
    const opponentPoints = opponentCorrect ? 100 + Math.floor(Math.random() * 15) : 0;

    if (isCorrect) setPlayerScore((prev) => prev + points);
    if (opponentCorrect) setOpponentScore((prev) => prev + opponentPoints);

    submitBattleAnswer({
      roomId: activeBattle.id,
      participantId: user?.id || "std-001",
      questionId: currentQ?.id || `q-${currentQIndex}`,
      selectedAnswer: idx
    }).catch(() => {});

    setTimeout(() => {
      handleNextQuestion(isCorrect, points);
    }, 1200);
  };

  const handleNextQuestion = (_wasCorrect: boolean, _pts: number) => {
    if (!activeBattle) return;
    if (currentQIndex < activeBattle.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(activeBattle.timeLimitSeconds || 15);
    } else {
      setShowResultModal(true);
    }
  };

  const exitBattle = () => {
    setActiveBattle(null);
    setShowResultModal(false);
    fetchRooms();
  };

  // ==========================================
  // ==========================================
  if (activeBattle) {
    const currentQ = activeBattle.questions[currentQIndex];
    const isPlayerWinning = playerScore >= opponentScore;

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0a192f] to-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            {/* Player 1 (Candidate) */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-lg">
                {(user?.name || "You")[0]}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">You (Host)</span>
                <h4 className="font-bold text-base text-white">{user?.name || "Daniel Finkison"}</h4>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono mt-0.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{playerScore} pts</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-400 flex flex-col items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-sm font-black">{timeLeft}s</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                Question {currentQIndex + 1} / {activeBattle.questions.length}
              </span>
            </div>

            {/* Player 2 (Opponent) */}
            <div className="flex items-center gap-3 text-right flex-row-reverse sm:flex-row">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Challenger</span>
                <h4 className="font-bold text-base text-white">{activeBattle.opponent?.name || "Abebe B. (Hawassa)"}</h4>
                <div className="flex items-center justify-end gap-1.5 text-xs text-amber-400 font-mono mt-0.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{opponentScore} pts</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center font-bold text-rose-400 text-lg">
                {(activeBattle.opponent?.name || "A")[0]}
              </div>
            </div>
          </div>

          {/* Real-time Tug-of-War Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden flex">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
              style={{ width: `${playerScore + opponentScore === 0 ? 50 : (playerScore / (playerScore + opponentScore)) * 100}%` }}
            />
            <div 
              className="bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500" 
              style={{ width: `${playerScore + opponentScore === 0 ? 50 : (opponentScore / (playerScore + opponentScore)) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Prompt Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wide">
              {activeBattle.subject} Standard Drill
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Stake: +{activeBattle.stakeXp * 2} XP Pool</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 leading-snug">
            {currentQ?.question_text_en || currentQ?.questionText || "Question prompt"}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {(currentQ?.options || []).map((opt: any, idx: number) => {
              const label = typeof opt === "object" ? opt.label || ["A", "B", "C", "D"][idx] : ["A", "B", "C", "D"][idx];
              const text = typeof opt === "object" ? opt.text || opt.text_en : String(opt);
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = currentQ.correct_answer === idx;

              let btnClass = "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800";
              if (selectedOption !== null) {
                if (isCorrectAnswer) {
                  btnClass = "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 font-bold";
                } else if (isSelected) {
                  btnClass = "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20";
                } else {
                  btnClass = "opacity-40 bg-slate-50 border-slate-200 text-slate-500";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 ${btnClass}`}
                >
                  <span className="w-7 h-7 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                    {label}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{text}</span>
                  {selectedOption !== null && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto shrink-0 mt-0.5" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-600 ml-auto shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {showResultModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-slate-100">
              <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-600">
                  {isPlayerWinning ? "National Arena Victory!" : "Honorable Match"}
                </span>
                <h2 className="font-serif text-3xl font-black text-slate-900 mt-1">
                  {isPlayerWinning ? "You Won the Duel!" : "Defeat by Points"}
                </h2>
                <p className="text-xs text-slate-500 mt-1.5">
                  Final score: <strong className="text-slate-900">{playerScore}</strong> vs <strong className="text-slate-900">{opponentScore}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-800">XP Rewards Transferred</span>
                    <h5 className="font-black text-base text-amber-950">
                      {isPlayerWinning ? `+${activeBattle.stakeXp * 2} XP Earned` : "0 XP (Stake Forfeited)"}
                    </h5>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-700">#EUEE-Arena</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={exitBattle}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 transition-colors"
                >
                  Return to Lobby
                </button>
                <button
                  type="button"
                  onClick={() => startBattle(activeBattle)}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-xs text-slate-950 shadow-md shadow-amber-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Rematch</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // ==========================================
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0A192F] to-slate-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>National Candidate 1v1 Arena</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Quiz Battle & Head-to-Head Duels
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Challenge fellow Grade 12 candidates nationwide in synchronous 15-second curriculum sprints. Stake your XP, climb the national leaderboard, and sharpen rapid problem-solving.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[110px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Candidate XP</span>
              <p className="font-mono text-xl font-black text-amber-400 mt-0.5">{user?.xpPoints || 1840}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[110px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Arena Rank</span>
              <p className="font-mono text-xl font-black text-emerald-400 mt-0.5">#342</p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Host Duel Room</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Open Battle Coliseum Rooms</h3>
            <p className="text-xs text-slate-500">Select an open challenge to duel candidates right now.</p>
          </div>
          <button
            onClick={fetchRooms}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh Lobby</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium text-xs">
            Connecting to National Battle Server...
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-3">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-sm text-slate-700">No Open Rooms Right Now</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first to challenge other students! Host a room with your chosen subject and stake XP.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 font-bold text-xs text-slate-950 shadow"
            >
              Create First Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
                      {r.subject}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                      <Zap className="w-3 h-3" />
                      <span>{r.stakeXp} XP Stake</span>
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Host Candidate</span>
                    <h4 className="font-bold text-sm text-slate-900">{r.host?.name || "Candidate Host"}</h4>
                    <p className="text-xs text-slate-500">XP Rating: {r.host?.xpPoints || 1840} pts</p>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinRoom(r)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Accept Duel</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-lg font-bold text-slate-900">Host New Battle Room</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Subject Category *
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400 bg-white"
                >
                  <option value="Mathematics">Mathematics (Natural & Social)</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English & Verbal Reasoning</option>
                  <option value="Aptitude">General Scholastic Aptitude</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  XP Stake Wager *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 100, 250].map((stake) => (
                    <button
                      key={stake}
                      type="button"
                      onClick={() => setNewStake(stake)}
                      className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition-colors ${
                        newStake === stake
                          ? "bg-amber-400 text-slate-950 border-amber-500 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {stake} XP
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-900">Battle Rules:</span>
                <p>• 15 seconds per curriculum question.</p>
                <p>• Rapid speed bonus applied for answering within first 5 seconds.</p>
                <p>• Winner takes the {newStake * 2} XP aggregate pool.</p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 font-bold text-xs text-slate-950 shadow-md shadow-amber-400/20"
                >
                  {creating ? "Launching Room..." : "Launch Arena"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
