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
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-crimsondeep">
            Halo, {playerName}!
          </h2>
          <p className="text-rosebold text-sm">Pilih mode permainan</p>
        </div>
        <button
          onClick={onShowLeaderboard}
          className="w-12 h-12 bg-rosesoft rounded-2xl flex items-center justify-center border-b-4 border-rosebold hover:bg-blushlight active:bg-rosebold transition-colors"
        >
          <TrophyIcon className="w-6 h-6 text-white" />
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
              className={`flex-1 py-3 rounded-2xl font-bold text-base transition-colors border-b-4 ${
                activeTab === "create"
                  ? "bg-rosebold text-white border-crimsondeep"
                  : "bg-blushlight text-rosebold border-rosesoft"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <PlusIcon className="w-5 h-5" />
                <span>Buat</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("join");
                setErrorCreate("");
                setErrorJoin("");
              }}
              className={`flex-1 py-3 rounded-2xl font-bold text-base transition-colors border-b-4 ${
                activeTab === "join"
                  ? "bg-rosebold text-white border-crimsondeep"
                  : "bg-blushlight text-rosebold border-rosesoft"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <JoinIcon className="w-5 h-5" />
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
                className="w-full px-5 py-4 text-base border-2 border-rosesoft rounded-2xl focus:border-rosebold outline-none transition-colors"
              />
              <input
                type="text"
                placeholder="Kode ruangan (min. 4 karakter)"
                value={createRoomCode}
                onChange={(e) => {
                  setCreateRoomCode(e.target.value);
                  setErrorCreate("");
                }}
                className="w-full px-5 py-4 text-base border-2 border-rosesoft rounded-2xl focus:border-rosebold outline-none transition-colors uppercase placeholder:normal-case"
              />
              {errorCreate && (
                <p className="text-crimsondeep text-sm font-bold px-2">
                  {errorCreate}
                </p>
              )}
              <button
                onClick={handleCreateRoom}
                className="w-full bg-rosebold text-white py-4 rounded-2xl font-bold text-base hover:bg-rosesoft active:bg-crimsondeep transition-colors border-b-4 border-crimsondeep"
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
                className="w-full px-5 py-4 text-base border-2 border-rosesoft rounded-2xl focus:border-rosebold outline-none transition-colors uppercase placeholder:normal-case"
              />
              {errorJoin && (
                <p className="text-crimsondeep text-sm font-bold px-2">
                  {errorJoin}
                </p>
              )}
              <button
                onClick={handleJoinRoom}
                className="w-full bg-rosebold text-white py-4 rounded-2xl font-bold text-base hover:bg-rosesoft active:bg-crimsondeep transition-colors border-b-4 border-crimsondeep"
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
