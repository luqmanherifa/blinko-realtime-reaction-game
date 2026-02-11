import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { TrophyIcon } from "./icons";

export default function HoldBreakGame({ room, onlinePlayers, playerName }) {
  const [canDeclare, setCanDeclare] = useState(true);
  const timeLeftRef = useRef(0);

  const me = onlinePlayers.find((p) => p.id === playerName);
  const opponent = onlinePlayers.find((p) => p.id !== playerName);

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
    } catch (error) {
      console.error("Error declaring:", error);
    }
  };

  const hasBreak = !!me?.breakAt;
  const hasDeclared = !!me?.declared;

  const Card = ({ children, className = "" }) => (
    <div
      className={`bg-white border-2 rounded-xl aspect-[5/7] ${className}`}
      style={{ width: "100%" }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Timer Bar - Top */}
      <div className="bg-white border-b-2 border-slate-200 px-4 py-2">
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

      {/* Table View - Top Down */}
      <div className="flex-1 flex flex-col justify-center px-4 py-4">
        {/* Opponent's Side - Top */}
        <div className="mb-4">
          {/* Opponent Info */}
          <div className="mb-2 text-center">
            <p className="text-[10px] font-bold font-heading text-slate-400 uppercase tracking-wide mb-1">
              LAWAN
            </p>
            <p className="text-xs font-bold font-heading text-indigospark">
              {opponent?.name || "Menunggu..."}
            </p>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <TrophyIcon className="w-3 h-3 text-yellowpulse" />
              <span className="text-sm font-bold font-heading text-indigospark">
                {opponent?.totalScore || 0}
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            {/* Opponent's Declaration Card */}
            <div style={{ width: "45%" }}>
              <Card className="border-slate-300 p-2 flex flex-col">
                <div className="text-center mb-1">
                  <p className="text-[10px] font-bold font-heading text-slate-500">
                    DEKLARASI
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {opponent?.declared ? (
                    <p className="text-lg font-bold font-heading text-indigospark">
                      {opponent.declared}
                    </p>
                  ) : (
                    <div className="bg-slate-200 rounded px-3 py-1">
                      <p className="text-xs font-bold font-heading text-slate-400">
                        ???
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Opponent's Break Card */}
            <div style={{ width: "45%" }}>
              <Card className="border-slate-300 p-2 flex flex-col">
                <div className="text-center mb-1">
                  <p className="text-[10px] font-bold font-heading text-slate-500">
                    BREAK
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {opponent?.breakAt ? (
                    <p className="text-2xl">✓</p>
                  ) : (
                    <p className="text-xs font-bold font-heading text-slate-400">
                      -
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Center Divider */}
        <div className="flex items-center justify-center my-2">
          <div className="h-px bg-slate-300 flex-1"></div>
          <div className="px-4">
            <div className="w-8 h-8 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            </div>
          </div>
          <div className="h-px bg-slate-300 flex-1"></div>
        </div>

        {/* My Side - Bottom */}
        <div className="mt-4">
          <div className="flex gap-2 justify-center">
            {/* My Declaration Card */}
            <div style={{ width: "45%" }}>
              <Card className="border-indigospark p-2 flex flex-col">
                <div className="text-center mb-1">
                  <p className="text-[10px] font-bold font-heading text-indigospark">
                    DEKLARASI
                  </p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  {hasDeclared ? (
                    <p className="text-lg font-bold font-heading text-indigospark">
                      {me.declared}
                    </p>
                  ) : canDeclare && !hasBreak ? (
                    <div className="w-full grid grid-cols-1 gap-1">
                      <button
                        onClick={() => handleDeclare("HOLD")}
                        className="py-1.5 bg-white text-indigospark rounded-lg font-bold font-heading border border-indigospark text-[10px] hover:bg-indigospark hover:text-white transition-colors active:scale-95"
                      >
                        HOLD
                      </button>
                      <button
                        onClick={() => handleDeclare("BREAK")}
                        className="py-1.5 bg-white text-indigospark rounded-lg font-bold font-heading border border-indigospark text-[10px] hover:bg-indigospark hover:text-white transition-colors active:scale-95"
                      >
                        BREAK
                      </button>
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
                  p-2
                  flex flex-col
                  transition-all
                  ${
                    hasBreak
                      ? "bg-white border-slate-300 cursor-not-allowed"
                      : "bg-white border-red-500 hover:bg-red-50 active:scale-95"
                  }
                `}
              >
                <div className="text-center mb-1">
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
                    <span className="text-xl">{hasBreak ? "✓" : "!"}</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* My Info */}
          <div className="mt-2 text-center">
            <p className="text-[10px] font-bold font-heading text-yellowpulse uppercase tracking-wide mb-1">
              KAMU
            </p>
            <p className="text-xs font-bold font-heading text-indigospark">
              {me?.name}
            </p>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <TrophyIcon className="w-3 h-3 text-yellowpulse" />
              <span className="text-sm font-bold font-heading text-indigospark">
                {me?.totalScore || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
