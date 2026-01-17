import { QUESTIONS } from "../constants";

export default function PlayingGame({
  room,
  onlinePlayers,
  playerName,
  timeLeft,
  answered,
  answer,
}) {
  const q = QUESTIONS[room.currentQuestion];
  const sortedPlayers = [...onlinePlayers].sort((a, b) => b.score - a.score);

  return (
    <div className="h-screen bg-white flex flex-col p-6">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold text-gray-600">
            Soal {room.currentQuestion + 1}/{QUESTIONS.length}
          </span>
          <div className="bg-red-100 text-red-700 px-5 py-2 rounded-full font-bold text-xl">
            ⏱ {timeLeft}s
          </div>
        </div>

        <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          {q.q}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {q.options.map((o) => (
            <button
              key={o}
              onClick={() => answer(o)}
              disabled={answered || timeLeft === 0}
              className={`py-8 rounded-2xl font-bold text-3xl ${
                answered || timeLeft === 0
                  ? "bg-gray-200 text-gray-400"
                  : "bg-blue-500 text-white"
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        {answered && (
          <div className="bg-green-100 border-2 border-green-400 rounded-2xl p-4 text-center mb-6">
            <p className="text-green-700 font-bold text-lg">
              Jawaban tersimpan! ✓
            </p>
          </div>
        )}

        <div className="flex-1 overflow-hidden flex flex-col">
          <h4 className="font-bold text-gray-700 text-xl mb-4">Skor Pemain</h4>
          <div className="flex-1 overflow-y-auto space-y-3">
            {sortedPlayers.map((p, index) => (
              <div
                key={p.id}
                className={`rounded-xl p-4 flex items-center justify-between ${
                  p.id === playerName ? "bg-yellow-100" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="font-bold text-gray-800 text-lg">
                    {p.name}
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  {p.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
