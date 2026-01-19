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
      setErrorCreate("Nama ruangan tidak boleh kosong");
      return;
    }

    if (!createRoomCode.trim()) {
      setErrorCreate("Kode ruangan tidak boleh kosong");
      return;
    }

    if (createRoomCode.trim().length < 4) {
      setErrorCreate("Kode ruangan minimal 4 karakter");
      return;
    }

    onCreateRoom(roomName.trim(), createRoomCode.trim().toUpperCase());
  };

  const handleJoinRoom = () => {
    setErrorJoin("");

    if (!roomCode.trim()) {
      setErrorJoin("Kode ruangan tidak boleh kosong");
      return;
    }

    onJoinRoom(roomCode.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h2 className="text-2xl font-extrabold text-indigospark mb-2">
            Halo, {playerName}!
          </h2>
          <p className="text-indigoflow text-base">Pilih mode permainan</p>
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
              className={`flex-1 py-4 rounded-2xl font-bold text-base transition-colors ${
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
              className={`flex-1 py-4 rounded-2xl font-bold text-base transition-colors ${
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
                placeholder="Nama ruangan"
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  setErrorCreate("");
                }}
                className="w-full px-5 py-4 text-base border-2 border-indigospark/30 rounded-2xl focus:border-indigospark outline-none transition-colors"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Kode ruangan"
                  value={createRoomCode}
                  onChange={(e) => {
                    setCreateRoomCode(e.target.value);
                    setErrorCreate("");
                  }}
                  className="w-full px-5 py-4 text-base border-2 border-indigospark/30 rounded-2xl focus:border-indigospark outline-none transition-colors uppercase placeholder:normal-case"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-indigospark/50 pointer-events-none">
                  min. 4
                </span>
              </div>
              {errorCreate && (
                <p className="text-indigospark text-sm font-bold px-2">
                  {errorCreate}
                </p>
              )}
              <button
                onClick={handleCreateRoom}
                className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold text-base hover:bg-indigoflow active:bg-indigonight transition-colors border-2 border-indigospark"
              >
                Buat Ruangan
              </button>
            </div>
          )}

          {/* Join Room Form */}
          {activeTab === "join" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Masukkan kode ruangan"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value);
                  setErrorJoin("");
                }}
                className="w-full px-5 py-4 text-base border-2 border-indigospark/30 rounded-2xl focus:border-indigospark outline-none transition-colors uppercase placeholder:normal-case"
              />
              {errorJoin && (
                <p className="text-indigospark text-sm font-bold px-2">
                  {errorJoin}
                </p>
              )}
              <button
                onClick={handleJoinRoom}
                className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold text-base hover:bg-indigoflow active:bg-indigonight transition-colors"
              >
                Gabung Ruangan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
