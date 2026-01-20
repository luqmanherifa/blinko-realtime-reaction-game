import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedIcon from "./AnimatedIcon";
import { EditIcon } from "./icons";

export default function LoginForm({ onLogin, existingName }) {
  const [playerName, setPlayerName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [step, setStep] = useState(0);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (existingName) {
      setPlayerName(existingName);
    }
  }, [existingName]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 200),
      setTimeout(() => setStep(2), 600),
      setTimeout(() => setStep(3), 1000),
      setTimeout(() => setStep(4), 1400),
      setTimeout(() => setStep(5), 1800),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSubmit = () => {
    if (playerName.trim()) {
      onLogin(playerName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-indigospark rounded-3xl flex items-center justify-center">
              <AnimatedIcon />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-indigospark mb-2">
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: step >= 1 ? 1 : 0,
                  y: step >= 1 ? 0 : 20,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                BLIN
              </motion.span>

              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: step >= 1 ? 1 : 0,
                  y: step >= 1 ? 0 : 20,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                K
              </motion.span>

              {step >= 2 && step < 3 && (
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  K
                </motion.span>
              )}

              <motion.span
                className="inline-block"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: step >= 3 ? 1 : 0,
                  scale: step >= 3 ? 1 : 0.5,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                O
              </motion.span>

              <motion.span
                className="inline-block"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{
                  opacity: step >= 4 ? 1 : 0,
                  scale: step >= 4 ? 1 : 0,
                  rotate: step >= 4 ? 0 : -180,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                }}
              >
                !
              </motion.span>
            </h1>

            <motion.p
              className="text-indigoflow text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: step >= 5 ? 1 : 0,
                y: step >= 5 ? 0 : 10,
              }}
              transition={{ duration: 0.5 }}
            >
              Sekali berkedip, kalah.
            </motion.p>
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
                    ? "bg-white border-indigospark/30 text-indigonight"
                    : "bg-white border-indigospark/30 focus:border-indigospark"
                }`}
              />

              {existingName && !isRenaming && (
                <button
                  onClick={() => setIsRenaming(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-yellowpulse/20 rounded-xl transition-colors"
                >
                  <EditIcon className="w-5 h-5 text-yellowpulse" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {existingName && !isRenaming ? (
            <button
              onClick={handleSubmit}
              className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold text-base hover:bg-indigoflow active:bg-indigonight transition-colors border-2 border-indigospark"
            >
              Lanjut
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleSubmit}
                className="w-full bg-indigospark text-white py-4 rounded-2xl font-bold text-base hover:bg-indigoflow active:bg-indigonight transition-colors border-2 border-indigospark"
              >
                {existingName && isRenaming ? "Simpan" : "Mulai"}
              </button>

              {existingName && isRenaming && (
                <button
                  onClick={() => {
                    setPlayerName(existingName);
                    setIsRenaming(false);
                  }}
                  className="w-full bg-white text-indigospark py-4 rounded-2xl font-bold text-base hover:bg-yellowpulse/10 active:bg-yellowpulse/20 transition-colors border-2 border-indigospark/30"
                >
                  Batal
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="pb-6 text-center">
        <p className="text-xs text-slate-400 font-normal">
          © {currentYear}{" "}
          <a
            href="https://github.com/luqmanherifa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors"
          >
            Luqman Herifa
          </a>
        </p>
      </footer>
    </div>
  );
}
