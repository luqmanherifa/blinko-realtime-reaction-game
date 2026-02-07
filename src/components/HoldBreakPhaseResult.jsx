import { useEffect, useState } from "react";

export default function HoldBreakPhaseResult({
  onlinePlayers,
  playerName,
  onNextPhase,
}) {
  const [countdown, setCountdown] = useState(5);

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

  const getHonestyLabel = (player) => {
    if (!player.declared) return "Diam";
    if (player.declaredChoice === player.choice) return "Jujur";
    return "Bohong";
  };

  const getHonestyColor = (player) => {
    if (!player.declared) return "text-slate-600";
    if (player.declaredChoice === player.choice) return "text-green-600";
    return "text-red-600";
  };

  const getScoreColor = (score) => {
    if (score > 0) return "text-green-600";
    if (score < 0) return "text-red-600";
    return "text-slate-600";
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Countdown */}
        <div className="text-center mb-6">
          <div className="inline-block bg-yellowpulse/20 rounded-2xl px-6 py-3 border-2 border-yellowpulse">
            <p className="text-sm font-bold font-heading text-indigospark">
              Phase berikutnya dalam {countdown}...
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold font-heading text-indigospark mb-2">
            Hasil Phase
          </h2>
          <p className="text-indigoflow/50 text-sm">Hold/Break</p>
        </div>

        {/* Results */}
        <div className="space-y-3 mb-6">
          {/* My Result */}
          <div className="bg-white border-2 border-indigospark rounded-2xl p-5">
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
                <p className="text-xs font-bold font-heading text-slate-500 mb-1">
                  Skor Phase
                </p>
                <p
                  className={`text-2xl font-extrabold font-heading ${getScoreColor(me?.finalScore || 0)}`}
                >
                  {me?.finalScore >= 0 ? "+" : ""}
                  {me?.finalScore || 0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-[10px] font-bold font-heading text-slate-500 mb-1">
                  Pilihan
                </p>
                <p className="text-xs font-extrabold font-heading text-indigospark">
                  {me?.choice || "TIDAK PILIH"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-2">
                <p className="text-[10px] font-bold font-heading text-slate-500 mb-1">
                  Deklarasi
                </p>
                <p className="text-xs font-extrabold font-heading text-indigospark">
                  {me?.declaredChoice || "-"}
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
          </div>

          {/* Opponent Result */}
          {opponent && (
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
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
                  <p className="text-xs font-bold font-heading text-slate-500 mb-1">
                    Skor Phase
                  </p>
                  <p
                    className={`text-2xl font-extrabold font-heading ${getScoreColor(opponent.finalScore || 0)}`}
                  >
                    {opponent.finalScore >= 0 ? "+" : ""}
                    {opponent.finalScore || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-lg p-2">
                  <p className="text-[10px] font-bold font-heading text-slate-500 mb-1">
                    Pilihan
                  </p>
                  <p className="text-xs font-extrabold font-heading text-slate-700">
                    {opponent.choice || "TIDAK PILIH"}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-2">
                  <p className="text-[10px] font-bold font-heading text-slate-500 mb-1">
                    Deklarasi
                  </p>
                  <p className="text-xs font-extrabold font-heading text-slate-700">
                    {opponent.declaredChoice || "-"}
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
            </div>
          )}
        </div>

        {/* Current Total Score */}
        <div className="bg-indigospark/5 border-2 border-indigospark/20 rounded-2xl p-4">
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
        </div>
      </div>
    </div>
  );
}
