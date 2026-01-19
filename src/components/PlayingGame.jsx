import { QUESTIONS } from "../constants";
import { TimerIcon, CrownIcon } from "./icons";

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
  const isLowTime = timeLeft <= 5;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Score & Timer */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="bg-yellowpulse w-10 h-10 rounded-xl flex items-center justify-center">
            <span className="text-base font-extrabold text-white">
              #{myPosition}
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold leading-tight">
              Skor Kamu
            </p>
            <p className="text-indigospark text-xl font-extrabold leading-tight">
              {myScore}
            </p>
          </div>
        </div>
        <div
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 border-2 transition-all ${
            isLowTime
              ? "bg-red-500 border-red-600 animate-pulse"
              : "bg-indigospark border-indigospark"
          }`}
        >
          <TimerIcon
            className={`w-4 h-4 ${isLowTime ? "text-white" : "text-yellowpulse"}`}
          />
          <span className="font-extrabold text-xl text-white">{timeLeft}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between px-6 py-8">
        <div className="space-y-6">
          {/* Question Number */}
          <div className="flex justify-center">
            <div className="bg-slate-100 px-4 py-1.5 rounded-full">
              <span className="text-xs font-semibold text-slate-600">
                Soal {room.currentQuestion + 1} dari {QUESTIONS.length}
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl px-6 py-12">
            <h3 className="text-2xl font-extrabold text-indigospark text-center leading-snug">
              {q.q}
            </h3>
          </div>

          {/* Top Live Score */}
          <div className="border border-slate-200 rounded-xl p-3 mb-6">
            <div className="space-y-2">
              {sortedPlayers.slice(0, 3).map((p, index) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {index === 0 ? (
                      <CrownIcon className="w-4 h-4 text-yellowpulse" />
                    ) : (
                      <span className="text-xs font-bold w-4 text-center text-slate-400">
                        {index + 1}
                      </span>
                    )}
                    <span
                      className={`text-sm font-bold truncate max-w-[140px] ${
                        p.id === playerName
                          ? "text-indigospark"
                          : "text-slate-700"
                      }`}
                    >
                      {p.name}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-extrabold ${
                      p.id === playerName
                        ? "text-indigospark"
                        : "text-slate-700"
                    }`}
                  >
                    {p.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {q.options.map((o) => (
            <button
              key={o}
              onClick={() => answer(o)}
              disabled={answered || timeLeft === 0}
              className={`py-5 rounded-2xl font-bold text-lg border-2 transition-all ${
                answered || timeLeft === 0
                  ? "bg-slate-100 text-indigospark border-slate-200 cursor-not-allowed"
                  : "bg-indigospark text-white border-indigospark hover:bg-indigoflow hover:border-indigoflow active:scale-[0.98]"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
