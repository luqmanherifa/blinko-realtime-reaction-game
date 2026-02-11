import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { TrophyIcon } from "./icons";

const DeclareButton = ({ label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="py-1.5 bg-white text-indigospark rounded-lg font-bold font-heading border border-indigospark text-[10px] hover:bg-indigospark hover:text-white transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {label}
  </button>
);

export default function HoldBreakGame({ room, onlinePlayers, playerName }) {
  const [canDeclare, setCanDeclare] = useState(true);
  const timeLeftRef = useRef(0);

  const me = useMemo(
    () => onlinePlayers.find((p) => p.id === playerName),
    [onlinePlayers, playerName],
  );

  const opponent = useMemo(
    () => onlinePlayers.find((p) => p.id !== playerName),
    [onlinePlayers, playerName],
  );

  const hasBreak = useMemo(() => !!me?.breakAt, [me?.breakAt]);
  const hasDeclared = useMemo(() => !!me?.declared, [me?.declared]);

  const progressMV = useMotionValue(100);

  const barColor = useTransform(progressMV, (v) => {
    if (v > 60) return "#22c55e";
    if (v > 30) return "#facc15";
    return "#ef4444";
  });

  useEffect(() => {
    if (!room.phaseStartAt || !room.phaseDuration) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - room.phaseStartAt;
      const remaining = room.phaseDuration - elapsed;
      timeLeftRef.current = Math.max(0, remaining);

      const declareWindowEnd = room.phaseStartAt + room.phaseDuration * 0.5;
      const canDeclareNow = Date.now() < declareWindowEnd;

      setCanDeclare((prev) => (prev !== canDeclareNow ? canDeclareNow : prev));
    }, 100);

    return () => clearInterval(interval);
  }, [room.phaseStartAt, room.phaseDuration]);

  const handleBreak = useCallback(async () => {
    if (me?.breakAt) return;

    try {
      await updateDoc(doc(db, "rooms", room.code, "players", playerName), {
        breakAt: Date.now(),
      });
    } catch (error) {
      console.error("Error breaking:", error);
    }
  }, [me?.breakAt, room.code, playerName]);

  const handleDeclareHold = useCallback(async () => {
    if (me?.declared) return;

    try {
      await updateDoc(doc(db, "rooms", room.code, "players", playerName), {
        declared: "HOLD",
        declaredAt: Date.now(),
      });
    } catch (error) {
      console.error("Error declaring:", error);
    }
  }, [me?.declared, room.code, playerName]);

  const handleDeclareBreak = useCallback(async () => {
    if (me?.declared) return;

    try {
      await updateDoc(doc(db, "rooms", room.code, "players", playerName), {
        declared: "BREAK",
        declaredAt: Date.now(),
      });
    } catch (error) {
      console.error("Error declaring:", error);
    }
  }, [me?.declared, room.code, playerName]);

  const Card = ({ children, className = "" }) => (
    <div
      className={`bg-white border-2 rounded-xl aspect-[5/7] ${className}`}
      style={{ width: "100%" }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Table View - Top Down */}
      <div className="flex-1 flex flex-col justify-center px-4 py-6">
        {/* Opponent's Side - Top */}
        <div className="mb-6">
          {/* Opponent Info - Single Line */}
          <div className="mb-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-xs font-bold font-heading text-indigospark">
                {opponent?.name || "Menunggu..."} (Lawan)
              </p>
              <div className="flex items-center gap-1">
                <TrophyIcon className="w-3.5 h-3.5 text-yellowpulse" />
                <span className="text-sm font-bold font-heading text-indigospark">
                  {opponent?.totalScore || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center max-w-md mx-auto">
            {/* Opponent's Declaration Card */}
            <div style={{ width: "45%" }}>
              <Card className="border-slate-300 p-3 flex flex-col">
                <div className="text-center mb-2">
                  <p className="text-[10px] font-bold font-heading text-slate-500">
                    DEKLARASI
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {opponent?.declared ? (
                    <p className="text-xl font-bold font-heading text-indigospark">
                      {opponent.declared}
                    </p>
                  ) : (
                    <div className="bg-slate-200 rounded px-4 py-2">
                      <p className="text-sm font-bold font-heading text-slate-400">
                        ???
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Opponent's Break Card */}
            <div style={{ width: "45%" }}>
              <Card className="border-slate-300 p-3 flex flex-col">
                <div className="text-center mb-2">
                  <p className="text-[10px] font-bold font-heading text-slate-500">
                    BREAK
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {opponent?.breakAt ? (
                    <p className="text-3xl">✓</p>
                  ) : (
                    <p className="text-sm font-bold font-heading text-slate-400">
                      -
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Center Timer Bar */}
        <div className="flex items-center justify-center my-0">
          <div className="w-full max-w-md">
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
        </div>

        {/* My Side - Bottom */}
        <div className="mt-6">
          <div className="flex gap-3 justify-center max-w-md mx-auto">
            {/* My Declaration Card */}
            <div style={{ width: "45%" }}>
              <Card className="border-indigospark p-3 flex flex-col">
                <div className="text-center mb-2">
                  <p className="text-[10px] font-bold font-heading text-indigospark">
                    DEKLARASI
                  </p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  {hasDeclared ? (
                    <p className="text-xl font-bold font-heading text-indigospark">
                      {me.declared}
                    </p>
                  ) : canDeclare && !hasBreak ? (
                    <div className="w-full grid grid-cols-1 gap-1.5">
                      <DeclareButton
                        label="HOLD"
                        onClick={handleDeclareHold}
                        disabled={hasDeclared}
                      />
                      <DeclareButton
                        label="BREAK"
                        onClick={handleDeclareBreak}
                        disabled={hasDeclared}
                      />
                    </div>
                  ) : (
                    <p className="text-[9px] font-bold font-heading text-slate-400 text-center px-1">
                      {hasBreak ? "Tunggu..." : "Waktu habis"}
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* My Break Card */}
            <div style={{ width: "45%" }}>
              <button
                onClick={handleBreak}
                disabled={hasBreak}
                className={`
                  w-full aspect-[5/7]
                  rounded-xl
                  border-2
                  p-3
                  flex flex-col
                  transition-all
                  ${
                    hasBreak
                      ? "bg-white border-slate-300 cursor-not-allowed"
                      : "bg-white border-red-500 hover:bg-red-50 active:scale-95"
                  }
                `}
              >
                <div className="text-center mb-2">
                  <p
                    className={`text-[10px] font-bold font-heading ${hasBreak ? "text-slate-500" : "text-red-500"}`}
                  >
                    BREAK
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className={`
                      w-full h-full
                      rounded-lg
                      flex items-center justify-center
                      font-extrabold font-heading
                      border-2
                      ${
                        hasBreak
                          ? "bg-slate-200 text-slate-400 border-slate-300"
                          : "bg-red-500 text-white border-red-600"
                      }
                    `}
                  >
                    <span className="text-2xl">{hasBreak ? "✓" : "!"}</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* My Info - Single Line */}
          <div className="mt-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-xs font-bold font-heading text-indigospark">
                {me?.name} (Kamu)
              </p>
              <div className="flex items-center gap-1">
                <TrophyIcon className="w-3.5 h-3.5 text-yellowpulse" />
                <span className="text-sm font-bold font-heading text-indigospark">
                  {me?.totalScore || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
