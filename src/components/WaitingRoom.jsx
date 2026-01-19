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
        <div className="text-center mb-10">
          <h1 className="text-2xl font-extrabold text-indigospark mb-2">
            {room.roomName}
          </h1>
          <p className="text-indigoflow text-base">Ruang tunggu</p>
        </div>

        {/* Room Code */}
        <div className="bg-yellowpulse/10 border-2 border-yellowpulse/30 rounded-2xl p-5 mb-6">
          <p className="text-sm text-indigoflow font-medium mb-2">
            Kode Ruangan
          </p>
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-2xl font-extrabold text-indigospark tracking-wider">
              {room.code}
            </p>
            <button
              onClick={copyRoomCode}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                copied
                  ? "bg-yellowpulse text-indigospark"
                  : "bg-white border-2 border-indigospark/30 text-indigospark hover:bg-indigospark/5"
              }`}
            >
              <CheckIcon className="w-4 h-4" />
              {copied ? "Tersalin!" : "Salin"}
            </button>
          </div>
          <p className="text-sm text-indigoflow">
            Bagikan kode ini ke teman-teman!
          </p>
        </div>

        {/* Players List */}
        <div className="flex-1 overflow-hidden flex flex-col mb-6">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="w-5 h-5 text-indigospark" />
            <h4 className="font-bold text-indigospark text-base">
              Pemain Online ({onlinePlayers.length})
            </h4>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {onlinePlayers.map((p) => (
              <div
                key={p.id}
                className="bg-white border-2 border-slate-200 rounded-2xl p-3.5 flex items-center justify-between"
              >
                <span className="font-bold text-indigospark text-base">
                  {p.name}
                </span>
                <div className="flex gap-2 items-center">
                  {p.id === playerName && (
                    <span className="text-xs bg-yellowpulse/20 text-indigospark px-3 py-1 rounded-full font-bold">
                      Kamu
                    </span>
                  )}
                  {p.isGameMaster && (
                    <span className="text-xs bg-indigospark text-white px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <CrownIcon className="w-3.5 h-3.5 text-yellowpulse" />
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
              className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold text-base hover:bg-indigoflow active:bg-indigonight transition-colors flex items-center justify-center gap-2 border-2 border-indigospark"
            >
              <PlayIcon className="w-5 h-5 text-yellowpulse" />
              Mulai Game
            </button>
          )}
          <button
            onClick={leaveRoom}
            className="w-full bg-white text-indigospark py-4 rounded-2xl font-bold text-base hover:bg-yellowpulse/10 active:bg-yellowpulse/20 transition-colors border-2 border-indigospark/30 flex items-center justify-center gap-2"
          >
            <ExitIcon className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
