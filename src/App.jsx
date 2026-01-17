import { getPlayerId } from "./utils/player";
import { useGameLogic } from "./hooks/useGameLogic";
import WaitingRoom from "./components/WaitingRoom";
import GameFinished from "./components/GameFinished";
import PlayingGame from "./components/PlayingGame";

export default function App() {
  const playerId = getPlayerId();
  const {
    room,
    onlinePlayers,
    timeLeft,
    answered,
    startGame,
    resetRoom,
    answer,
  } = useGameLogic(playerId);

  if (!room) {
    return (
      <div style={{ padding: 24 }}>
        <button onClick={startGame}>Create Room</button>
      </div>
    );
  }

  if (room.status === "waiting") {
    return (
      <WaitingRoom
        onlinePlayers={onlinePlayers}
        playerId={playerId}
        startGame={startGame}
      />
    );
  }

  if (room.status === "finished") {
    return (
      <GameFinished
        onlinePlayers={onlinePlayers}
        playerId={playerId}
        resetRoom={resetRoom}
      />
    );
  }

  return (
    <PlayingGame
      room={room}
      onlinePlayers={onlinePlayers}
      playerId={playerId}
      timeLeft={timeLeft}
      answered={answered}
      answer={answer}
    />
  );
}
