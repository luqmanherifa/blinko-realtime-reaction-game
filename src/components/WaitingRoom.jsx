import { displayName } from "../utils/player";

export default function WaitingRoom({ onlinePlayers, playerId, startGame }) {
  return (
    <div style={{ padding: 24 }}>
      <h3>Waiting Room</h3>
      <button onClick={startGame}>Start Game</button>

      <h4>Players Online</h4>
      {onlinePlayers.map((p) => (
        <p key={p.id}>{displayName(p.id, playerId)}</p>
      ))}
    </div>
  );
}
