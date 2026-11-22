import React, { useState, useEffect } from "react";
import { 
  Swords, 
  Trophy, 
  Zap, 
  Clock, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles,
  Award,
  Users
} from "lucide-react";
import PortalPage from "../shared/PortalPage";
import useAuthStore from "../../store/authStore";
import { getSubjects } from "../../services/curriculumService";
import { 
  listBattleRooms, 
  createBattleRoom, 
  joinBattleRoom, 
  submitBattleAnswer, 
  getBattleRoomStatus,
  BattleRoom 
} from "../../services/challengeService";

export default function ChallengeArena(): React.ReactElement {
  const user = useAuthStore((s) => s.user);

  const [rooms, setRooms] = useState<BattleRoom[]>([]);
  const [battleSubjects, setBattleSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeBattle, setActiveBattle] = useState<BattleRoom | null>(null);
  const [waitingRoom, setWaitingRoom] = useState<BattleRoom | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [serverWinner, setServerWinner] = useState<string | null>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newSubject, setNewSubject] = useState("");
  const [newStake, setNewStake] = useState(50);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    let active = true;
    getSubjects()
      .then((response) => {
        if (!active) return;
        const available = response.data.data
          .filter((subject) => subject.totalQuestions > 0 && subject.id && subject.name)
          .map((subject) => ({ id: subject.id, name: subject.name }));
        setBattleSubjects(available);
        setNewSubject(available[0]?.name || "");
      })
      .catch(() => { if (active) setBattleSubjects([]); })
      .finally(() => { if (active) setSubjectsLoading(false); });
    return () => { active = false; };
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listBattleRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch {
      setRooms([]);
      setError("Battle rooms could not be loaded. Check your connection and try again.");
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
        hostId: user?.id
      });
      if (!room?.id || !room.questions?.length) throw new Error("There are no questions available for this subject yet.");
      setCreateModalOpen(false);
      setWaitingRoom(room);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Unable to create a battle room. Check your connection and try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (room: BattleRoom) => {
    try {
      if (!user?.id) throw new Error("Sign in again before joining a battle.");
      const active = await joinBattleRoom({ roomId: room.id, participantId: user.id });
      if (active?.status !== "ACTIVE" || !active.opponent || !active.questions?.length) throw new Error("This room is not ready to play. Refresh the open battles list.");
      startBattle(active);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Unable to join this battle room. The host may have left or the room expired.");
    }
  };

  const startBattle = (room: BattleRoom) => {
    if (!room.questions || room.questions.length === 0) {
      setError("This battle room has no questions loaded. Try creating a new room.");
      return;
    }
    setActiveBattle(room);
    setWaitingRoom(null);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setAnswerCorrect(null);
    setServerWinner(null);
    setWaitingForOpponent(false);
    setTimeLeft(room.timeLimitSeconds || 15);
    const isHost = room.host.id === user?.id;
    setPlayerScore(isHost ? room.hostScore || 0 : room.opponentScore || 0);
    setOpponentScore(isHost ? room.opponentScore || 0 : room.hostScore || 0);
    setShowResultModal(false);
  };

  useEffect(() => {
    if (!waitingRoom) return;
    let active = true;
    const checkRoom = async () => {
      try {
        const room = await getBattleRoomStatus(waitingRoom.id);
        if (!active) return;
        if (room?.status === "ACTIVE" && room.opponent) startBattle(room);
        else if (room?.status === "COMPLETED") {
          setWaitingRoom(null);
          setError("This room has already ended. Create another room to play.");
        }
      } catch {
        // Keep the host in the lobby while a temporary network error resolves.
      }
    };
    void checkRoom();
    const poll = window.setInterval(() => { void checkRoom(); }, 2000);
    return () => { active = false; window.clearInterval(poll); };
  }, [waitingRoom?.id]);

  const handleSelectOption = async (idx: number) => {
    if (selectedOption !== null || !activeBattle) return;
    const currentQ = activeBattle.questions[currentQIndex];
    if (!currentQ?.id || !user?.id) {
      setError("This question or your student session is missing. Leave the battle and try again.");
      return;
    }
    setSelectedOption(idx);
    setError(null);
    const isLast = currentQIndex >= activeBattle.questions.length - 1;
    const isHost = activeBattle.host.id === user?.id;

    try {
      const result = await submitBattleAnswer({
        roomId: activeBattle.id,
        participantId: user.id,
        questionId: String(currentQ.id),
        selectedAnswer: idx,
        timeTakenSeconds: Math.max(1, (activeBattle.timeLimitSeconds || 15) - timeLeft),
        isFinalQuestion: isLast
      });
      if (result?.success === false || !Number.isFinite(Number(result?.pointsEarned))) throw new Error(result?.error || "The battle server did not confirm your answer.");
      const isCorrect = Boolean(result.isCorrect);
      setAnswerCorrect(isCorrect);
      setPlayerScore(isHost ? Number(result.hostScore) || 0 : Number(result.opponentScore) || 0);
      setOpponentScore(isHost ? Number(result.opponentScore) || 0 : Number(result.hostScore) || 0);
      if (result.winner) setServerWinner(String(result.winner));
      if (isLast) {
        if (result.isCompleted) setShowResultModal(true);
        else setWaitingForOpponent(true);
      } else {
        window.setTimeout(() => handleNextQuestion(), 1000);
      }
    } catch (err: any) {
      setSelectedOption(null);
      setAnswerCorrect(null);
      setTimeLeft(activeBattle.timeLimitSeconds || 15);
      setError(err?.response?.data?.error || err?.message || "Your answer could not be recorded. Try again.");
    }
  };

  useEffect(() => {
    if (!activeBattle || showResultModal || waitingForOpponent || selectedOption !== null) return;
    if (timeLeft <= 0) {
      void handleSelectOption(-1);
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [activeBattle?.id, currentQIndex, selectedOption, showResultModal, timeLeft, waitingForOpponent]);

  useEffect(() => {
    if (!activeBattle || !user?.id || showResultModal) return;
    const roomId = activeBattle.id;
    let active = true;
    const syncRoom = async () => {
      try {
        const room = await getBattleRoomStatus(roomId);
        if (!active || !room?.id) return;
        const isHost = room.host.id === user.id;
        setActiveBattle(room);
        setPlayerScore(isHost ? Number(room.hostScore) || 0 : Number(room.opponentScore) || 0);
        setOpponentScore(isHost ? Number(room.opponentScore) || 0 : Number(room.hostScore) || 0);
        if (room.status === "COMPLETED") {
          setServerWinner(room.winner || null);
          setWaitingForOpponent(false);
          setShowResultModal(true);
        }
      } catch {
        // Keep the active question usable while a transient status request fails.
      }
    };
    const poll = window.setInterval(() => { void syncRoom(); }, 2500);
    return () => { active = false; window.clearInterval(poll); };
  }, [activeBattle?.id, showResultModal, user?.id]);

  const handleNextQuestion = () => {
    if (!activeBattle) return;
    if (currentQIndex < activeBattle.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerCorrect(null);
      setTimeLeft(activeBattle.timeLimitSeconds || 15);
    } else {
      setWaitingForOpponent(true);
    }
  };

  const exitBattle = () => {
    setActiveBattle(null);
    setShowResultModal(false);
    setWaitingRoom(null);
    fetchRooms();
  };

  const availableRooms = rooms.filter((room) => room.status === "WAITING" && room.host?.id !== user?.id);

  // ==========================================
  // ==========================================
  if (activeBattle) {
    const currentQ = activeBattle.questions[currentQIndex];
    const isHost = activeBattle.host.id === user?.id;
    const player = isHost ? activeBattle.host : activeBattle.opponent;
    const opponent = isHost ? activeBattle.opponent : activeBattle.host;
    const opponentFinished = isHost ? activeBattle.opponentCompleted : activeBattle.hostCompleted;
    const isPlayerWinning = Boolean(player?.name && serverWinner === player.name);
    const isDraw = serverWinner === "Draw";

    return (
      <PortalPage className="max-w-4xl space-y-6">

        <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-950 via-[#0a192f] to-stone-950 text-white border border-stone-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-lg">
                {(player?.name || "S")[0]}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">You</span>
                <h4 className="font-bold text-base text-white">{player?.name || "Student"}</h4>
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
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-[#A89C90] mt-1">
                Question {currentQIndex + 1} / {activeBattle.questions.length}
              </span>
            </div>

            <div className="flex items-center gap-3 text-right flex-row-reverse sm:flex-row">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Opponent</span>
                <h4 className="font-bold text-base text-white">{opponent?.name || "Student"}</h4>
                <div className="flex items-center justify-end gap-1.5 text-xs text-amber-400 font-mono mt-0.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{opponentScore} pts</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center font-bold text-rose-400 text-lg">
                {(opponent?.name || "S")[0]}
              </div>
            </div>
          </div>

          <div className="w-full bg-stone-800/80 rounded-full h-3 overflow-hidden flex">
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

        <div className="p-8 rounded-3xl bg-white dark:bg-[#261E1A] border border-stone-200 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wide">
              {activeBattle.subject} Standard Drill
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 dark:text-[#A89C90]">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Potential win: {activeBattle.stakeXp * 2} XP</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-sans font-bold text-stone-900 dark:text-[#FDFBF7] leading-snug">
            {currentQ?.questionText || (currentQ as any)?.question_text || (currentQ as any)?.question_text_en || (currentQ as any)?.question || "Question prompt"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {(currentQ?.options || []).map((opt: any, idx: number) => {
              const label = typeof opt === "object" ? opt.label || ["A", "B", "C", "D"][idx] : ["A", "B", "C", "D"][idx];
              const text = typeof opt === "object" ? opt.text || opt.text_en : String(opt);
              const isSelected = selectedOption === idx;
              const answerIsCorrect = isSelected && answerCorrect === true;
              const answerIsWrong = isSelected && answerCorrect === false;

              let btnClass = "bg-stone-50 dark:bg-[#1C1512] hover:bg-stone-100 dark:hover:bg-white/10 border-stone-200 dark:border-white/10 text-stone-800 dark:text-[#FDFBF7]";
              if (selectedOption !== null) {
                if (answerIsCorrect) {
                  btnClass = "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 font-bold";
                } else if (answerIsWrong) {
                  btnClass = "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20";
                } else {
                  btnClass = "opacity-40 bg-stone-50 dark:bg-[#1C1512] border-stone-200 dark:border-white/10 text-stone-500 dark:text-[#A89C90]";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 ${btnClass}`}
                >
                  <span className="w-7 h-7 rounded-xl bg-white dark:bg-[#261E1A] border border-stone-300 dark:border-white/20 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                    {label}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{text}</span>
                  {answerIsCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto shrink-0 mt-0.5" />
                  )}
                  {answerIsWrong && (
                    <XCircle className="w-5 h-5 text-rose-600 ml-auto shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
          {selectedOption === -1 && <p role="status" className="text-xs font-medium text-amber-700 dark:text-amber-200">Time expired. This answer was recorded as incorrect.</p>}
          {waitingForOpponent && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">Your answers are saved. {opponentFinished ? "Your opponent has finished; syncing the final score…" : "Waiting for your opponent to finish the round…"}</p>}
          {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{error}</p>}
        </div>

        {showResultModal && (
          <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#261E1A] rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-stone-100 dark:border-white/10">
              <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg bg-gradient-to-tr from-amber-400 to-amber-200 text-stone-950">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-600">{serverWinner ? "Battle result" : "Battle complete"}</span>
                <h2 className="font-sans text-3xl font-black text-stone-900 dark:text-[#FDFBF7] mt-1">
                  {isDraw ? "It’s a draw" : isPlayerWinning ? "You won" : serverWinner ? "You were outscored" : "Result pending"}
                </h2>
                <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-1.5">
                  Final score: <strong className="text-stone-900 dark:text-[#FDFBF7]">{playerScore}</strong> vs <strong className="text-stone-900 dark:text-[#FDFBF7]">{opponentScore}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-800">XP reward</span>
                    <h5 className="font-black text-base text-amber-950">
                      {isPlayerWinning ? `+${activeBattle.stakeXp * 2} XP awarded` : isDraw ? `+${activeBattle.stakeXp} XP awarded` : serverWinner ? "No reward recorded" : "Not available"}
                    </h5>
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-700">Arena challenge</span>
              </div>

              <div className="flex">
                <button
                  type="button"
                  onClick={exitBattle}
                  className="w-full py-3 px-4 rounded-xl bg-stone-100 dark:bg-[#201815] hover:bg-stone-200 font-bold text-xs text-stone-700 dark:text-[#E7E0D6] transition-colors"
                >
                  Return to Lobby
                </button>
              </div>
            </div>
          </div>
        )}
      </PortalPage>
    );
  }

  if (waitingRoom) {
    return (
      <PortalPage className="max-w-2xl">
        <section className="rounded-2xl border border-[#E7E0D6] bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-[#261E1A] sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"><Users className="h-7 w-7" aria-hidden="true" /></div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">Room open</p>
          <h1 className="mt-1 text-xl font-semibold text-stone-900 dark:text-[#FDFBF7]">Waiting for another student</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600 dark:text-[#A89C90]">{waitingRoom.subject} room is open. The battle starts when another student joins.</p>
          <div role="status" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2 text-xs text-stone-600 dark:bg-[#1C1512] dark:text-[#E7E0D6]"><span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />Checking for an opponent</div>
        </section>
      </PortalPage>
    );
  }

  // ==========================================
  // ==========================================
  return (
    <PortalPage className="space-y-8">

      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-950 via-[#0A192F] to-stone-950 text-white border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Quiz Battles</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Battle Arena
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Answer curriculum questions head to head. Your answer and score are confirmed by the battle service.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[110px]">
              <span className="text-[10px] text-stone-400 dark:text-[#A89C90] uppercase font-bold tracking-wide">XP</span>
              <p className="font-mono text-xl font-black text-amber-400 mt-0.5">{user?.xpPoints ?? "—"}</p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Host Battle</span>
            </button>
          </div>
        </div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">{error}</div>}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-sans text-xl font-bold text-stone-900 dark:text-[#FDFBF7]">Open Battles</h3>
            <p className="text-xs text-stone-500 dark:text-[#A89C90]">Join an open battle or host your own.</p>
          </div>
          <button
            onClick={fetchRooms}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-stone-400 dark:text-[#A89C90] font-medium text-xs">
            Connecting to battle server...
          </div>
        ) : availableRooms.length === 0 ? (
          <div className="p-12 rounded-3xl border-2 border-dashed border-stone-200 dark:border-white/10 text-center space-y-3">
            <Users className="w-8 h-8 text-stone-400 dark:text-[#A89C90] mx-auto" />
            <h4 className="font-bold text-sm text-stone-700 dark:text-[#E7E0D6]">No Open Battles</h4>
            <p className="text-xs text-stone-500 dark:text-[#A89C90] max-w-sm mx-auto">
              Host a room with your chosen subject and stake XP.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 font-bold text-xs text-stone-950 shadow cursor-pointer"
            >
              Host Battle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRooms.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#261E1A] border border-stone-200 dark:border-white/10 hover:border-amber-400 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 dark:bg-[#201815] text-stone-700 dark:text-[#E7E0D6] font-bold text-[10px] uppercase">
                      {r.subject}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                      <Zap className="w-3 h-3" />
                      <span>{r.stakeXp * 2} XP win reward</span>
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] text-stone-400 dark:text-[#A89C90] font-bold uppercase">Host</span>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-[#FDFBF7]">{r.host?.name || "Student"}</h4>
                    <p className="text-xs text-stone-500 dark:text-[#A89C90]">{r.host?.xpPoints ?? "—"} XP</p>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinRoom(r)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Join Battle</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#261E1A] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-stone-100 dark:border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-amber-500" />
                <h3 className="font-sans text-lg font-bold text-stone-900 dark:text-[#FDFBF7]">Host Battle</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-stone-400 dark:text-[#A89C90] hover:text-stone-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6] mb-1.5">
                  Subject *
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  disabled={subjectsLoading || battleSubjects.length === 0}
                  required
                  className="w-full p-3 rounded-xl border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-800 dark:text-[#FDFBF7] focus:outline-none focus:border-amber-400 bg-white dark:bg-[#261E1A] cursor-pointer"
                >
                  {subjectsLoading && <option value="">Loading subjects…</option>}
                  {!subjectsLoading && !battleSubjects.length && <option value="">No subjects have battle questions yet</option>}
                  {battleSubjects.map((subject) => <option key={subject.id} value={subject.name}>{subject.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 dark:text-[#E7E0D6] mb-1.5">
                  XP Reward Basis *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 100, 250].map((stake) => (
                    <button
                      key={stake}
                      type="button"
                      onClick={() => setNewStake(stake)}
                      className={`py-2 px-3 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer ${
                        newStake === stake
                          ? "bg-amber-400 text-stone-950 border-amber-500 shadow-sm"
                          : "bg-stone-50 dark:bg-[#1C1512] text-stone-700 dark:text-[#E7E0D6] border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/10"
                      }`}
                    >
                      {stake} XP
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10 text-xs text-stone-600 dark:text-[#E7E0D6] space-y-1">
                <span className="font-bold text-stone-900 dark:text-[#FDFBF7]">Rules:</span>
                <p>• 15 seconds per question.</p>
                <p>• Speed bonus for answering within 5 seconds.</p>
                <p>Winner receives {newStake * 2} XP. No XP is deducted to join.</p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-stone-100 dark:bg-[#201815] hover:bg-stone-200 font-bold text-xs text-stone-700 dark:text-[#E7E0D6] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || subjectsLoading || !battleSubjects.length}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 font-bold text-xs text-stone-950 shadow-md shadow-amber-400/20 cursor-pointer"
                >
                  {creating ? "Creating..." : "Start Battle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalPage>
  );
}

export { ChallengeArena as BattleArena };
