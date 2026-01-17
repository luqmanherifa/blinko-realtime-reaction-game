export default function WaitingRoom({
  room,
  onlinePlayers,
  playerName,
  startGame,
  isGameMaster,
  leaveRoom,
}) {
  return (
    <div className="h-screen bg-white flex flex-col p-6">
      <div className="flex-1 flex flex-col">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {room.roomName}
        </h2>

        <div className="bg-yellow-50 border-4 border-yellow-400 rounded-2xl p-6 mb-8">
          <p className="text-sm text-gray-600 mb-1">Kode Ruangan</p>
          <p className="text-4xl font-bold text-yellow-700 tracking-wider mb-2">
            {room.code}
          </p>
          <p className="text-sm text-gray-600">
            Bagikan kode ini ke teman-teman!
          </p>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <h4 className="font-bold text-gray-700 text-xl mb-4">
            Pemain Online ({onlinePlayers.length})
          </h4>
          <div className="flex-1 overflow-y-auto space-y-3 mb-6">
            {onlinePlayers.map((p) => (
              <div
                key={p.id}
                className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
              >
                <span className="font-bold text-gray-800 text-lg">
                  {p.name}
                </span>
                <div className="flex gap-2">
                  {p.id === playerName && (
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      Kamu
                    </span>
                  )}
                  {p.isGameMaster && (
                    <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                      Host
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {isGameMaster && (
            <button
              onClick={startGame}
              className="w-full bg-green-500 text-white py-5 rounded-2xl font-bold text-xl"
            >
              Mulai Game
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
