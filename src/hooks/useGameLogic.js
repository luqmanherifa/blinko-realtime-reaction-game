import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  QUESTION_DURATION,
  ONLINE_THRESHOLD,
  HEARTBEAT_INTERVAL,
  QUESTIONS,
} from "../constants";

export function useGameLogic(roomCode, playerName) {
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!roomCode || !playerName) return;

    const playerRef = doc(db, "rooms", roomCode, "players", playerName);

    setDoc(
      playerRef,
      {
        id: playerName,
        name: playerName,
        score: 0,
        joinedAt: Date.now(),
        lastActiveAt: Date.now(),
      },
      { merge: true },
    );

    const heartbeat = setInterval(() => {
      updateDoc(playerRef, {
        lastActiveAt: Date.now(),
      });
      setNow(Date.now());
    }, HEARTBEAT_INTERVAL);

    return () => clearInterval(heartbeat);
  }, [roomCode, playerName]);

  useEffect(() => {
    if (!roomCode) return;

    return onSnapshot(doc(db, "rooms", roomCode), (snap) => {
      if (!snap.exists()) return;
      setRoom(snap.data());
      setAnswered(false);
    });
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode) return;

    return onSnapshot(collection(db, "rooms", roomCode, "players"), (snap) => {
      setPlayers(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      );
    });
  }, [roomCode]);

  const onlinePlayers = players.filter(
    (p) => now - p.lastActiveAt < ONLINE_THRESHOLD,
  );

  useEffect(() => {
    if (!room || room.status !== "playing") return;

    const interval = setInterval(() => {
      const diff = QUESTION_DURATION - (Date.now() - room.questionStartAt);
      setTimeLeft(Math.max(0, Math.ceil(diff / 1000)));
    }, 200);

    return () => clearInterval(interval);
  }, [room]);

  useEffect(() => {
    if (!room || room.status !== "playing") return;
    if (timeLeft !== 0 || room.advanceLock) return;

    const advanceTimer = setTimeout(() => {
      const next = room.currentQuestion + 1;

      if (next >= QUESTIONS.length) {
        updateGameStats(roomCode, onlinePlayers);

        updateDoc(doc(db, "rooms", roomCode), {
          status: "finished",
        });
        return;
      }

      updateDoc(doc(db, "rooms", roomCode), {
        currentQuestion: next,
        questionStartAt: Date.now(),
        advanceLock: true,
      });

      setTimeout(() => {
        updateDoc(doc(db, "rooms", roomCode), {
          advanceLock: false,
        });
      }, 500);
    }, 1000);

    return () => clearTimeout(advanceTimer);
  }, [timeLeft, room, roomCode, onlinePlayers]);

  const startGame = async () => {
    await updateDoc(doc(db, "rooms", roomCode), {
      status: "playing",
      currentQuestion: 0,
      questionStartAt: Date.now(),
      advanceLock: false,
    });
  };

  const resetRoom = async () => {
    await updateDoc(doc(db, "rooms", roomCode), {
      status: "waiting",
      currentQuestion: 0,
      questionStartAt: null,
    });

    players.forEach((p) => {
      updateDoc(doc(db, "rooms", roomCode, "players", p.id), { score: 0 });
    });
  };

  const answer = async (value) => {
    if (!room || answered || timeLeft === 0) return;

    setAnswered(true);

    const current = QUESTIONS[room.currentQuestion];
    if (value === current.correct) {
      await updateDoc(doc(db, "rooms", roomCode, "players", playerName), {
        score: increment(1),
      });
    }
  };

  return {
    room,
    players,
    onlinePlayers,
    timeLeft,
    answered,
    startGame,
    resetRoom,
    answer,
  };
}

async function updateGameStats(roomCode, onlinePlayers) {
  const maxScore = Math.max(...onlinePlayers.map((p) => p.score));
  const winners = onlinePlayers.filter((p) => p.score === maxScore);

  for (const player of onlinePlayers) {
    const isWinner = winners.some((w) => w.id === player.id);
    const playerStatsRef = doc(db, "playerStats", player.id);

    const playerStatsSnap = await getDoc(playerStatsRef);

    if (playerStatsSnap.exists()) {
      await updateDoc(playerStatsRef, {
        totalWins: increment(isWinner ? 1 : 0),
        gamesPlayed: increment(1),
        lastPlayed: Date.now(),
      });
    } else {
      await setDoc(playerStatsRef, {
        id: player.id,
        name: player.name,
        totalWins: isWinner ? 1 : 0,
        gamesPlayed: 1,
        lastPlayed: Date.now(),
      });
    }

    const historyRef = doc(collection(db, "gameHistory"));
    await setDoc(historyRef, {
      playerId: player.id,
      playerName: player.name,
      roomCode: roomCode,
      score: player.score,
      isWinner: isWinner,
      playedAt: Date.now(),
    });
  }
}
