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

  return (
    <div style={{ padding: 24 }}>
      <h2>
        Question {room.currentQuestion + 1}/{QUESTIONS.length}
      </h2>
      <h3>{q.q}</h3>
      <p>⏱ {timeLeft}s</p>

      {q.options.map((o) => (
        <button
          key={o}
          onClick={() => answer(o)}
          disabled={answered || timeLeft === 0}
          style={{ marginRight: 8, padding: "10px 20px" }}
        >
          {o}
        </button>
      ))}

      <hr />

      <h4>Players</h4>
      {onlinePlayers
        .sort((a, b) => b.score - a.score)
        .map((p) => (
          <p key={p.id}>
            {p.name}: {p.score}
          </p>
        ))}
    </div>
  );
}
