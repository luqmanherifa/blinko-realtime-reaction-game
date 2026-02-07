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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Leaderboard */}
      <div className="border-b border-slate-200 px-6 py-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-4 h-4 text-yellowpulse" />
            <span className="text-xs font-bold font-heading text-slate-500 uppercase tracking-wide">
              Skor
            </span>
          </div>

          <div className="flex gap-4">
            {sortedPlayers.map((p) => {
              const isMe = p.id === playerName;
              return (
                <div key={p.id} className="flex items-center gap-1.5">
                  <span
                    className={`text-xs font-semibold ${
                      isMe ? "text-indigospark" : "text-slate-600"
                    }`}
                  >
                    {p.name}
                  </span>
                  <span
                    className={`text-sm font-bold font-heading ${
                      isMe ? "text-indigospark" : "text-slate-700"
                    }`}
                  >
                    {p.totalScore}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="mb-8">
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
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

        <div className="text-center mb-8">
          <h3 className="text-3xl font-extrabold font-heading text-indigospark leading-tight">
            JANGAN BERKEDIP
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            {hasBreak
              ? "Kamu sudah BREAK. Tunggu phase berakhir..."
              : "Tahan impuls..."}
          </p>
        </div>

        {canDeclare && !hasDeclared && !hasBreak && (
          <div className="mb-6">
            <button
              onClick={() => setShowDeclareOptions(!showDeclareOptions)}
              className="w-full py-3 bg-yellowpulse/20 text-indigospark rounded-2xl font-bold font-heading border-2 border-yellowpulse/40 hover:bg-yellowpulse/30 active:scale-95 transition-all text-sm"
            >
              {showDeclareOptions ? "BATAL DEKLARASI" : "DEKLARASI"}
            </button>

            {showDeclareOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3 mt-3"
              >
                <button
                  onClick={() => handleDeclare("HOLD")}
                  className="py-3 bg-white text-indigospark rounded-xl font-bold font-heading border-2 border-indigospark/30 hover:bg-indigospark/5 active:scale-95 transition-all text-sm"
                >
                  Aku HOLD
                </button>
                <button
                  onClick={() => handleDeclare("BREAK")}
                  className="py-3 bg-white text-indigospark rounded-xl font-bold font-heading border-2 border-indigospark/30 hover:bg-indigospark/5 active:scale-95 transition-all text-sm"
                >
                  Aku BREAK
                </button>
              </motion.div>
            )}
          </div>
        )}

        {hasDeclared && (
          <div className="mb-6 text-center">
            <div className="inline-block bg-yellowpulse/20 border-2 border-yellowpulse rounded-xl px-4 py-2">
              <p className="text-xs font-bold font-heading text-indigospark">
                Kamu deklarasi: <span className="text-base">{me.declared}</span>
              </p>
            </div>
          </div>
        )}

        {/* Break Button */}
        <div className="flex justify-center">
          <button
            onClick={handleBreak}
            disabled={hasBreak}
            className={`
              w-64 h-64
              rounded-full
              flex items-center justify-center
              font-extrabold font-heading text-4xl
              border-4
              transition-all
              ${
                hasBreak
                  ? "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed"
                  : "bg-red-500 text-white border-red-600 hover:bg-red-600 active:scale-95 shadow-xl hover:shadow-2xl"
              }
            `}
          >
            {hasBreak ? "SUDAH BREAK" : "B R E A K"}
          </button>
        </div>

        {/* Opponent Status */}
        <div className="mt-8 text-center">
          <p className="text-xs font-bold font-heading text-slate-400 uppercase tracking-wide mb-2">
            Lawan
          </p>
          <p className="text-sm font-semibold text-slate-600 mb-2">
            {opponent?.name || "Menunggu..."}
          </p>

          {opponent?.declared ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block bg-yellowpulse/20 border-2 border-yellowpulse rounded-xl px-4 py-2"
            >
              <p className="text-xs font-bold font-heading text-indigospark">
                Deklarasi: <span className="text-sm">{opponent.declared}</span>
              </p>
            </motion.div>
          ) : (
            <div className="inline-block bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-2">
              <p className="text-xs font-bold font-heading text-slate-400">
                Belum deklarasi
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
