import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HoldBreakPhaseResult({
  onlinePlayers,
  playerName,
  onNextPhase,
}) {
  const [countdown, setCountdown] = useState(3);

  const me = onlinePlayers.find((p) => p.id === playerName);
  const opponent = onlinePlayers.find((p) => p.id !== playerName);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onNextPhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onNextPhase]);

  const getAction = (player) => {
    if (!player) return "—";
    return player.breakAt ? "BREAK" : "HOLD";
  };

  const getHonestyLabel = (player) => {
    if (!player) return "—";
    if (!player.declared) return "Diam";

    const actualAction = player.breakAt ? "BREAK" : "HOLD";
    const isHonest = player.declared === actualAction;

    return isHonest ? "Jujur" : "Bohong";
  };

  const getHonestyColor = (player) => {
    if (!player || !player.declared) return "text-slate-600";

    const actualAction = player.breakAt ? "BREAK" : "HOLD";
    const isHonest = player.declared === actualAction;

    return isHonest ? "text-green-600" : "text-red-600";
  };

  const getScoreColor = (score) => {
    if (score > 0) return "text-green-600";
    if (score < 0) return "text-red-600";
    return "text-slate-600";
  };

  const getResultBadge = (player, isMe) => {
    const score = player?.phaseScore || 0;
    if (score > 0) {
      return (
        <div className="inline-block bg-green-100 border border-green-400 rounded-lg px-2 py-0.5">
          <p className="text-[10px] font-bold font-heading text-green-700">
            MENANG
          </p>
        </div>
      );
    }
    if (score < 0) {
      return (
        <div className="inline-block bg-red-100 border border-red-400 rounded-lg px-2 py-0.5">
          <p className="text-[10px] font-bold font-heading text-red-700">
            KALAH
          </p>
        </div>
      );
    }
    return (
      <div className="inline-block bg-slate-100 border border-slate-300 rounded-lg px-2 py-0.5">
        <p className="text-[10px] font-bold font-heading text-slate-600">
          SERI
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Countdown */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-3"
        >
          <div className="inline-block bg-yellowpulse/20 rounded-xl px-4 py-1.5 border border-yellowpulse">
            <p className="text-xs font-bold font-heading text-indigospark">
              Phase berikutnya dalam {countdown}...
            </p>
          </div>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-3">
          <h2 className="text-xl font-extrabold font-heading text-indigospark mb-0.5">
            Hasil Phase
          </h2>
          <p className="text-slate-500 text-xs">Reveal</p>
        </div>

        {/* Results Cards */}
        <div className="space-y-2 mb-3">
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border-2 border-indigospark rounded-xl p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[10px] font-bold font-heading text-slate-500 mb-0.5">
                  Kamu
                </p>
                <p className="text-sm font-extrabold font-heading text-indigospark">
                  {me?.name}
                </p>
              </div>
              <div className="text-right">
                {getResultBadge(me, true)}
                <p
                  className={`text-xl font-extrabold font-heading mt-0.5 ${getScoreColor(me?.phaseScore || 0)}`}
                >
                  {me?.phaseScore >= 0 ? "+" : ""}
                  {me?.phaseScore || 0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-slate-50 rounded-lg p-1.5">
                <p className="text-[9px] font-bold font-heading text-slate-500 mb-0.5">
                  Aksi
                </p>
                <p className="text-[11px] font-extrabold font-heading text-indigospark">
                  {getAction(me)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-1.5">
                <p className="text-[9px] font-bold font-heading text-slate-500 mb-0.5">
                  Deklarasi
                </p>
                <p className="text-[11px] font-extrabold font-heading text-indigospark">
                  {me?.declared || "—"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-1.5">
                <p className="text-[9px] font-bold font-heading text-slate-500 mb-0.5">
                  Status
                </p>
                <p
                  className={`text-[11px] font-extrabold font-heading ${getHonestyColor(me)}`}
                >
                  {getHonestyLabel(me)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Opponent Result */}
          {opponent && (
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-slate-50 border-2 border-slate-200 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[10px] font-bold font-heading text-slate-500 mb-0.5">
                    Lawan
                  </p>
                  <p className="text-sm font-extrabold font-heading text-slate-700">
                    {opponent.name}
                  </p>
                </div>
                <div className="text-right">
                  {getResultBadge(opponent, false)}
                  <p
                    className={`text-xl font-extrabold font-heading mt-0.5 ${getScoreColor(opponent.phaseScore || 0)}`}
                  >
                    {opponent.phaseScore >= 0 ? "+" : ""}
                    {opponent.phaseScore || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-white rounded-lg p-1.5">
                  <p className="text-[9px] font-bold font-heading text-slate-500 mb-0.5">
                    Aksi
                  </p>
                  <p className="text-[11px] font-extrabold font-heading text-slate-700">
                    {getAction(opponent)}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-1.5">
                  <p className="text-[9px] font-bold font-heading text-slate-500 mb-0.5">
                    Deklarasi
                  </p>
                  <p className="text-[11px] font-extrabold font-heading text-slate-700">
                    {opponent.declared || "—"}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-1.5">
                  <p className="text-[9px] font-bold font-heading text-slate-500 mb-0.5">
                    Status
                  </p>
                  <p
                    className={`text-[11px] font-extrabold font-heading ${getHonestyColor(opponent)}`}
                  >
                    {getHonestyLabel(opponent)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Total Score */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-indigospark/5 border-2 border-indigospark/20 rounded-xl p-3"
        >
          <p className="text-[10px] font-bold font-heading text-slate-500 text-center mb-1.5">
            Skor Total Saat Ini
          </p>
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-xs font-bold font-heading text-indigospark mb-0.5">
                {me?.name}
              </p>
              <p className="text-xl font-extrabold font-heading text-indigospark">
                {me?.totalScore || 0}
              </p>
            </div>
            <div className="w-px bg-slate-300"></div>
            <div className="text-center">
              <p className="text-xs font-bold font-heading text-slate-700 mb-0.5">
                {opponent?.name}
              </p>
              <p className="text-xl font-extrabold font-heading text-slate-700">
                {opponent?.totalScore || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
