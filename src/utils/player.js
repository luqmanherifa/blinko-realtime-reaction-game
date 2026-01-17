export const getPlayerId = () => {
  const stored = localStorage.getItem("playerId");
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem("playerId", id);
  return id;
};

export const displayName = (id, playerId) =>
  id.slice(0, 5) + (id === playerId ? " (You)" : "");
