export const getPlayerData = () => {
  const stored = localStorage.getItem("playerData");
  if (stored) return JSON.parse(stored);
  return null;
};

export const savePlayerData = (data) => {
  localStorage.setItem("playerData", JSON.stringify(data));
};

export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
