import { useState } from "react";
import { PlusIcon, JoinIcon, TrophyIcon } from "./icons";

export default function RoomSelector({
  playerName,
  onCreateRoom,
  onJoinRoom,
  onShowLeaderboard,
}) {
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [createRoomCode, setCreateRoomCode] = useState("");
  const [errorCreate, setErrorCreate] = useState("");
  const [errorJoin, setErrorJoin] = useState("");
  const [activeTab, setActiveTab] = useState("create");

  const handleCreateRoom = () => {
    setErrorCreate("");

    if (!roomName.trim()) {
      setErrorCreate("Nama arena tidak boleh kosong");
      return;
    }

    if (!createRoomCode.trim()) {
      setErrorCreate("Kode arena tidak boleh kosong");
      return;
    }

    if (createRoomCode.trim().length < 4) {
      setErrorCreate("Kode arena minimal 4 karakter");
      return;
    }

    onCreateRoom(roomName.trim(), createRoomCode.trim().toUpperCase());
  };

  const handleJoinRoom = () => {
    setErrorJoin("");

    if (!roomCode.trim()) {
      setErrorJoin("Kode arena tidak boleh kosong");
      return;
    }

    onJoinRoom(roomCode.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-indigospark mb-2">
            Halo, {playerName}!
          </h2>
          <p className="text-indigoflow/50 text-base">Pilih mode permainan</p>
        </div>
        <button
          onClick={onShowLeaderboard}
          className="w-12 h-12 bg-indigospark rounded-2xl flex items-center justify-center hover:bg-indigoflow active:bg-indigonight transition-colors"
        >
          <TrophyIcon className="w-6 h-6 text-yellowpulse" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setActiveTab("create");
                setErrorCreate("");
                setErrorJoin("");
              }}
              className={`flex-1 py-4 rounded-2xl font-bold font-heading text-base transition-colors ${
                activeTab === "create"
                  ? "bg-indigospark text-white"
                  : "bg-white text-indigospark border-2 border-indigospark/30 hover:bg-yellowpulse/10 active:bg-yellowpulse/20"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <PlusIcon
                  className={`w-5 h-5 ${activeTab === "create" ? "text-yellowpulse" : ""}`}
                />
                <span>Buat</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("join");
                setErrorCreate("");
                setErrorJoin("");
              }}
              className={`flex-1 py-4 rounded-2xl font-bold font-heading text-base transition-colors ${
                activeTab === "join"
                  ? "bg-indigospark text-white"
                  : "bg-white text-indigospark border-2 border-indigospark/30 hover:bg-yellowpulse/10 active:bg-yellowpulse/20"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <JoinIcon
                  className={`w-5 h-5 ${activeTab === "join" ? "text-yellowpulse" : ""}`}
                />
                <span>Gabung</span>
              </div>
            </button>
          </div>

          {/* Create Room Form */}
          {activeTab === "create" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama arena"
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  setErrorCreate("");
                }}
                className="w-full px-5 py-4 text-base text-indigonight placeholder:text-base placeholder:text-indigonight/50 border-2 border-indigospark/30 rounded-2xl focus:border-indigospark outline-none transition-colors"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Kode arena"
                  value={createRoomCode}
                  onChange={(e) => {
                    setCreateRoomCode(e.target.value);
                    setErrorCreate("");
                  }}
                  className="w-full px-5 py-4 text-base text-indigonight placeholder:text-base placeholder:text-indigonight/50 border-2 border-indigospark/30 rounded-2xl focus:border-indigospark outline-none transition-colors uppercase placeholder:normal-case pr-20"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 text-[10px] font-semibold rounded-full bg-indigospark/10 text-indigospark pointer-events-none">
                  min. 4
                </span>
              </div>
              {errorCreate && (
                <p className="text-indigospark text-sm font-bold font-heading px-2">
                  {errorCreate}
                </p>
              )}
              <button
                onClick={handleCreateRoom}
                className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold font-heading text-base hover:bg-indigoflow active:bg-indigonight transition-colors border-2 border-indigospark"
              >
                Buat Arena
              </button>
            </div>
          )}

          {/* Join Room Form */}
          {activeTab === "join" && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Kode arena teman"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value);
                    setErrorJoin("");
                  }}
                  className="w-full px-5 py-4 text-base text-indigonight placeholder:text-base placeholder:text-indigonight/50 border-2 border-indigospark/30 rounded-2xl focus:border-indigospark outline-none transition-colors uppercase placeholder:normal-case pr-20"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 text-[10px] font-semibold rounded-full bg-indigospark/10 text-indigospark pointer-events-none">
                  min. 4
                </span>
              </div>

              {errorJoin && (
                <p className="text-indigospark text-sm font-bold font-heading px-2">
                  {errorJoin}
                </p>
              )}

              <button
                onClick={handleJoinRoom}
                className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold font-heading text-base hover:bg-indigoflow active:bg-indigonight transition-colors"
              >
                Gabung Arena
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
