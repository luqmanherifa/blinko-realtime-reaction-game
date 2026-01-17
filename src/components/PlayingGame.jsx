import { QUESTIONS } from "../constants";
import { TimerIcon } from "./icons";

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
  const myPosition = sortedPlayers.findIndex((p) => p.id === playerName) + 1;
  const myScore = sortedPlayers.find((p) => p.id === playerName)?.score || 0;

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Compact Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-blushlight px-4 py-2 rounded-xl border-2 border-rosesoft">
            <span className="text-sm font-black text-crimsondeep">
              Soal {room.currentQuestion + 1}/{QUESTIONS.length}
            </span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border-2 border-rosesoft">
            <span className="text-sm font-black text-rosebold">
              #{myPosition} · {myScore}
            </span>
          </div>
        </div>
        <div className="bg-rosebold px-4 py-2 rounded-xl border-b-4 border-crimsondeep flex items-center gap-2">
          <TimerIcon className="w-4 h-4 text-white" />
          <span className="font-black text-lg text-white">{timeLeft}s</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl flex flex-col">
          {/* Question */}
          <div className="bg-blushlight border-4 border-rosesoft rounded-3xl p-8 mb-4">
            <h3 className="text-3xl font-black text-crimsondeep text-center leading-tight">
              {q.q}
            </h3>
          </div>

          {/* Compact Leaderboard */}
          <div className="mb-8 overflow-hidden">
            <div className="flex gap-2 justify-center">
              {sortedPlayers.slice(0, 3).map((p, index) => (
                <div
                  key={p.id}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                    p.id === playerName
                      ? "bg-rosebold"
                      : index === 0
                        ? "bg-rosesoft"
                        : "bg-blushlight"
                  }`}
                >
                  <span
                    className={`text-xs font-black ${
                      p.id === playerName || index === 0
                        ? "text-white"
                        : "text-rosebold"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      p.id === playerName || index === 0
                        ? "text-white"
                        : "text-crimsondeep"
                    }`}
                  >
                    {p.name}
                  </span>
                  <span
                    className={`text-xs font-black ${
                      p.id === playerName || index === 0
                        ? "text-white"
                        : "text-crimsondeep"
                    }`}
                  >
                    {p.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {q.options.map((o) => (
              <button
                key={o}
                onClick={() => answer(o)}
                disabled={answered || timeLeft === 0}
                className={`py-12 rounded-2xl font-black text-2xl border-b-4 transition-colors ${
                  answered || timeLeft === 0
                    ? "bg-blushlight text-rosesoft border-rosesoft cursor-not-allowed"
                    : "bg-rosebold text-white border-crimsondeep hover:bg-rosesoft active:bg-crimsondeep"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
