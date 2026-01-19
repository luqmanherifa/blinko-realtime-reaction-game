import { CrownIcon } from "./icons";

export default function Leaderboard({ players, onBack }) {
  const sortedPlayers = [...players].sort((a, b) => b.totalWins - a.totalWins);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col h-[90vh]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-extrabold text-indigospark mb-2">
            Leaderboard
          </h1>
          <p className="text-indigoflow text-base">Peringkat pemain terbaik</p>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-6">
          {sortedPlayers.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-indigospark/50 text-base">
                Belum ada data pemain
              </p>
            </div>
          ) : (
            sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="rounded-2xl p-4 bg-white border-2 border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl font-extrabold flex-shrink-0 text-indigospark">
                      #{index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-base block truncate text-indigospark">
                        {player.name}
                      </span>
                      <span className="text-xs font-medium block text-slate-500">
                        {player.gamesPlayed} game •{" "}
                        {new Date(player.lastPlayed).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold flex items-center gap-1.5 flex-shrink-0 ml-2 text-indigospark">
                    <CrownIcon
                      className={`w-5 h-5 ${
                        index < 3 ? "text-yellowpulse" : "text-indigospark/50"
                      }`}
                    />
                    {player.totalWins}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold text-base hover:bg-indigoflow active:bg-indigonight transition-colors border-2 border-indigospark"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
