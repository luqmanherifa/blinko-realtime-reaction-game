import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { ONLINE_THRESHOLD, HEARTBEAT_INTERVAL } from "../constants";

export function useHoldBreakLogic(roomCode, playerName) {
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!roomCode || !playerName) return;

    const playerRef = doc(db, "rooms", roomCode, "players", playerName);

    setDoc(
      playerRef,
      {
        id: playerName,
        name: playerName,
        joinedAt: Date.now(),
        lastActiveAt: Date.now(),
        choice: null,
        choiceAt: null,
        declared: false,
        declaredChoice: null,
        declaredAt: null,
        finalScore: null,
        totalScore: 0,
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
      const elapsed = Date.now() - room.phaseStartAt;
      const remaining = room.phaseDuration - elapsed;
      setTimeLeft(Math.max(0, Math.ceil(remaining / 1000)));
    }, 100);

    return () => clearInterval(interval);
  }, [room]);

  useEffect(() => {
    if (!room || room.status !== "playing") return;

    const checkEndPhase = async () => {
      const elapsed = Date.now() - room.phaseStartAt;
      const timeUp = elapsed >= room.phaseDuration;
      const bothChosen =
        onlinePlayers.length === 2 &&
        onlinePlayers.every((p) => p.choice !== null && p.choice !== undefined);

      if (timeUp || bothChosen) {
        await calculateHoldBreakResults(roomCode, onlinePlayers);

        const updatedPlayers = await Promise.all(
          onlinePlayers.map(async (p) => {
            const playerSnap = await getDoc(
              doc(db, "rooms", roomCode, "players", p.id),
            );
            return playerSnap.data();
          }),
        );

        const hasWinner = updatedPlayers.some((p) => p.totalScore >= 5);

        await updateDoc(doc(db, "rooms", roomCode), {
          status: hasWinner ? "finished" : "phaseResult",
        });
      }
    };

    const checkInterval = setInterval(checkEndPhase, 500);

    return () => clearInterval(checkInterval);
  }, [room, roomCode, onlinePlayers]);

  const startGame = async () => {
    const phaseDuration = 60000 + Math.random() * 30000;

    await updateDoc(doc(db, "rooms", roomCode), {
      status: "playing",
      phaseStartAt: Date.now(),
      phaseDuration: phaseDuration,
    });
  };

  const resetRoom = async () => {
    await updateDoc(doc(db, "rooms", roomCode), {
      status: "waiting",
      phaseStartAt: null,
      phaseDuration: null,
    });

    players.forEach((p) => {
      updateDoc(doc(db, "rooms", roomCode, "players", p.id), {
        choice: null,
        choiceAt: null,
        declared: false,
        declaredChoice: null,
        declaredAt: null,
        finalScore: null,
        totalScore: 0,
      });
    });
  };

  const nextPhase = async () => {
    const phaseDuration = 60000 + Math.random() * 30000;

    players.forEach((p) => {
      updateDoc(doc(db, "rooms", roomCode, "players", p.id), {
        choice: null,
        choiceAt: null,
        declared: false,
        declaredChoice: null,
        declaredAt: null,
        finalScore: null,
      });
    });

    await updateDoc(doc(db, "rooms", roomCode), {
      status: "playing",
      phaseStartAt: Date.now(),
      phaseDuration: phaseDuration,
    });
  };

  return {
    room,
    players,
    onlinePlayers,
    timeLeft,
    startGame,
    resetRoom,
    nextPhase,
  };
}

async function calculateHoldBreakResults(roomCode, players) {
  if (players.length !== 2) return;

  const [p1, p2] = players;

  if (!p1.choice) {
    await updatePlayerScore(roomCode, p1.id, -1);
    await updatePlayerScore(roomCode, p2.id, p2.choice ? 2 : -1);
    return;
  }

  if (!p2.choice) {
    await updatePlayerScore(roomCode, p1.id, 2);
    await updatePlayerScore(roomCode, p2.id, -1);
    return;
  }

  let winner = null;
  let loser = null;

  if (p1.choice === "BREAK" && p2.choice === "HOLD") {
    winner = p1;
    loser = p2;
  } else if (p1.choice === "HOLD" && p2.choice === "BREAK") {
    winner = p2;
    loser = p1;
  } else if (p1.choice === p2.choice) {
    if (p1.choiceAt > p2.choiceAt) {
      winner = p1;
      loser = p2;
    } else {
      winner = p2;
      loser = p1;
    }
  }

  const winnerScore = calculateScore(winner, true);
  const loserScore = calculateScore(loser, false);

  await updatePlayerScore(roomCode, winner.id, winnerScore);
  await updatePlayerScore(roomCode, loser.id, loserScore);
}

function calculateScore(player, isWinner) {
  if (!player.choice) return -1;

  if (!isWinner) {
    if (player.declared && player.declaredChoice !== player.choice) {
      return -1;
    }
    return 0;
  }

  if (player.declared && player.declaredChoice === player.choice) {
    return 2;
  }

  if (!player.declared) {
    return 1;
  }

  return 0;
}

async function updatePlayerScore(roomCode, playerId, score) {
  const playerRef = doc(db, "rooms", roomCode, "players", playerId);
  const playerSnap = await getDoc(playerRef);
  const currentTotal = playerSnap.data()?.totalScore || 0;

  await updateDoc(playerRef, {
    finalScore: score,
    totalScore: currentTotal + score,
  });
}
