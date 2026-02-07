import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function HoldBreakGame({ room, onlinePlayers, playerName }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [myChoice, setMyChoice] = useState(null);
  const [myDeclared, setMyDeclared] = useState(false);
  const [showDeclareOptions, setShowDeclareOptions] = useState(false);

  const me = onlinePlayers.find((p) => p.id === playerName);
  const opponent = onlinePlayers.find((p) => p.id !== playerName);

  useEffect(() => {
    if (!room.phaseStartAt || !room.phaseDuration) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - room.phaseStartAt;
      const remaining = room.phaseDuration - elapsed;
      setTimeLeft(Math.max(0, Math.ceil(remaining / 1000)));
    }, 100);

    return () => clearInterval(interval);
  }, [room.phaseStartAt, room.phaseDuration]);

  useEffect(() => {
    if (!me) return;
    setMyChoice(me.choice || null);
    setMyDeclared(me.declared || false);
  }, [me]);

  const handleChoice = async (choice) => {
    if (myChoice) return;

    try {
      await updateDoc(doc(db, "rooms", room.code, "players", playerName), {
        choice: choice,
        choiceAt: Date.now(),
      });
    } catch (error) {
      console.error("Error making choice:", error);
    }
  };

  const handleDeclare = async (declaredChoice) => {
    if (myDeclared) return;

    try {
      await updateDoc(doc(db, "rooms", room.code, "players", playerName), {
        declared: true,
        declaredChoice: declaredChoice,
        declaredAt: Date.now(),
      });
      setShowDeclareOptions(false);
    } catch (error) {
      console.error("Error declaring:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Timer */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-2xl px-8 py-4 border-2 border-indigospark/20">
            <p className="text-xs font-bold font-heading text-slate-500 mb-1">
              WAKTU TERSISA
            </p>
            <p className="text-4xl font-extrabold font-heading text-indigospark">
              {timeLeft}s
            </p>
          </div>
        </div>

        {/* Game Table */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-bold font-heading text-slate-600">
              {opponent?.name || "Menunggu lawan..."}
            </p>
            <div className="flex gap-3">
              <div
                className={`w-24 h-32 rounded-xl border-2 flex items-center justify-center font-bold font-heading text-xs ${
                  opponent?.choice
                    ? "bg-indigospark/10 border-indigospark/30 text-indigospark"
                    : "bg-slate-100 border-slate-300 text-slate-400"
                }`}
              >
                {opponent?.choice ? "SUDAH PILIH" : "BELUM PILIH"}
              </div>

              <div
                className={`w-24 h-32 rounded-xl border-2 flex items-center justify-center font-bold font-heading text-sm ${
                  opponent?.declared
                    ? "bg-yellowpulse/20 border-yellowpulse text-indigospark"
                    : "bg-slate-50 border-slate-200 text-slate-300"
                }`}
              >
                {opponent?.declared
                  ? opponent.declaredChoice
                  : "TIDAK DEKLARASI"}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-slate-300"></div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-bold font-heading text-indigospark">
              Kamu ({playerName})
            </p>
            <div className="flex gap-3">
              <div
                className={`w-24 h-32 rounded-xl border-2 flex items-center justify-center font-bold font-heading text-sm ${
                  myChoice
                    ? "bg-indigospark text-white border-indigospark"
                    : "bg-white border-slate-300 text-slate-400"
                }`}
              >
                {myChoice || "BELUM PILIH"}
              </div>

              <div
                className={`w-24 h-32 rounded-xl border-2 flex items-center justify-center font-bold font-heading text-xs ${
                  myDeclared
                    ? "bg-yellowpulse text-indigospark border-yellowpulse"
                    : "bg-white border-slate-200 text-slate-300"
                }`}
              >
                {myDeclared ? me?.declaredChoice : "TIDAK DEKLARASI"}
              </div>

              <div className="w-24 h-32 rounded-xl border-2 border-slate-300 bg-white flex flex-col items-center justify-center gap-2 p-2">
                <p className="text-[9px] font-bold font-heading text-slate-400 text-center">
                  AKSI
                </p>
                <div className="text-xs text-slate-500 text-center leading-tight">
                  Pilih di bawah
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {!myChoice && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleChoice("HOLD")}
                className="py-4 bg-indigospark text-white rounded-2xl font-bold font-heading hover:bg-indigoflow active:scale-95 transition-all"
              >
                HOLD
              </button>
              <button
                onClick={() => handleChoice("BREAK")}
                className="py-4 bg-indigospark text-white rounded-2xl font-bold font-heading hover:bg-indigoflow active:scale-95 transition-all"
              >
                BREAK
              </button>
            </div>
          )}

          {!myDeclared && (
            <button
              onClick={() => setShowDeclareOptions(!showDeclareOptions)}
              className="w-full py-4 bg-yellowpulse text-indigospark rounded-2xl font-bold font-heading hover:bg-yellowpulse/80 active:scale-95 transition-all"
            >
              {showDeclareOptions ? "BATAL DEKLARASI" : "DEKLARASI"}
            </button>
          )}

          {showDeclareOptions && !myDeclared && (
            <div className="grid grid-cols-2 gap-3 p-4 bg-yellowpulse/10 rounded-2xl border-2 border-yellowpulse/30">
              <button
                onClick={() => handleDeclare("HOLD")}
                className="py-3 bg-white text-indigospark rounded-xl font-bold font-heading border-2 border-indigospark/30 hover:bg-indigospark/5 active:scale-95 transition-all text-sm"
              >
                Deklarasi HOLD
              </button>
              <button
                onClick={() => handleDeclare("BREAK")}
                className="py-3 bg-white text-indigospark rounded-xl font-bold font-heading border-2 border-indigospark/30 hover:bg-indigospark/5 active:scale-95 transition-all text-sm"
              >
                Deklarasi BREAK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
