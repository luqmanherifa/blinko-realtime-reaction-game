export default function WaitingRoom({
  room,
  onlinePlayers,
  playerName,
  startGame,
  isGameMaster,
  leaveRoom,
}) {
  return (
    <div style={{ padding: 24 }}>
      <h2>{room.roomName}</h2>
      <h3>Room Code: {room.code}</h3>
      <p>Share this code with your friends!</p>

      {isGameMaster && <button onClick={startGame}>Start Game</button>}
      <button onClick={leaveRoom} style={{ marginLeft: 8 }}>
        Leave Room
      </button>

      <h4>Players Online ({onlinePlayers.length})</h4>
      {onlinePlayers.map((p) => (
        <p key={p.id}>
          {p.name} {p.id === playerName && "(You)"} {p.isGameMaster && "(Host)"}
        </p>
      ))}
    </div>
  );
}
