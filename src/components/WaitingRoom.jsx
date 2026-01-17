import { UserIcon, CrownIcon, PlayIcon, ExitIcon, CheckIcon } from "./icons";
import { useState } from "react";

export default function WaitingRoom({
  room,
  onlinePlayers,
  playerName,
  startGame,
  isGameMaster,
  leaveRoom,
}) {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col h-[90vh]">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-crimsondeep mb-2">
            {room.roomName}
          </h1>
          <p className="text-rosebold text-base">Ruang tunggu</p>
        </div>

        {/* Room Code */}
        <div className="bg-blushlight border-4 border-rosesoft rounded-2xl p-5 mb-6">
          <p className="text-sm text-rosebold font-medium mb-2">Kode Ruangan</p>
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-4xl font-black text-crimsondeep tracking-wider">
              {room.code}
            </p>
            <button
              onClick={copyRoomCode}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 flex items-center gap-2 ${
                copied
                  ? "bg-aquamist border-aquamist text-crimsondeep"
                  : "bg-white border-rosesoft text-rosebold hover:bg-rosesoft hover:text-white hover:border-rosesoft"
              }`}
            >
              <CheckIcon className="w-4 h-4" />
              {copied ? "Tersalin!" : "Salin"}
            </button>
          </div>
          <p className="text-sm text-rosebold">
            Bagikan kode ini ke teman-teman!
          </p>
        </div>

        {/* Players List */}
        <div className="flex-1 overflow-hidden flex flex-col mb-6">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="w-5 h-5 text-rosebold" />
            <h4 className="font-bold text-crimsondeep text-lg">
              Pemain Online ({onlinePlayers.length})
            </h4>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3">
            {onlinePlayers.map((p) => (
              <div
                key={p.id}
                className="bg-white border-2 border-rosesoft rounded-2xl p-4 flex items-center justify-between min-h-[60px]"
              >
                <span className="font-bold text-crimsondeep text-base">
                  {p.name}
                </span>
                <div className="flex gap-2 items-center h-[28px]">
                  {p.id === playerName && (
                    <span className="text-sm bg-aquamist text-crimsondeep px-3 py-1 rounded-full font-bold">
                      Kamu
                    </span>
                  )}
                  {p.isGameMaster && (
                    <span className="text-sm bg-rosesoft text-white px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <CrownIcon className="w-4 h-4" />
                      Host
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isGameMaster && (
            <button
              onClick={startGame}
              className="w-full bg-rosebold text-white py-4 rounded-2xl font-bold text-base hover:bg-rosesoft active:bg-crimsondeep transition-colors border-b-4 border-crimsondeep flex items-center justify-center gap-2"
            >
              <PlayIcon className="w-5 h-5" />
              Mulai Game
            </button>
          )}
          <button
            onClick={leaveRoom}
            className="w-full bg-white text-crimsondeep py-4 rounded-2xl font-bold text-base hover:bg-blushlight active:bg-rosesoft transition-colors border-2 border-rosesoft flex items-center justify-center gap-2"
          >
            <ExitIcon className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
