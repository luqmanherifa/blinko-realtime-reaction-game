import { PlayIcon, ExitIcon, TrophyIcon } from "./icons";

export default function GameFinished({
  room,
  onlinePlayers,
  playerName,
  resetRoom,
  isGameMaster,
  leaveRoom,
}) {
  if (room?.gameMode === "holdbreak") {
    const sortedPlayers = [...onlinePlayers].sort(
      (a, b) => (b.totalScore || 0) - (a.totalScore || 0),
    );
    const winner = sortedPlayers[0];
    const isWinner = winner?.id === playerName;

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold font-heading text-indigospark mb-2">
              {isWinner ? "Selamat!" : "Permainan Selesai"}
            </h1>
            <p className="text-indigoflow/50 text-base">
              {isWinner ? "Kamu menang!" : "Coba lagi!"}
            </p>
          </div>

          {/* Final Scores */}
          <div className="bg-white border-2 border-indigospark/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold font-heading text-slate-500 uppercase tracking-wide">
              <TrophyIcon className="w-5 h-5 text-yellowpulse" />
              <span>Hasil Akhir</span>
            </div>

            <div className="space-y-2">
              {sortedPlayers.map((p, index) => {
                const isMe = p.id === playerName;
                const isTop = index === 0;

                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all
                    ${
                      isMe
                        ? "bg-indigospark/10 border-2 border-indigospark/30"
                        : "bg-slate-50 border-2 border-slate-100"
                    }
                  `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 text-base font-bold font-heading ${
                          isTop ? "text-yellowpulse" : "text-slate-400"
                        }`}
                      >
                        #{index + 1}
                      </span>

                      <span
                        className={`truncate max-w-[180px] font-bold font-heading text-base
                      ${isMe ? "text-indigospark" : "text-slate-700"}
                    `}
                      >
                        {p.name}
                      </span>

                      {isMe && (
                        <span className="text-xs font-bold font-heading bg-indigospark text-white px-2 py-0.5 rounded">
                          Kamu
                        </span>
                      )}
                    </div>

                    <span
                      className={`font-extrabold font-heading text-xl
                    ${isMe ? "text-indigospark" : "text-slate-600"}
                  `}
                    >
                      {p.totalScore || 0}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isGameMaster && (
              <button
                onClick={resetRoom}
                className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold font-heading text-base hover:bg-indigoflow active:bg-indigonight transition-colors flex items-center justify-center gap-2 border-2 border-indigospark"
              >
                <PlayIcon className="w-5 h-5 text-yellowpulse" />
                Main Lagi
              </button>
            )}

            <button
              onClick={leaveRoom}
              className="w-full bg-white text-indigospark py-4 rounded-2xl font-bold font-heading text-base hover:bg-yellowpulse/10 active:bg-yellowpulse/20 transition-colors border-2 border-indigospark/30 flex items-center justify-center gap-2"
            >
              <ExitIcon className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sortedPlayers = [...onlinePlayers].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...onlinePlayers.map((p) => p.score));
  const winners = sortedPlayers.filter((p) => p.score === maxScore);
  const isWinner = winners.some((w) => w.id === playerName);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold font-heading text-indigospark mb-2">
            {isWinner ? "Selamat!" : "Permainan Selesai"}
          </h1>
          <p className="text-indigoflow/50 text-base">
            {isWinner ? "Kamu menang!" : "Coba lagi!"}
          </p>
        </div>

        {/* Leaderboard */}
        <div className="bg-white border-2 border-indigospark/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4 text-sm font-bold font-heading text-slate-500 uppercase tracking-wide">
            <TrophyIcon className="w-5 h-5 text-yellowpulse" />
            <span>Hasil Akhir</span>
          </div>

          <div className="space-y-2">
            {sortedPlayers.map((p, index) => {
              const isMe = p.id === playerName;
              const isTopPlayer = p.score === maxScore;

              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all
                    ${
                      isMe
                        ? "bg-indigospark/10 border-2 border-indigospark/30"
                        : "bg-slate-50 border-2 border-slate-100"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 text-base font-bold font-heading ${
                        isTopPlayer ? "text-yellowpulse" : "text-slate-400"
                      }`}
                    >
                      #{index + 1}
                    </span>

                    <span
                      className={`truncate max-w-[180px] font-bold font-heading text-base
                      ${isMe ? "text-indigospark" : "text-slate-700"}
                    `}
                    >
                      {p.name}
                    </span>

                    {isMe && (
                      <span className="text-xs font-bold font-heading bg-indigospark text-white px-2 py-0.5 rounded">
                        Kamu
                      </span>
                    )}
                  </div>

                  <span
                    className={`font-extrabold font-heading text-xl
                    ${isMe ? "text-indigospark" : "text-slate-600"}
                  `}
                  >
                    {p.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isGameMaster && (
            <button
              onClick={resetRoom}
              className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold font-heading text-base hover:bg-indigoflow active:bg-indigonight transition-colors flex items-center justify-center gap-2 border-2 border-indigospark"
            >
              <PlayIcon className="w-5 h-5 text-yellowpulse" />
              Main Lagi
            </button>
          )}

          <button
            onClick={leaveRoom}
            className="w-full bg-white text-indigospark py-4 rounded-2xl font-bold font-heading text-base hover:bg-yellowpulse/10 active:bg-yellowpulse/20 transition-colors border-2 border-indigospark/30 flex items-center justify-center gap-2"
          >
            <ExitIcon className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
