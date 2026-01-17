export default function GameFinished({
  onlinePlayers,
  playerName,
  resetRoom,
  isGameMaster,
  leaveRoom,
}) {
  const maxScore = Math.max(...onlinePlayers.map((p) => p.score));
  const winners = onlinePlayers.filter((p) => p.score === maxScore);

  return (
    <div style={{ padding: 24 }}>
      <h2>Game Finished</h2>

      {winners.length === 1 ? (
        <h3>Winner: {winners[0].name}</h3>
      ) : (
        <>
          <h3>Draw!</h3>
          <ul>
            {winners.map((w) => (
              <li key={w.id}>{w.name}</li>
            ))}
          </ul>
        </>
      )}

      <h4>Final Score</h4>
      {onlinePlayers
        .sort((a, b) => b.score - a.score)
        .map((p) => (
          <p key={p.id}>
            {p.name}: {p.score}
          </p>
        ))}

      {isGameMaster && <button onClick={resetRoom}>Rematch</button>}
      <button onClick={leaveRoom} style={{ marginLeft: 8 }}>
        Leave Room
      </button>
    </div>
  );
}
