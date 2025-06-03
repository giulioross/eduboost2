import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getRecentSessions, saveFocusSession } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiPause, FiRefreshCw, FiClock, FiZap, FiCoffee } from "react-icons/fi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTimer } from "./TimerContext";

// Define the FocusSession type if not imported from elsewhere
type FocusSession = {
  id: number;
  duration: number;
  status: "WORK" | "BREAK";
  startTime: string;
  endTime: string;
  mode: string;
  userId: number;
};

const MODES = [
  { label: "Pomodoro", value: "POMODORO", duration: 25, color: "#EF4444" },
  { label: "Deep Work", value: "DEEP_WORK", duration: 50, color: "#3B82F6" },
  { label: "Personalizzata", value: "CUSTOM", duration: 30, color: "#10B981" },
];

const STATUS = [
  { label: "Studio", value: "WORK", icon: <FiZap className="mr-1" /> },
  { label: "Pausa", value: "BREAK", icon: <FiCoffee className="mr-1" /> },
];

const FocusModePage: React.FC = () => {
  const {
    mode,
    setMode,
    status,
    setStatus,
    duration,
    setDuration,
    secondsLeft,
    setSecondsLeft,
    isRunning,
    setIsRunning,
    startTime,
    setStartTime,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer();

  const [showEnd, setShowEnd] = React.useState(false);
  const [showSessionModal, setShowSessionModal] = React.useState(false);

  const queryClient = useQueryClient();
  const { data: sessions = [] } = useQuery<FocusSession[]>("focusSessions", getRecentSessions);

  const mutation = useMutation(saveFocusSession, {
    onSuccess: () => {
      queryClient.invalidateQueries("focusSessions");
      setShowEnd(true);
      setIsRunning(false);
      setShowSessionModal(true);
    },
  });

  // Countdown end logic
  React.useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      handleSessionEnd();
    }
    // eslint-disable-next-line
  }, [isRunning, secondsLeft]);

  const handleSessionEnd = () => {
    setIsRunning(false);
    if (startTime) {
      mutation.mutate({
        duration: duration * 60 - secondsLeft,
        status,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        mode,
        userId: 0,
      });
    }
    playEndSound();
  };

  const playEndSound = () => {
    try {
      const audio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3");
      audio.play();
    } catch (e) {
      // Silently ignore
    }
  };

  const handleStart = () => {
    // Se il timer è già stato avviato (cioè secondsLeft < durata*60), NON resettare il tempo
    if (!isRunning && secondsLeft > 0 && secondsLeft !== duration * 60) {
      setIsRunning(true);
      setShowEnd(false);
      return;
    }

    // Altrimenti, è una nuova sessione
    if (secondsLeft === duration * 60) {
      setStartTime(new Date());
    }
    setIsRunning(true);
    setShowEnd(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(duration * 60);
    setShowEnd(false);
  };

  const currentMode = MODES.find((m) => m.value === mode);
  const percentage = (secondsLeft / (duration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Focus Mode</h1>
          <p className="text-gray-600">Migliora la tua produttività con sessioni temporizzate</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Impostazioni</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Modalità</h3>
                <div className="grid grid-cols-2 gap-2">
                  {MODES.map((m) => (
                    <motion.button
                      key={m.value}
                      whileTap={{ scale: 0.95 }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        mode === m.value ? `text-white bg-[${m.color}] shadow-md` : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                      }`}
                      style={mode === m.value ? { backgroundColor: m.color } : {}}
                      onClick={() => setMode(m.value as any)}>
                      {m.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tipo Sessione</h3>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS.map((s) => (
                    <motion.button
                      key={s.value}
                      whileTap={{ scale: 0.95 }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                        status === s.value ? "text-white bg-indigo-600 shadow-md" : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => setStatus(s.value as any)}>
                      {s.icon}
                      {s.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {mode === "CUSTOM" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durata Personalizzata (minuti)</label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={isRunning}
                  />
                  <div className="text-center text-lg font-medium mt-2">{duration} minuti</div>
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Timer */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 mb-8">
              <CircularProgressbar
                value={percentage}
                text={`${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`}
                styles={buildStyles({
                  pathColor: currentMode?.color || "#3B82F6",
                  textColor: "#1F2937",
                  trailColor: "#E5E7EB",
                  textSize: "16px",
                })}
              />
            </div>

            <div className="flex gap-4">
              {!isRunning ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-green-600 text-white rounded-full font-medium flex items-center shadow-lg"
                  onClick={handleStart}>
                  <FiPlay className="mr-2" /> {secondsLeft !== duration * 60 ? "Riprendi" : "Inizia"}
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-full font-medium flex items-center shadow-lg"
                    onClick={handlePause}>
                    <FiPause className="mr-2" /> Pausa
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-medium flex items-center shadow"
                    onClick={handleReset}>
                    <FiRefreshCw className="mr-2" /> Resetta
                  </motion.button>
                </>
              )}
            </div>

            <AnimatePresence>
              {showEnd && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
                  Sessione completata con successo!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Stats */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Statistiche</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-blue-800 text-sm">Oggi</div>
                <div className="text-2xl font-bold text-blue-600">
                  {sessions.filter((s) => new Date(s.startTime).toDateString() === new Date().toDateString()).length}
                </div>
                <div className="text-xs text-blue-500">sessioni</div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-purple-800 text-sm">Questa settimana</div>
                <div className="text-2xl font-bold text-purple-600">
                  {
                    sessions.filter((s) => {
                      const sessionDate = new Date(s.startTime);
                      const oneWeekAgo = new Date();
                      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                      return sessionDate > oneWeekAgo;
                    }).length
                  }
                </div>
                <div className="text-xs text-purple-500">sessioni</div>
              </div>
            </div>

            <h3 className="font-medium text-gray-700 mb-3 flex items-center">
              <FiClock className="mr-2" /> Sessioni Recenti
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {sessions.length === 0 ? (
                <div className="text-center text-gray-500 py-4">Nessuna sessione registrata</div>
              ) : (
                sessions.slice(0, 5).map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">
                        {new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(session.startTime).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === "WORK" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}>
                        {session.status === "WORK" ? "Studio" : "Pausa"}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Session Complete Modal */}
      <AnimatePresence>
        {showSessionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSessionModal(false)}>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ottimo lavoro! 🎉</h3>
              <p className="text-gray-600 mb-6">
                Hai completato una sessione di {duration} minuti in modalità {currentMode?.label}.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Modalità</div>
                    <div className="font-medium">{currentMode?.label}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tipo</div>
                    <div className="font-medium">{status === "WORK" ? "Studio" : "Pausa"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Durata</div>
                    <div className="font-medium">{duration} minuti</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Completata</div>
                    <div className="font-medium">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowSessionModal(false)}>
                  Chiudi
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={() => {
                    setShowSessionModal(false);
                    handleStart();
                  }}>
                  Nuova Sessione
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusModePage;
