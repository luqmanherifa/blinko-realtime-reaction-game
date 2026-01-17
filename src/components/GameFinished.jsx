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
          <h1 className="text-4xl font-black text-crimsondeep mb-2">
            Game Selesai!
          </h1>
          <p className="text-rosebold text-base">Hasil pertandingan</p>
        </div>

        {/* Winner Box */}
        {winners.length === 1 ? (
          <div className="bg-rosebold border-b-4 border-crimsondeep rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CrownIcon className="w-10 h-10 text-white" />
                <div>
                  <p className="text-white text-sm font-bold">Pemenang</p>
                  <p className="text-white text-2xl font-black">
                    {winners[0].name}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl px-4 py-2">
                <p className="text-crimsondeep text-xl font-black">
                  {winners[0].score}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-rosesoft border-b-4 border-rosebold rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <CrownIcon className="w-8 h-8 text-white" />
              <p className="text-white text-base font-bold">Hasil Seri!</p>
            </div>
            <div className="space-y-2">
              {winners.map((w) => (
                <div
                  key={w.id}
                  className="bg-white rounded-xl p-3 flex items-center justify-between"
                >
                  <p className="text-crimsondeep text-base font-black">
                    {w.name}
                  </p>
                  <p className="text-crimsondeep text-lg font-black">
                    {w.score}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Scores */}
        <div className="flex-1 overflow-hidden flex flex-col mb-6">
          <h4 className="font-bold text-crimsondeep text-lg mb-4">
            Skor Akhir
          </h4>
          <div className="flex-1 overflow-y-auto space-y-3">
            {sortedPlayers.map((p, index) => (
              <div
                key={p.id}
                className={`rounded-2xl p-4 flex items-center justify-between border-b-4 ${
                  index === 0
                    ? "bg-rosebold border-crimsondeep"
                    : index === 1
                      ? "bg-rosesoft border-rosebold"
                      : index === 2
                        ? "bg-blushlight border-rosesoft"
                        : "bg-white border-2 border-rosesoft"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-2xl font-black ${
                      index < 3 ? "text-white" : "text-rosebold"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <span
                    className={`font-bold text-base ${
                      index < 3 ? "text-white" : "text-crimsondeep"
                    }`}
                  >
                    {p.name}
                  </span>
                </div>
                <span
                  className={`text-xl font-black ${
                    index < 3 ? "text-white" : "text-crimsondeep"
                  }`}
                >
                  {p.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isGameMaster && (
            <button
              onClick={resetRoom}
              className="w-full bg-rosebold text-white py-4 rounded-2xl font-bold text-base hover:bg-rosesoft active:bg-crimsondeep transition-colors border-b-4 border-crimsondeep flex items-center justify-center gap-2"
            >
              <PlayIcon className="w-5 h-5" />
              Main Lagi
            </button>
          )}
          <button
            onClick={leaveRoom}
            className="w-full bg-white text-crimsondeep py-4 rounded-2xl font-bold text-base hover:bg-blushlight active:bg-rosesoft transition-colors border-2 border-rosesoft flex items-center justify-center gap-2"
          >
            <ExitIcon className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
