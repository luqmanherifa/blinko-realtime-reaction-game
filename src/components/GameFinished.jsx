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
    <div className="h-screen bg-white flex flex-col p-6">
      <div className="flex-1 flex flex-col">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Game Selesai!
        </h2>

        {winners.length === 1 ? (
          <div className="bg-yellow-400 rounded-2xl p-8 mb-8">
            <p className="text-white text-lg mb-2 text-center">🏆 Pemenang</p>
            <p className="text-white text-3xl font-bold text-center">
              {winners[0].name}
            </p>
          </div>
        ) : (
          <div className="bg-orange-400 rounded-2xl p-8 mb-8">
            <p className="text-white text-lg mb-3 text-center">🤝 Seri!</p>
            <div className="space-y-2">
              {winners.map((w) => (
                <p
                  key={w.id}
                  className="text-white text-2xl font-bold text-center"
                >
                  {w.name}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden flex flex-col">
          <h4 className="font-bold text-gray-700 text-xl mb-4">Skor Akhir</h4>
          <div className="flex-1 overflow-y-auto space-y-3 mb-6">
            {sortedPlayers.map((p, index) => (
              <div
                key={p.id}
                className="bg-gray-50 rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="font-bold text-gray-800 text-lg">
                    {p.name}
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-800">
                  {p.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {isGameMaster && (
            <button
              onClick={resetRoom}
              className="w-full bg-green-500 text-white py-5 rounded-2xl font-bold text-xl"
            >
              Main Lagi
            </button>
          )}
          <button
            onClick={leaveRoom}
            className="w-full bg-red-500 text-white py-5 rounded-2xl font-bold text-xl"
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
