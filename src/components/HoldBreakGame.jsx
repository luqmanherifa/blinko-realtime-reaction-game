import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { TrophyIcon } from "./icons";

export default function HoldBreakGame({ room, onlinePlayers, playerName }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [canDeclare, setCanDeclare] = useState(true);
  const [showDeclareOptions, setShowDeclareOptions] = useState(false);

  const me = onlinePlayers.find((p) => p.id === playerName);
  const opponent = onlinePlayers.find((p) => p.id !== playerName);

  const progressMV = useMotionValue(100);

  const barColor = useTransform(progressMV, (v) => {
    if (v > 60) return "#22c55e";
    if (v > 30) return "#facc15";
    return "#ef4444";
  });

  const sortedPlayers = [...onlinePlayers].sort(
    (a, b) => b.totalScore - a.totalScore,
  );

  useEffect(() => {
    if (!room.phaseStartAt || !room.phaseDuration) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - room.phaseStartAt;
      const remaining = room.phaseDuration - elapsed;
      setTimeLeft(Math.max(0, remaining));

      const declareWindowEnd = room.phaseStartAt + room.phaseDuration * 0.5;
      setCanDeclare(Date.now() < declareWindowEnd);
    }, 100);

    return () => clearInterval(interval);
  }, [room.phaseStartAt, room.phaseDuration]);

  useEffect(() => {
    setShowDeclareOptions(false);
  }, [room.phaseStartAt]);

  const handleBreak = async () => {
    if (me?.breakAt) return;

    try {
      await updateDoc(doc(db, "rooms", room.code, "players", playerName), {
        breakAt: Date.now(),
      });
    } catch (error) {
      console.error("Error breaking:", error);
    }
  };

  const handleDeclare = async (declaredChoice) => {
    if (me?.declared) return;

    try {
      await updateDoc(doc(db, "rooms", room.code, "players", playerName), {
        declared: declaredChoice,
        declaredAt: Date.now(),
      });
      setShowDeclareOptions(false);
    } catch (error) {
      console.error("Error declaring:", error);
    }
  };

  const hasBreak = !!me?.breakAt;
  const hasDeclared = !!me?.declared;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Timer Bar - Top */}
      <div className="bg-white border-b-2 border-slate-200 px-6 py-3">
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            key={room.phaseStartAt}
            className="h-full"
            style={{
              backgroundColor: barColor,
            }}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{
              duration: room.phaseDuration / 1000,
              ease: "linear",
            }}
            onUpdate={(latest) => {
              const percentage = (parseFloat(latest.width) / 100) * 100;
              progressMV.set(percentage);
            }}
          />
        </div>
      </div>

      {/* Card Table Layout */}
      <div className="flex-1 flex flex-col px-4 py-6">
        {/* Opponent Card - Top */}
        <div className="mb-6">
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigospark rounded-full flex items-center justify-center">
                  <span className="text-white font-bold font-heading text-sm">
                    {opponent?.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold font-heading text-indigospark">
                    {opponent?.name || "Menunggu..."}
                  </p>
                  <p className="text-xs text-slate-500">Lawan</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrophyIcon className="w-4 h-4 text-yellowpulse" />
                <span className="text-lg font-bold font-heading text-indigospark">
                  {opponent?.totalScore || 0}
                </span>
              </div>
            </div>

            {/* Opponent's Declaration Card */}
            <div className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 min-h-[60px] flex items-center justify-center">
              {opponent?.declared ? (
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-1">Deklarasi</p>
                  <p className="text-lg font-bold font-heading text-indigospark">
                    {opponent.declared}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-block bg-slate-200 rounded-lg px-6 py-2">
                    <p className="text-xs font-bold font-heading text-slate-400">
                      ???
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center - Break Button */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-center">
            <button
              onClick={handleBreak}
              disabled={hasBreak}
              className={`
                w-48 h-48
                rounded-3xl
                flex flex-col items-center justify-center
                font-extrabold font-heading
                border-4
                transition-all
                ${
                  hasBreak
                    ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed"
                    : "bg-red-500 text-white border-red-600 hover:bg-red-600 active:scale-95"
                }
              `}
            >
              <span className="text-3xl mb-2">
                {hasBreak ? "✓" : "B R E A K"}
              </span>
              <span className="text-xs font-normal">
                {hasBreak ? "Sudah Break" : "Tekan untuk Break"}
              </span>
            </button>
          </div>
        </div>

        {/* My Card - Bottom */}
        <div className="mt-6">
          <div className="bg-white border-2 border-indigospark rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellowpulse rounded-full flex items-center justify-center">
                  <span className="text-indigospark font-bold font-heading text-sm">
                    {me?.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold font-heading text-indigospark">
                    {me?.name}
                  </p>
                  <p className="text-xs text-slate-500">Kamu</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrophyIcon className="w-4 h-4 text-yellowpulse" />
                <span className="text-lg font-bold font-heading text-indigospark">
                  {me?.totalScore || 0}
                </span>
              </div>
            </div>

            {/* My Declaration Card */}
            <div className="border-2 border-indigospark rounded-xl p-3 bg-indigospark/5 min-h-[60px]">
              {hasDeclared ? (
                <div className="text-center py-2">
                  <p className="text-xs text-slate-500 mb-1">Deklarasi Kamu</p>
                  <p className="text-lg font-bold font-heading text-indigospark">
                    {me.declared}
                  </p>
                </div>
              ) : canDeclare && !hasBreak ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowDeclareOptions(!showDeclareOptions)}
                    className="w-full py-2 bg-yellowpulse text-indigospark rounded-lg font-bold font-heading border-2 border-yellowpulse hover:bg-yellowpulse/80 active:scale-95 transition-all text-sm"
                  >
                    {showDeclareOptions ? "BATAL" : "DEKLARASI"}
                  </button>

                  {showDeclareOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-2 gap-2"
                    >
                      <button
                        onClick={() => handleDeclare("HOLD")}
                        className="py-2 bg-white text-indigospark rounded-lg font-bold font-heading border-2 border-indigospark hover:bg-indigospark/5 active:scale-95 transition-all text-sm"
                      >
                        HOLD
                      </button>
                      <button
                        onClick={() => handleDeclare("BREAK")}
                        className="py-2 bg-white text-indigospark rounded-lg font-bold font-heading border-2 border-indigospark hover:bg-indigospark/5 active:scale-95 transition-all text-sm"
                      >
                        BREAK
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs font-bold font-heading text-slate-400">
                    {hasBreak
                      ? "Tunggu phase selesai..."
                      : "Waktu deklarasi habis"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
