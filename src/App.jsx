import { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { getPlayerData, savePlayerData } from "./utils/player";
import { useGameLogic } from "./hooks/useGameLogic";
import LoginForm from "./components/LoginForm";
import RoomSelector from "./components/RoomSelector";
import WaitingRoom from "./components/WaitingRoom";
import GameFinished from "./components/GameFinished";
import PlayingGame from "./components/PlayingGame";
import Leaderboard from "./components/Leaderboard";

export default function App() {
  const [playerName, setPlayerName] = useState(null);
  const [originalName, setOriginalName] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [isGameMaster, setIsGameMaster] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    room,
    onlinePlayers,
    timeLeft,
    answered,
    startGame,
    resetRoom,
    answer,
  } = useGameLogic(roomCode, playerName);

  useEffect(() => {
    const data = getPlayerData();
    if (data) {
      setPlayerName(data.name);
      setOriginalName(data.name);
    }
  }, []);

  useEffect(() => {
    return onSnapshot(collection(db, "playerStats"), (snap) => {
      setLeaderboardData(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      );
    });
  }, []);

  const handleLogin = async (name) => {
    if (originalName && originalName !== name) {
      await renamePlayer(originalName, name);
    }

    setPlayerName(name);
    setOriginalName(name);
    savePlayerData({ name });
    setIsLoggedIn(true);
  };

  const renamePlayer = async (oldName, newName) => {
    try {
      const oldStatsRef = doc(db, "playerStats", oldName);
      const oldStatsSnap = await getDoc(oldStatsRef);

      if (oldStatsSnap.exists()) {
        const statsData = oldStatsSnap.data();

        await setDoc(doc(db, "playerStats", newName), {
          ...statsData,
          id: newName,
          name: newName,
        });

        await deleteDoc(oldStatsRef);
      }

      const historyQuery = query(
        collection(db, "gameHistory"),
        where("playerId", "==", oldName),
      );
      const historySnap = await getDocs(historyQuery);

      const updatePromises = historySnap.docs.map((historyDoc) =>
        updateDoc(historyDoc.ref, {
          playerId: newName,
          playerName: newName,
        }),
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error renaming player:", error);
    }
  };

  const handleCreateRoom = async (roomName, code) => {
    try {
      const roomRef = doc(db, "rooms", code);
      const roomSnap = await getDoc(roomRef);

      if (roomSnap.exists()) {
        alert("Kode ruangan sudah digunakan! Gunakan kode lain.");
        return;
      }

      await setDoc(roomRef, {
        code: code,
        roomName: roomName,
        gameMaster: playerName,
        status: "waiting",
        currentQuestion: 0,
        questionStartAt: null,
        createdAt: Date.now(),
      });

      setRoomCode(code);
      setIsGameMaster(true);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Gagal membuat ruangan. Coba lagi.");
    }
  };

  const handleJoinRoom = async (code) => {
    try {
      const roomRef = doc(db, "rooms", code);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        alert("Ruangan tidak ditemukan!");
        return;
      }

      setRoomCode(code);
      setIsGameMaster(false);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Gagal gabung ruangan. Cek kode dan coba lagi.");
    }
  };

  const leaveRoom = () => {
    setRoomCode(null);
    setIsGameMaster(false);
  };

  if (showLeaderboard) {
    return (
      <Leaderboard
        players={leaderboardData}
        onBack={() => setShowLeaderboard(false)}
      />
    );
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} existingName={originalName} />;
  }

  if (!roomCode) {
    return (
      <RoomSelector
        playerName={playerName}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-600 text-base">Memuat ruangan...</p>
      </div>
    );
  }

  if (room.status === "waiting") {
    return (
      <WaitingRoom
        room={room}
        onlinePlayers={onlinePlayers}
        playerName={playerName}
        startGame={startGame}
        isGameMaster={isGameMaster}
        leaveRoom={leaveRoom}
      />
    );
  }

  if (room.status === "finished") {
    return (
      <GameFinished
        onlinePlayers={onlinePlayers}
        playerName={playerName}
        resetRoom={resetRoom}
        isGameMaster={isGameMaster}
        leaveRoom={leaveRoom}
      />
    );
  }

  return (
    <PlayingGame
      room={room}
      onlinePlayers={onlinePlayers}
      playerName={playerName}
      timeLeft={timeLeft}
      answered={answered}
      answer={answer}
    />
  );
}
