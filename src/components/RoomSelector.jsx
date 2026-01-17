import { useState } from "react";

export default function RoomSelector({ playerName, onCreateRoom, onJoinRoom }) {
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      onCreateRoom(roomName.trim());
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      onJoinRoom(roomCode.trim().toUpperCase());
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Hello, {playerName}!</h2>

      <div style={{ marginBottom: 40 }}>
        <h3>Create New Room</h3>
        <form onSubmit={handleCreateRoom}>
          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={{ padding: 8, marginRight: 8 }}
          />
          <button type="submit">Create Room</button>
        </form>
      </div>

      <div>
        <h3>Join Existing Room</h3>
        <form onSubmit={handleJoinRoom}>
          <input
            type="text"
            placeholder="Room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            style={{ padding: 8, marginRight: 8, textTransform: "uppercase" }}
          />
          <button type="submit">Join Room</button>
        </form>
      </div>
    </div>
  );
}
