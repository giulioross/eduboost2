import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  Settings,
  Volume2,
  BellRing,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  BarChart3,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const FocusModePage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [showSettings, setShowSettings] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [currentSession, setCurrentSession] = useState("focus");
  const [distractionCount, setDistractionCount] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  // Motivational quotes
  const motivationalQuotes = [
    "Il segreto per andare avanti è iniziare.",
    "Non guardare l'orologio; fai quello che fa. Continua.",
    "Sembra sempre impossibile finché non viene fatto.",
    "La qualità non è un atto, è un'abitudine.",
    "Il futuro dipende da ciò che fai oggi.",
    "Non devi essere grande per iniziare, ma devi iniziare per diventare grande.",
  ];

  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  // Toggle timer
  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsPaused(false);
  };

  // Pause timer
  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(focusDuration * 60);
    setCurrentSession("focus");
  };

  // Skip to next session
  const skipSession = () => {
    if (currentSession === "focus") {
      setTime(breakDuration * 60);
      setCurrentSession("break");
    } else {
      setTime(focusDuration * 60);
      setCurrentSession("focus");
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Handle distractions
  const reportDistraction = () => {
    setDistractionCount(distractionCount + 1);

    // Change quote when distraction reported
    const newQuoteIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[newQuoteIndex]);
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setShowFullScreen(!showFullScreen);
  };

  // Effect for countdown timer
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);

            // Switch between focus and break
            if (currentSession === "focus") {
              setCurrentSession("break");
              return breakDuration * 60;
            } else {
              setCurrentSession("focus");
              return focusDuration * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, currentSession, focusDuration, breakDuration]);

  // Weekly focus data for the chart
  const weeklyFocusData = [
    { day: "Lun", hours: 2.5 },
    { day: "Mar", hours: 3.0 },
    { day: "Mer", hours: 1.5 },
    { day: "Gio", hours: 4.0 },
    { day: "Ven", hours: 2.0 },
    { day: "Sab", hours: 0.5 },
    { day: "Dom", hours: 1.0 },
  ];

  // Maximum value for scaling
  const maxHours = Math.max(...weeklyFocusData.map((d) => d.hours));

  return (
    <div className={`min-h-screen ${showFullScreen ? "fixed inset-0 z-50 bg-gray-900" : ""}`}>
      <div className={`container-custom py-8 ${showFullScreen ? "text-white" : ""}`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${showFullScreen ? "text-white" : "text-gray-900"}`}>Focus Mode</h1>
          <p className={`${showFullScreen ? "text-gray-300" : "text-gray-600"}`}>Minimizza le distrazioni</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Focus Timer */}
          <div className="md:col-span-2">
            <div className={`card p-8 text-center ${showFullScreen ? "bg-gray-800 border-gray-700" : ""}`}>
              <div className="mb-8">
                <h2 className={`text-2xl font-bold mb-2 ${showFullScreen ? "text-white" : ""}`}>
                  {currentSession === "focus" ? "Focus Session" : "Break Time"}
                </h2>
                <p className={`${showFullScreen ? "text-gray-400" : "text-gray-600"}`}>
                  {currentSession === "focus" ? "Stay focused on your current task" : "Take a short break to recharge"}
                </p>
              </div>

              <div className="mb-10">
                <div
                  className={`text-7xl font-bold mb-6 ${
                    showFullScreen
                      ? currentSession === "focus"
                        ? "text-primary-400"
                        : "text-accent-400"
                      : currentSession === "focus"
                      ? "text-primary-600"
                      : "text-accent-500"
                  }`}>
                  {formatTime(time)}
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={toggleTimer}
                    className={`btn ${
                      showFullScreen ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-primary-600 text-white hover:bg-primary-700"
                    } px-5 py-2.5`}>
                    {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                    {isActive ? "Stop" : "Start"}
                  </button>

                  {isActive && (
                    <button
                      onClick={pauseTimer}
                      className={`btn ${showFullScreen ? "bg-gray-700 text-white hover:bg-gray-600" : "btn-outline"} px-5 py-2.5`}>
                      {isPaused ? "Resume" : "Pause"}
                    </button>
                  )}

                  <button
                    onClick={skipSession}
                    className={`btn ${showFullScreen ? "bg-gray-700 text-white hover:bg-gray-600" : "btn-outline"} px-5 py-2.5`}>
                    <SkipForward className="mr-2 h-5 w-5" />
                    Salta
                  </button>
                </div>
              </div>

              {isActive && currentSession === "focus" && (
                <div className="mb-6">
                  <div className={`p-4 rounded-lg ${showFullScreen ? "bg-gray-700" : "bg-primary-50"}`}>
                    <p className={`text-lg italic ${showFullScreen ? "text-gray-300" : "text-primary-800"}`}>"{currentQuote}"</p>
                  </div>

                  <button
                    onClick={reportDistraction}
                    className={`mt-4 btn ${
                      showFullScreen ? "bg-red-800 text-white hover:bg-red-700" : "bg-red-100 text-red-700 hover:bg-red-200"
                    } px-4 py-2`}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    mi sono distratto
                  </button>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={toggleSettings}
                  className={`text-sm flex items-center ${showFullScreen ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </button>

                <button
                  onClick={toggleFullScreen}
                  className={`text-sm flex items-center ${showFullScreen ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
                  {showFullScreen ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Esci dalla modalità a schermo intero
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Entra in modalità senza distrazioni
                    </>
                  )}
                </button>
              </div>

              {/* Settings Panel */}
              {showSettings && (
                <div className={`mt-6 p-4 rounded-lg ${showFullScreen ? "bg-gray-700" : "bg-gray-50"}`}>
                  <h3 className={`font-medium mb-4 ${showFullScreen ? "text-white" : ""}`}>Timer Settings</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${showFullScreen ? "text-gray-300" : "text-gray-700"}`}>
                        Durata Focus (minuti)
                      </label>
                      <input
                        type="number"
                        value={focusDuration}
                        onChange={(e) => setFocusDuration(parseInt(e.target.value))}
                        min="1"
                        max="60"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${showFullScreen ? "text-gray-300" : "text-gray-700"}`}>
                        Durata Pausa (minuti)
                      </label>
                      <input
                        type="number"
                        value={breakDuration}
                        onChange={(e) => setBreakDuration(parseInt(e.target.value))}
                        min="1"
                        max="30"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input type="checkbox" id="sound-notification" className="h-4 w-4 text-primary-600 rounded" />
                      <label htmlFor="sound-notification" className={`ml-2 text-sm ${showFullScreen ? "text-gray-300" : "text-gray-700"}`}>
                        <Volume2 className="h-4 w-4 inline mr-1" />
                        Notifiche sonore
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input type="checkbox" id="auto-break" className="h-4 w-4 text-primary-600 rounded" />
                      <label htmlFor="auto-break" className={`ml-2 text-sm ${showFullScreen ? "text-gray-300" : "text-gray-700"}`}>
                        <BellRing className="h-4 w-4 inline mr-1" />
                        Avvio automatico pause
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={resetTimer}
                      className={`btn ${showFullScreen ? "bg-primary-700 text-white hover:bg-primary-600" : "btn-primary"} text-sm`}>
                      Applica e Resetta Timer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Log */}
            {!showFullScreen && (
              <div className="card mt-6">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Today's Focus Sessions</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <FocusSessionItem title="Mathematics Review" time="09:30 AM - 10:45 AM" duration="1h 15m" completed />
                    <FocusSessionItem title="Essay Writing" time="01:15 PM - 02:30 PM" duration="1h 15m" completed />
                    <FocusSessionItem
                      title="Current Session"
                      time="Started at 04:15 PM"
                      duration={`${formatTime(time)} remaining`}
                      active={isActive && !isPaused}
                      paused={isPaused}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {!showFullScreen && (
            <div className="space-y-6">
              {/* Focus Stats */}
              <div className="card">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Statistiche Focus</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Tempo di Focus di oggi</p>
                      <p className="text-2xl font-bold">2h 30m</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Distrazioni</p>
                      <p className="text-2xl font-bold">{distractionCount}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Tempo di Focus Setiimanale</h3>
                    <div className="h-48 flex items-end space-x-2">
                      {weeklyFocusData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div
                            className="w-full bg-primary-100 rounded-t-sm"
                            style={{
                              height: `${(data.hours / maxHours) * 100}%`,
                              minHeight: "4px",
                            }}>
                            <div className="w-full bg-primary-500 rounded-t-sm" style={{ height: `${(data.hours / maxHours) * 100}%` }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{data.day}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduled Focus Times */}
              <div className="card">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Scheduled Focus Times</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  <ScheduledFocusItem title="Chemistry Review" time="Tomorrow, 10:00 AM" duration="45 min" />
                  <ScheduledFocusItem title="Essay Writing" time="Tomorrow, 02:30 PM" duration="90 min" />
                  <ScheduledFocusItem title="Math Problem Set" time="Friday, 09:00 AM" duration="60 min" />
                </div>
              </div>

              {/* Focus Tips */}
              <div className="card">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Consigli Focus</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h3 className="font-medium text-yellow-800 mb-1">Minimizza le Distrazioni</h3>
                      <p className="text-sm text-gray-700">
                        Metti il telefono in un'altra stanza o utilizza la modalità "non disturbare" per evitare notifiche.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-800 mb-1">Rimani Idratato</h3>
                      <p className="text-sm text-gray-700">
                        Tieni dell'acqua a portata di mano durante le sessioni di studio. Rimanere idratati aiuta a mantenere la concentrazione.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-800 mb-1">Fai Pause Adeguate</h3>
                      <p className="text-sm text-gray-700">
                        Durante le pause, allontanati dagli schermi. Prova a fare stretching, respirazione profonda o una breve passeggiata.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface FocusSessionItemProps {
  title: string;
  time: string;
  duration: string;
  completed?: boolean;
  active?: boolean;
  paused?: boolean;
}

const FocusSessionItem: React.FC<FocusSessionItemProps> = ({ title, time, duration, completed, active, paused }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center">
          <h3 className="font-medium">{title}</h3>
          {completed && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
          {active && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>}
          {paused && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-yellow-500"></span>}
        </div>
        <p className="text-sm text-gray-500 mt-1">{time}</p>
      </div>
      <div>
        <span
          className={`text-sm px-3 py-1 rounded-full ${
            active
              ? "bg-green-100 text-green-800"
              : paused
              ? "bg-yellow-100 text-yellow-800"
              : completed
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}>
          {duration}
        </span>
      </div>
    </div>
  );
};

interface ScheduledFocusItemProps {
  title: string;
  time: string;
  duration: string;
}

const ScheduledFocusItem: React.FC<ScheduledFocusItemProps> = ({ title, time, duration }) => {
  return (
    <div className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
      <div>
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center mt-1 text-sm text-gray-500">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>{time}</span>
        </div>
      </div>
      <div className="flex items-center">
        <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
        <span className="text-sm text-gray-500">{duration}</span>
      </div>
    </div>
  );
};

export default FocusModePage;
