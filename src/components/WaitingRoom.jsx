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
  const [showTooltip, setShowTooltip] = useState(false);
  const canStartGame = onlinePlayers.length >= 2;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col h-[90vh]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold font-heading text-indigospark mb-2">
            {room.roomName}
          </h1>
          <p className="text-indigoflow/50 text-base">Ruang tunggu</p>
        </div>

        {/* Room Code */}
        <div className="bg-yellowpulse/10 border-2 border-yellowpulse/30 rounded-2xl p-5 mb-6">
          <p className="text-sm text-indigoflow font-medium mb-2">Kode Arena</p>
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-2xl font-extrabold font-heading text-indigospark tracking-wider">
              {room.code}
            </p>
            <button
              onClick={copyRoomCode}
              className={`px-4 py-2 rounded-xl font-bold font-heading text-sm transition-all flex items-center gap-2 ${
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
            <h4 className="font-bold font-heading text-indigospark text-base">
              Sedang Bergabung ({onlinePlayers.length})
            </h4>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {onlinePlayers.map((p) => (
              <div
                key={p.id}
                className="bg-white border-2 border-slate-200 rounded-2xl px-5 py-3 flex items-center justify-between"
              >
                <span className="font-bold font-heading text-indigospark text-base">
                  {p.name}
                </span>
                <div className="flex gap-2 items-center">
                  {p.id === playerName && (
                    <span className="text-xs bg-yellowpulse/20 text-indigospark px-3 py-1 rounded-full font-bold font-heading">
                      Kamu
                    </span>
                  )}
                  {p.id === room.gameMaster && (
                    <span className="text-xs bg-indigospark text-white px-3 py-1 rounded-full font-bold font-heading flex items-center gap-1">
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
            <div className="relative">
              <button
                onClick={canStartGame ? startGame : undefined}
                disabled={!canStartGame}
                className={`w-full py-4 rounded-2xl font-bold font-heading text-base transition-colors flex items-center justify-center gap-2 border-2 ${
                  canStartGame
                    ? "bg-indigospark text-white hover:bg-indigoflow active:bg-indigonight border-indigospark cursor-pointer"
                    : "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed"
                }`}
              >
                <PlayIcon
                  className={`w-5 h-5 ${canStartGame ? "text-yellowpulse" : "text-slate-400"}`}
                />
                Mulai Game
                {!canStartGame && (
                  <div
                    className="relative inline-block"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      className="w-5 h-5 text-slate-500 ml-1"
                      fill="currentColor"
                    >
                      <path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z" />
                    </svg>
                    {showTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-indigonight text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-10">
                        Minimal 2 orang untuk mulai
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="border-4 border-transparent border-t-indigonight"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </button>
            </div>
          )}
          <button
            onClick={leaveRoom}
            className="w-full bg-white text-indigospark py-4 rounded-2xl font-bold font-heading text-base hover:bg-yellowpulse/10 active:bg-yellowpulse/20 transition-colors border-2 border-indigospark/30 flex items-center justify-center gap-2"
          >
            <ExitIcon className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
