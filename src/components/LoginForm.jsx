import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onLogin(playerName.trim());
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Welcome to Trivia Game</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{ padding: 8, marginRight: 8 }}
          />
          <button type="submit">Continue</button>
        </div>
      </form>
    </div>
  );
}
