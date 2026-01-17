import { displayName } from "../utils/player";

export default function GameFinished({ onlinePlayers, playerId, resetRoom }) {
  const maxScore = Math.max(...onlinePlayers.map((p) => p.score));
  const winners = onlinePlayers.filter((p) => p.score === maxScore);

  return (
    <div style={{ padding: 24 }}>
      <h2>Game Finished</h2>

      {winners.length === 1 ? (
        <h3>Winner: {displayName(winners[0].id, playerId)}</h3>
      ) : (
        <>
          <h3>Draw!</h3>
          <ul>
            {winners.map((w) => (
              <li key={w.id}>{displayName(w.id, playerId)}</li>
            ))}
          </ul>
        </>
      )}

      <h4>Final Score (Online Players)</h4>
      {onlinePlayers.map((p) => (
        <p key={p.id}>
          {displayName(p.id, playerId)} : {p.score}
        </p>
      ))}

      <button onClick={resetRoom}>Rematch</button>
    </div>
  );
}
