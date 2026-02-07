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
        <div className="inline-block bg-green-100 border-2 border-green-400 rounded-xl px-3 py-1">
          <p className="text-xs font-bold font-heading text-green-700">
            MENANG
          </p>
        </div>
      );
    }
    if (score < 0) {
      return (
        <div className="inline-block bg-red-100 border-2 border-red-400 rounded-xl px-3 py-1">
          <p className="text-xs font-bold font-heading text-red-700">KALAH</p>
        </div>
      );
    }
    return (
      <div className="inline-block bg-slate-100 border-2 border-slate-300 rounded-xl px-3 py-1">
        <p className="text-xs font-bold font-heading text-slate-600">SERI</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Countdown */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-6"
        >
          <div className="inline-block bg-yellowpulse/20 rounded-2xl px-6 py-3 border-2 border-yellowpulse">
            <p className="text-sm font-bold font-heading text-indigospark">
              Phase berikutnya dalam {countdown}...
            </p>
          </div>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold font-heading text-indigospark mb-1">
            Hasil Phase
          </h2>
          <p className="text-slate-500 text-sm">Reveal</p>
        </div>

        {/* Results Cards */}
        <div className="space-y-3 mb-6">
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border-2 border-indigospark rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold font-heading text-slate-500 mb-1">
                  Kamu
                </p>
                <p className="text-lg font-extrabold font-heading text-indigospark">
                  {me?.name}
                </p>
              </div>
              <div className="text-right">
                {getResultBadge(me, true)}
                <p
                  className={`text-2xl font-extrabold font-heading mt-1 ${getScoreColor(me?.phaseScore || 0)}`}
                >
                  {me?.phaseScore >= 0 ? "+" : ""}
                  {me?.phaseScore || 0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-[10px] font-bold font-heading text-slate-500 mb-1">
                  Aksi
                </p>
                <p className="text-xs font-extrabold font-heading text-indigospark">
                  {getAction(me)}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-[10px] font-bold font-heading text-slate-500 mb-1">
                  Deklarasi
                </p>
                <p className="text-xs font-extrabold font-heading text-indigospark">
                  {me?.declared || "—"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-[10px] font-bold font-heading text-slate-500 mb-1">
                  Status
                </p>
                <p
                  className={`text-xs font-extrabold font-heading ${getHonestyColor(me)}`}
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
              className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-bold font-heading text-slate-500 mb-1">
                    Lawan
                  </p>
                  <p className="text-lg font-extrabold font-heading text-slate-700">
                    {opponent.name}
                  </p>
                </div>
                <div className="text-right">
                  {getResultBadge(opponent, false)}
                  <p
                    className={`text-2xl font-extrabold font-heading mt-1 ${getScoreColor(opponent.phaseScore || 0)}`}
                  >
                    {opponent.phaseScore >= 0 ? "+" : ""}
                    {opponent.phaseScore || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg p-2">
                  <p className="text-[10px] font-bold font-heading text-slate-500 mb-1">
                    Aksi
                  </p>
                  <p className="text-xs font-extrabold font-heading text-slate-700">
                    {getAction(opponent)}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-2">
                  <p className="text-[10px] font-bold font-heading text-slate-500 mb-1">
                    Deklarasi
                  </p>
                  <p className="text-xs font-extrabold font-heading text-slate-700">
                    {opponent.declared || "—"}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-2">
                  <p className="text-[10px] font-bold font-heading text-slate-500 mb-1">
                    Status
                  </p>
                  <p
                    className={`text-xs font-extrabold font-heading ${getHonestyColor(opponent)}`}
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
          className="bg-indigospark/5 border-2 border-indigospark/20 rounded-2xl p-4"
        >
          <p className="text-xs font-bold font-heading text-slate-500 text-center mb-2">
            Skor Total Saat Ini
          </p>
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-sm font-bold font-heading text-indigospark mb-1">
                {me?.name}
              </p>
              <p className="text-2xl font-extrabold font-heading text-indigospark">
                {me?.totalScore || 0}
              </p>
            </div>
            <div className="w-px bg-slate-300"></div>
            <div className="text-center">
              <p className="text-sm font-bold font-heading text-slate-700 mb-1">
                {opponent?.name}
              </p>
              <p className="text-2xl font-extrabold font-heading text-slate-700">
                {opponent?.totalScore || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
