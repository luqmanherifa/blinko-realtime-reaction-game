import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  ROOM_ID,
  QUESTION_DURATION,
  ONLINE_THRESHOLD,
  HEARTBEAT_INTERVAL,
  QUESTIONS,
} from "../constants";

export function useGameLogic(playerId) {
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const playerRef = doc(db, "rooms", ROOM_ID, "players", playerId);

    setDoc(
      playerRef,
      {
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
  }, [playerId]);

  useEffect(() => {
    return onSnapshot(doc(db, "rooms", ROOM_ID), (snap) => {
      if (!snap.exists()) return;
      setRoom(snap.data());
      setAnswered(false);
    });
  }, []);

  useEffect(() => {
    return onSnapshot(collection(db, "rooms", ROOM_ID, "players"), (snap) => {
      setPlayers(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      );
    });
  }, []);

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
        updateDoc(doc(db, "rooms", ROOM_ID), {
          status: "finished",
        });
        return;
      }

      updateDoc(doc(db, "rooms", ROOM_ID), {
        currentQuestion: next,
        questionStartAt: Date.now(),
        advanceLock: true,
      });

      setTimeout(() => {
        updateDoc(doc(db, "rooms", ROOM_ID), {
          advanceLock: false,
        });
      }, 500);
    }, 1000);

    return () => clearTimeout(advanceTimer);
  }, [timeLeft, room]);

  const startGame = async () => {
    await setDoc(doc(db, "rooms", ROOM_ID), {
      status: "playing",
      currentQuestion: 0,
      questionStartAt: Date.now(),
      advanceLock: false,
    });
  };

  const resetRoom = async () => {
    await setDoc(doc(db, "rooms", ROOM_ID), {
      status: "waiting",
      currentQuestion: 0,
      questionStartAt: null,
    });

    players.forEach((p) => {
      updateDoc(doc(db, "rooms", ROOM_ID, "players", p.id), { score: 0 });
    });
  };

  const answer = async (value) => {
    if (!room || answered || timeLeft === 0) return;

    setAnswered(true);

    const current = QUESTIONS[room.currentQuestion];
    if (value === current.correct) {
      await updateDoc(doc(db, "rooms", ROOM_ID, "players", playerId), {
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
