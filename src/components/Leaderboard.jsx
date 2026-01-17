import { CrownIcon } from "./icons";

export default function Leaderboard({ players, onBack }) {
  const sortedPlayers = [...players].sort((a, b) => b.totalWins - a.totalWins);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col h-[90vh]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-crimsondeep mb-2">
            Leaderboard
          </h1>
          <p className="text-rosebold text-base">Peringkat pemain terbaik</p>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-6">
          {sortedPlayers.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-rosesoft text-lg">Belum ada data pemain</p>
            </div>
          ) : (
            sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`rounded-2xl p-5 border-b-4 transition-colors ${
                  index === 0
                    ? "bg-rosebold border-crimsondeep"
                    : index === 1
                      ? "bg-rosesoft border-rosebold"
                      : index === 2
                        ? "bg-blushlight border-rosesoft"
                        : "bg-white border-2 border-rosesoft"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-3xl font-black ${
                        index < 3 ? "text-white" : "text-rosebold"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        index < 3 ? "text-white" : "text-crimsondeep"
                      }`}
                    >
                      {player.name}
                    </span>
                  </div>
                  <span
                    className={`text-2xl font-bold flex items-center gap-2 ${
                      index < 3 ? "text-white" : "text-crimsondeep"
                    }`}
                  >
                    <CrownIcon className="w-6 h-6" />
                    {player.totalWins}
                  </span>
                </div>
                <div
                  className={`text-sm font-medium ${
                    index < 3 ? "text-white" : "text-rosebold"
                  }`}
                >
                  {player.gamesPlayed} game •{" "}
                  {new Date(player.lastPlayed).toLocaleDateString("id-ID")}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full bg-rosebold text-white py-4 rounded-2xl font-bold text-base hover:bg-rosesoft active:bg-crimsondeep transition-colors border-b-4 border-crimsondeep"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
