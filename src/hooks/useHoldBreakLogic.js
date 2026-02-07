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
        breakAt: null,
        declared: null,
        declaredAt: null,
        phaseScore: null,
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

    const checkEndPhase = async () => {
      const elapsed = Date.now() - room.phaseStartAt;
      const timeUp = elapsed >= room.phaseDuration;
      const bothBroke =
        onlinePlayers.length === 2 &&
        onlinePlayers.every((p) => p.breakAt !== null);

      if (timeUp || bothBroke) {
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
        const hasLoser = updatedPlayers.some((p) => p.totalScore <= -5);

        await updateDoc(doc(db, "rooms", roomCode), {
          status: hasWinner || hasLoser ? "finished" : "phaseResult",
        });
      }
    };

    const checkInterval = setInterval(checkEndPhase, 500);

    return () => clearInterval(checkInterval);
  }, [room, roomCode, onlinePlayers]);

  const startGame = async () => {
    const phaseDuration = 8000 + Math.random() * 7000;

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
        breakAt: null,
        declared: null,
        declaredAt: null,
        phaseScore: null,
        totalScore: 0,
      });
    });
  };

  const nextPhase = async () => {
    const phaseDuration = 8000 + Math.random() * 7000;

    players.forEach((p) => {
      updateDoc(doc(db, "rooms", roomCode, "players", p.id), {
        breakAt: null,
        declared: null,
        declaredAt: null,
        phaseScore: null,
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
    startGame,
    resetRoom,
    nextPhase,
  };
}

async function calculateHoldBreakResults(roomCode, players) {
  if (players.length !== 2) return;

  const [p1, p2] = players;

  const { winner, loser } = determineWinner(p1, p2);

  if (winner === null) {
    await updatePlayerScore(roomCode, p1.id, 0);
    await updatePlayerScore(roomCode, p2.id, 0);
    return;
  }

  const winnerScore = calculateScore(winner, true);
  const loserScore = calculateScore(loser, false);

  await updatePlayerScore(roomCode, winner.id, winnerScore);
  await updatePlayerScore(roomCode, loser.id, loserScore);
}

function determineWinner(p1, p2) {
  const p1Broke = p1.breakAt !== null;
  const p2Broke = p2.breakAt !== null;

  if (!p1Broke && !p2Broke) {
    return { winner: null, loser: null };
  }

  if (p1Broke && !p2Broke) {
    return { winner: p1, loser: p2 };
  }
  if (!p1Broke && p2Broke) {
    return { winner: p2, loser: p1 };
  }

  if (p1.breakAt > p2.breakAt) {
    return { winner: p1, loser: p2 };
  } else {
    return { winner: p2, loser: p1 };
  }
}

function calculateScore(player, isWinner) {
  const actualAction = player.breakAt ? "BREAK" : "HOLD";
  const isHonest = player.declared === actualAction;
  const isSilent = !player.declared;
  const isLiar = player.declared && !isHonest;

  if (isWinner) {
    if (isHonest) return 2;
    if (isSilent) return 1;
    if (isLiar) return 0;
  } else {
    if (isLiar) return -1;
    return 0;
  }

  return 0;
}

async function updatePlayerScore(roomCode, playerId, score) {
  const playerRef = doc(db, "rooms", roomCode, "players", playerId);
  const playerSnap = await getDoc(playerRef);
  const currentTotal = playerSnap.data()?.totalScore || 0;

  await updateDoc(playerRef, {
    phaseScore: score,
    totalScore: currentTotal + score,
  });
}
