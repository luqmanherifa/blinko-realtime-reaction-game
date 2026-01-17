import { displayName } from "../utils/player";
import { QUESTIONS } from "../constants";

export default function PlayingGame({
  room,
  onlinePlayers,
  playerId,
  timeLeft,
  answered,
  answer,
}) {
  const q = QUESTIONS[room.currentQuestion];

  return (
    <div style={{ padding: 24 }}>
      <h2>{q.q}</h2>
      <p>⏱ {timeLeft}s</p>

      {q.options.map((o) => (
        <button
          key={o}
          onClick={() => answer(o)}
          disabled={answered || timeLeft === 0}
          style={{ marginRight: 8 }}
        >
          {o}
        </button>
      ))}

      <hr />

      <h4>Players Online</h4>
      {onlinePlayers.map((p) => (
        <p key={p.id}>
          {displayName(p.id, playerId)} : {p.score}
        </p>
      ))}
    </div>
  );
}
