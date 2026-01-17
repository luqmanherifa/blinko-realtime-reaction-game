import { useState, useEffect } from "react";
import { SmileIcon, EditIcon } from "./icons";

export default function LoginForm({ onLogin, existingName }) {
  const [playerName, setPlayerName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    if (existingName) {
      setPlayerName(existingName);
    }
  }, [existingName]);

  const handleSubmit = () => {
    if (playerName.trim()) {
      onLogin(playerName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-rosebold rounded-3xl flex items-center justify-center border-b-4 border-crimsondeep">
            <SmileIcon className="w-11 h-11 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-crimsondeep mb-2">
            Trivia Game
          </h1>
          <p className="text-rosebold text-base">
            Main kuis bareng teman-teman
          </p>
        </div>

        {/* Input Field */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Nama kamu"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              disabled={existingName && !isRenaming}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              className={`w-full px-5 py-4 text-base border-2 rounded-2xl outline-none transition-colors ${
                existingName && !isRenaming
                  ? "bg-white border-rosesoft text-crimsondeep"
                  : "bg-white border-rosesoft focus:border-rosebold"
              }`}
            />
            {existingName && !isRenaming && (
              <button
                onClick={() => setIsRenaming(true)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-aquamist rounded-xl transition-colors"
              >
                <EditIcon className="w-5 h-5 text-rosesoft" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {existingName && !isRenaming ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-rosebold text-white py-4 rounded-2xl font-bold text-base hover:bg-rosesoft active:bg-crimsondeep transition-colors border-b-4 border-crimsondeep"
          >
            Lanjut
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              className="w-full bg-rosebold text-white py-4 rounded-2xl font-bold text-base hover:bg-rosesoft active:bg-crimsondeep transition-colors border-b-4 border-crimsondeep"
            >
              {existingName && isRenaming ? "Simpan" : "Mulai"}
            </button>
            {existingName && isRenaming && (
              <button
                onClick={() => {
                  setPlayerName(existingName);
                  setIsRenaming(false);
                }}
                className="w-full bg-white text-rosebold py-4 rounded-2xl font-bold text-base hover:bg-aquamist active:bg-blushlight transition-colors border-2 border-rosesoft"
              >
                Batal
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
