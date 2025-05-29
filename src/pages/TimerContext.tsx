import React, { createContext, useContext, useState, useRef, useEffect } from "react";

type TimerStatus = "WORK" | "BREAK";
type TimerMode = "POMODORO" | "DEEP_WORK" | "CUSTOM";

interface TimerContextType {
  mode: TimerMode;
  setMode: (m: TimerMode) => void;
  status: TimerStatus;
  setStatus: (s: TimerStatus) => void;
  duration: number;
  setDuration: (d: number) => void;
  secondsLeft: number;
  setSecondsLeft: (s: number) => void;
  isRunning: boolean;
  setIsRunning: (r: boolean) => void;
  startTime: Date | null;
  setStartTime: (d: Date | null) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within TimerProvider");
  return ctx;
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<TimerMode>("POMODORO");
  const [status, setStatus] = useState<TimerStatus>("WORK");
  const [duration, setDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const intervalRef = useRef<number | null>(null);

  // Persist timer state in localStorage
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setIsRunning(false);
            clearInterval(intervalRef.current!);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Aggiorna secondsLeft quando cambia la durata (solo se non sta andando)
  useEffect(() => {
    if (!isRunning) setSecondsLeft(duration * 60);
  }, [duration, isRunning]);

  // Salva stato su localStorage
  useEffect(() => {
    localStorage.setItem(
      "focus-timer",
      JSON.stringify({ mode, status, duration, secondsLeft, isRunning, startTime: startTime ? startTime.toISOString() : null })
    );
  }, [mode, status, duration, secondsLeft, isRunning, startTime]);

  // Recupera stato da localStorage all'avvio
  useEffect(() => {
    const saved = localStorage.getItem("focus-timer");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        setMode(obj.mode || "POMODORO");
        setStatus(obj.status || "WORK");
        setDuration(obj.duration || 25);
        setSecondsLeft(obj.secondsLeft ?? (obj.duration || 25) * 60);
        setIsRunning(obj.isRunning || false);
        setStartTime(obj.startTime ? new Date(obj.startTime) : null);
      } catch {}
    }
  }, []);

  const startTimer = () => {
    setStartTime(new Date());
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(duration * 60);
    setStartTime(null);
  };

  return (
    <TimerContext.Provider
      value={{
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
      }}>
      {children}
    </TimerContext.Provider>
  );
};
