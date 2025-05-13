import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const motivationalQuotes = [
  "Stay focused and never give up!",
  "Push through — you're doing great!",
  "One step closer to your goal.",
  "Discipline is choosing what you want most.",
  "Success is built by focused effort.",
];

const FocusModePage: React.FC = () => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [customWork, setCustomWork] = useState(30);
  const [customBreak, setCustomBreak] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [quote, setQuote] = useState("");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleEndOfSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [isRunning]);

  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, [isBreak]);

  const handleStart = () => {
    setIsRunning(true);
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    setTimeLeft((isCustom ? customWork : workDuration) * 60);
    enterFullscreen();
    window.addEventListener("blur", showDistractionOverlay);
  };

  const handlePause = () => {
    setIsRunning(false);
    clearInterval(timerRef.current!);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    clearInterval(timerRef.current!);
    setTimeLeft((isCustom ? customWork : workDuration) * 60);
    exitFullscreen();
    removeOverlay();
    window.removeEventListener("blur", showDistractionOverlay);
  };
  const playSound = () => {
    const audio = new Audio("/path/to/sound.mp3"); // Percorso del suono
    audio.play();
  };

  const handleEndOfSession = () => {
    const isNowBreak = !isBreak;
    setIsBreak(isNowBreak);
    const nextDuration = isNowBreak ? (isCustom ? customBreak : breakDuration) : isCustom ? customWork : workDuration;
    setTimeLeft(nextDuration * 60);
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    setIsRunning(true);

    // Suono al termine del timer
    playSound();

    // Salva la sessione nel backend
    const sessionData = {
      userId: 1,
      duration: (isCustom ? (isNowBreak ? customBreak : customWork) : isNowBreak ? breakDuration : workDuration) * 60,
      status: isNowBreak ? "BREAK" : "WORK",
    };

    fetch("/api/focus-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    })
      .then((response) => response.json())
      .then((data) => console.log("Session saved:", data))
      .catch((error) => console.error("Error saving session:", error));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
    setIsFullscreen(false);
  };

  const showDistractionOverlay = () => {
    const overlay = document.createElement("div");
    overlay.id = "distraction-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.zIndex = "9999";
    overlay.style.backgroundColor = "#000";
    overlay.style.color = "#fff";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.fontSize = "2rem";
    overlay.innerText = "Get back to focus! 💡";
    document.body.appendChild(overlay);
  };

  const removeOverlay = () => {
    const overlay = document.getElementById("distraction-overlay");
    if (overlay) overlay.remove();
  };
  const goToFocusHistory = () => {
    navigate("/focus-history"); // Naviga alla pagina dello storico
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-3xl font-bold text-primary-600 mb-4">Focus Mode</h1>
      <p className="text-lg mb-6">{quote}</p>

      <div className="mb-6 space-x-4">
        <label>
          <input type="radio" checked={!isCustom} onChange={() => setIsCustom(false)} />
          <span className="ml-1">Pomodoro (25-5)</span>
        </label>
        <label>
          <input type="radio" checked={isCustom} onChange={() => setIsCustom(true)} />
          <span className="ml-1">Custom</span>
        </label>
      </div>

      {isCustom && (
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block mb-1">Work (min):</label>
            <input type="number" className="border px-2 py-1" value={customWork} onChange={(e) => setCustomWork(Number(e.target.value))} />
          </div>
          <div>
            <label className="block mb-1">Break (min):</label>
            <input type="number" className="border px-2 py-1" value={customBreak} onChange={(e) => setCustomBreak(Number(e.target.value))} />
          </div>
        </div>
      )}

      <div className="text-6xl font-mono mb-4">{formatTime(timeLeft)}</div>
      <div className="space-x-4">
        {!isRunning ? (
          <button onClick={handleStart} className="px-6 py-2 bg-primary-600 text-white rounded">
            Start
          </button>
        ) : (
          <button onClick={handlePause} className="px-6 py-2 bg-yellow-500 text-white rounded">
            Pause
          </button>
        )}
        <button onClick={handleReset} className="px-6 py-2 bg-gray-500 text-white rounded">
          Reset
        </button>
        <button onClick={goToFocusHistory} className="px-6 py-2 bg-blue-500 text-white rounded">
          View History
        </button>
      </div>
    </div>
  );
};

export default FocusModePage;
