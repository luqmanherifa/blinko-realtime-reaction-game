import { CrownIcon, PlayIcon, ExitIcon } from "./icons";

export default function GameFinished({
  onlinePlayers,
  playerName,
  resetRoom,
  isGameMaster,
  leaveRoom,
}) {
  const maxScore = Math.max(...onlinePlayers.map((p) => p.score));
  const winners = onlinePlayers.filter((p) => p.score === maxScore);
  const sortedPlayers = [...onlinePlayers].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col h-[90vh]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-indigospark mb-2">
            Game Selesai!
          </h1>
          <p className="text-indigoflow text-base">Hasil pertandingan</p>
        </div>

        {/* Winner Box */}
        {winners.length === 1 ? (
          <div className="bg-yellowpulse/20 border-2 border-yellowpulse/40 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CrownIcon className="w-10 h-10 text-yellowpulse" />
                <div>
                  <p className="text-indigoflow text-sm font-bold">Pemenang</p>
                  <p className="text-indigospark text-2xl font-extrabold">
                    {winners[0].name}
                  </p>
                </div>
              </div>
              <div className="bg-yellowpulse/30 rounded-xl px-4 py-2 border-2 border-yellowpulse/50">
                <p className="text-indigospark text-xl font-extrabold">
                  {winners[0].score}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellowpulse/10 border-2 border-yellowpulse/30 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <CrownIcon className="w-8 h-8 text-indigospark" />
              <p className="text-indigospark text-base font-bold">
                Hasil Seri!
              </p>
            </div>
            <div className="space-y-2">
              {winners.map((w) => (
                <div
                  key={w.id}
                  className="bg-white border-2 border-slate-200 rounded-xl p-3 flex items-center justify-between"
                >
                  <p className="text-indigospark text-base font-extrabold">
                    {w.name}
                  </p>
                  <p className="text-indigospark text-lg font-extrabold">
                    {w.score}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Scores */}
        <div className="flex-1 overflow-hidden flex flex-col mb-6">
          <h4 className="font-bold text-indigospark text-lg mb-4">
            Skor Akhir
          </h4>
          <div className="flex-1 overflow-y-auto space-y-2">
            {sortedPlayers.map((p, index) => (
              <div
                key={p.id}
                className="rounded-2xl p-4 bg-white border-2 border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xl font-extrabold ${
                        index < 3 ? "text-yellowpulse" : "text-indigospark"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <span className="font-bold text-base text-indigospark">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-lg font-extrabold text-indigospark">
                    {p.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isGameMaster && (
            <button
              onClick={resetRoom}
              className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold text-base hover:bg-indigoflow active:bg-indigonight transition-colors border-2 border-indigospark flex items-center justify-center gap-2"
            >
              <PlayIcon className="w-5 h-5 text-yellowpulse" />
              Main Lagi
            </button>
          )}
          <button
            onClick={leaveRoom}
            className="w-full bg-white text-indigospark py-4 rounded-2xl font-bold text-base hover:bg-yellowpulse/10 active:bg-yellowpulse/20 transition-colors border-2 border-indigospark/30 flex items-center justify-center gap-2"
          >
            <ExitIcon className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
