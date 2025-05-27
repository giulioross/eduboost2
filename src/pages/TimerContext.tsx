// contexts/TimerContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface TimerContextType {
  secondsLeft: number;
  isRunning: boolean;
  mode: string;
  status: string;
  startTimer: (duration: number, mode: string, status: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("");
  const [status, setStatus] = useState("");
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          // Aggiungi qui eventuali azioni al completamento
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = (dur: number, mod: string, stat: string) => {
    setDuration(dur);
    setMode(mod);
    setStatus(stat);
    setSecondsLeft(dur * 60);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(duration * 60);
  };

  return (
    <TimerContext.Provider
      value={{
        secondsLeft,
        isRunning,
        mode,
        status,
        startTimer,
        pauseTimer,
        resetTimer,
      }}>
      {children}
      <GlobalTimerOverlay />
    </TimerContext.Provider>
  );
};

const GlobalTimerOverlay = () => {
  const timer = useContext(TimerContext);

  if (!timer || timer.secondsLeft <= 0) return null;

  const minutes = Math.floor(timer.secondsLeft / 60);
  const seconds = timer.secondsLeft % 60;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-200 flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${timer.isRunning ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}></div>
        <div className="font-mono text-lg">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
        <div className="ml-2 text-sm text-gray-600 capitalize">
          {timer.mode} • {timer.status}
        </div>
      </div>
    </div>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
