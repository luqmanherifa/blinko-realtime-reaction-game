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
import { useDontBlinkLogic } from "./hooks/useDontBlinkLogic";
import { useHoldBreakLogic } from "./hooks/useHoldBreakLogic";
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
  const [gameMode, setGameMode] = useState(null);
  const [isGameMaster, setIsGameMaster] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!roomCode) {
      setGameMode(null);
      return;
    }

    return onSnapshot(doc(db, "rooms", roomCode), (snap) => {
      if (snap.exists()) {
        setGameMode(snap.data().gameMode);
      }
    });
  }, [roomCode]);

  const dontBlinkLogic = useDontBlinkLogic(
    gameMode === "dontblink" ? roomCode : null,
    playerName,
  );

  const holdBreakLogic = useHoldBreakLogic(
    gameMode === "holdbreak" ? roomCode : null,
    playerName,
  );

  const gameLogic = gameMode === "dontblink" ? dontBlinkLogic : holdBreakLogic;

  const { room, onlinePlayers, timeLeft, startGame, resetRoom, nextPhase } =
    gameLogic;

  const { answered, shuffledQuestions, answer } =
    gameMode === "dontblink" ? dontBlinkLogic : {};

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

  useEffect(() => {
    if (!room || !roomCode) return;

    if (
      room.status === "finished" &&
      onlinePlayers.length === 1 &&
      !isGameMaster
    ) {
      const timer = setTimeout(() => {
        leaveRoom();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [room, roomCode, onlinePlayers.length, isGameMaster]);

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

  const handleCreateRoom = async (roomName, code, selectedGameMode) => {
    try {
      const roomRef = doc(db, "rooms", code);
      const roomSnap = await getDoc(roomRef);

      if (roomSnap.exists()) {
        alert("Kode arena sudah digunakan! Gunakan kode lain.");
        return;
      }

      const baseRoomData = {
        code: code,
        roomName: roomName,
        gameMaster: playerName,
        gameMode: selectedGameMode,
        status: "waiting",
        createdAt: Date.now(),
      };

      if (selectedGameMode === "dontblink") {
        await setDoc(roomRef, {
          ...baseRoomData,
          currentQuestion: 0,
          questionStartAt: null,
          shuffledQuestionIndexes: null,
        });
      } else if (selectedGameMode === "holdbreak") {
        await setDoc(roomRef, {
          ...baseRoomData,
          phaseStartAt: null,
          phaseDuration: null,
        });
      }

      setRoomCode(code);
      setIsGameMaster(true);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Gagal membuat arena. Coba lagi.");
    }
  };

  const handleJoinRoom = async (code) => {
    try {
      const roomRef = doc(db, "rooms", code);
      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        alert("Arena tidak ditemukan!");
        return;
      }

      const roomData = roomSnap.data();

      if (roomData.status === "playing") {
        alert("Permainan sudah dimulai!");
        return;
      }

      setRoomCode(code);
      setIsGameMaster(roomData.gameMaster === playerName);
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Gagal gabung arena. Cek kode dan coba lagi.");
    }
  };

  const leaveRoom = () => {
    setRoomCode(null);
    setGameMode(null);
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
        <p className="text-slate-600 text-base">Memuat arena...</p>
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
        room={room}
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
      shuffledQuestions={shuffledQuestions}
      answer={answer}
      nextPhase={nextPhase}
    />
  );
}
