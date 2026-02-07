import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { TrophyIcon } from "./icons";
import { QUESTIONS, QUESTION_DURATION } from "../constants";

export default function DontBlinkGame({
  room,
  onlinePlayers,
  playerName,
  timeLeft,
  answered,
  shuffledQuestions,
  answer,
}) {
  const q = shuffledQuestions[room.currentQuestion];
  const sortedPlayers = [...onlinePlayers].sort((a, b) => b.score - a.score);
  const progressMV = useMotionValue(100);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSubmitting(false);
  }, [room.currentQuestion]);

  const barColor = useTransform(progressMV, (v) => {
    if (v > 60) return "#22c55e";
    if (v > 30) return "#facc15";
    return "#ef4444";
  });

  const handleAnswer = async (option) => {
    if (isSubmitting || answered) return;

    setIsSubmitting(true);

    try {
      await answer(option);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmitting(false);
    }
  };

  const isDisabled = answered || isSubmitting;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Leaderboard */}
      <div className="border-b border-slate-200 px-6 py-4 bg-white">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold font-heading text-slate-500 uppercase tracking-wide">
          <TrophyIcon className="w-4 h-4 text-yellowpulse" />
          <span className="mt-[4px]">Klasemen</span>
        </div>

        <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
          {sortedPlayers.map((p, index) => {
            const isMe = p.id === playerName;

            return (
              <div
                key={p.id}
                className={`flex items-center justify-between px-4 py-2 rounded-lg transition-all
                  ${
                    isMe
                      ? "bg-indigospark/5 border border-indigospark/20"
                      : "bg-slate-50 border border-slate-100"
                  }
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 text-xs font-bold font-heading text-slate-400">
                    #{index + 1}
                  </span>

                  <span
                    className={`truncate max-w-[140px] font-semibold text-xs
                    ${isMe ? "text-indigospark" : "text-slate-700"}
                  `}
                  >
                    {p.name}
                  </span>

                  {isMe && (
                    <span className="text-[9px] font-bold font-heading bg-indigospark text-white px-1.5 py-0.5 rounded">
                      Kamu
                    </span>
                  )}
                </div>

                <span
                  className={`font-bold font-heading text-sm
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        {/* Timer Indicator */}
        <div className="mb-6">
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              key={room.currentQuestion}
              className="h-full"
              style={{
                backgroundColor: barColor,
              }}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{
                duration: QUESTION_DURATION / 1000,
                ease: "linear",
              }}
              onUpdate={(latest) => {
                const percentage = (parseFloat(latest.width) / 100) * 100;
                progressMV.set(percentage);
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="text-center space-y-2 mb-8">
          <p className="text-xs font-semibold font-heading text-slate-400 uppercase tracking-wide">
            Soal {room.currentQuestion + 1} / {QUESTIONS.length}
          </p>
          <h3 className="text-2xl font-extrabold font-heading text-indigospark leading-snug">
            {q.q}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4">
          {q.options.map((o) => (
            <button
              key={o}
              onClick={() => handleAnswer(o)}
              disabled={isDisabled}
              className={`
                aspect-square
                rounded-3xl
                flex items-center justify-center
                font-extrabold font-heading text-3xl
                border-2
                transition-all
                ${
                  isDisabled
                    ? "bg-slate-100 text-indigospark border-slate-200 cursor-not-allowed"
                    : "bg-indigospark text-white border-indigospark hover:bg-indigoflow hover:border-indigoflow active:scale-95"
                }
              `}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
