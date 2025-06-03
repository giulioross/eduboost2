import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchRoutines, addRoutine, deleteRoutine, Routine, StudyBlock } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiCalendar, FiList, FiClock } from "react-icons/fi";

type RoutineWithBlocks = Routine & { studyBlocks?: StudyBlock[] };

const getDayOfWeek = (date: Date): string => {
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  return days[date.getDay()];
};

const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() + duration);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

const RoutinePage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [subject, setSubject] = useState("General");
  const [points, setPoints] = useState<string[]>([""]);
  const [isDaySelected, setIsDaySelected] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<RoutineWithBlocks[]>("routines", fetchRoutines);
  const routines: RoutineWithBlocks[] = Array.isArray(data) ? data : [];

  const selectedDayOfWeek = selectedDate ? getDayOfWeek(selectedDate) : null;
  const selectedDateISO = selectedDate ? selectedDate.toISOString().slice(0, 10) : null;

  // Miglior matching delle routine per data e giorno della settimana
  const selectedDayRoutines = routines.filter((routine) => {
    if (!routine.studyBlocks) return false;
    return routine.studyBlocks.some((block) => {
      const dayMatch = block.dayOfWeek === selectedDayOfWeek;
      if (block.date) {
        try {
          const blockDate = new Date(block.date).toISOString().slice(0, 10);
          return blockDate === selectedDateISO || dayMatch;
        } catch {
          return dayMatch;
        }
      }
      return dayMatch;
    });
  });

  // Debug: mostra dati e filtri
  useEffect(() => {
    console.log("Routines data:", {
      allRoutines: routines,
      selectedDateISO,
      selectedDayOfWeek,
      filteredRoutines: selectedDayRoutines,
    });
  }, [routines, selectedDateISO, selectedDayOfWeek]);

  const createMutation = useMutation(addRoutine, {
    onSuccess: (newRoutine) => {
      // Aggiorna la cache manualmente
      queryClient.setQueryData<RoutineWithBlocks[]>("routines", (old) => (old ? [...old, newRoutine] : [newRoutine]));
      resetForm();
    },
    onError: (error: any) => {
      console.error("Error details:", error.response?.data);
      alert(`Failed to create routine: ${error.response?.data?.message || error.message}`);
    },
  });

  const deleteMutation = useMutation(deleteRoutine, {
    onSuccess: () => {
      queryClient.invalidateQueries("routines");
    },
    onError: (error: any) => {
      console.error("Error deleting routine:", error);
      alert("Failed to delete routine");
    },
  });

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setIsDaySelected(true);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setStartTime("");
    setDuration(60);
    setSubject("General");
    setPoints([""]);
  };

  // Usa la data ISO completa nel payload
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !startTime) return;
    if (!name.trim()) {
      alert("Please enter a routine name");
      return;
    }

    const dayOfWeek = getDayOfWeek(selectedDate);
    const endTime = calculateEndTime(startTime, duration);
    const dateISO = selectedDate.toISOString();

    const routineData = {
      name,
      description,
      studyBlocks: [
        {
          subject,
          dayOfWeek,
          date: dateISO,
          startTime,
          endTime,
          recommendedMethod: "POMODORO",
          breakInterval: 25,
          breakDuration: 5,
        },
      ],
      points: points.filter((p) => p.trim() !== ""),
    };

    createMutation.mutate(routineData);
  };

  function addPoint() {
    setPoints((prev) => [...prev, ""]);
  }

  function handlePointChange(idx: number, value: string) {
    setPoints((prev) => prev.map((p, i) => (i === idx ? value : p)));
  }

  function removePoint(idx: number) {
    setPoints((prev) => prev.filter((_, i) => i !== idx));
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700">Error loading routines</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FiCalendar className="mr-2" /> Calendar
          </h3>
          <DatePicker selected={selectedDate} onChange={handleDateChange} inline minDate={new Date()} className="w-full" />
          {selectedDate && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {isDaySelected ? `Create Routine for ${selectedDate?.toLocaleDateString()}` : "Select a date"}
            </h3>

            {isDaySelected && (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Routine name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {points.map((point, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center">
                          <input
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder={`Step ${idx + 1}`}
                            value={point}
                            onChange={(e) => handlePointChange(idx, e.target.value)}
                          />
                          {points.length > 1 && (
                            <button type="button" onClick={() => removePoint(idx)} className="ml-2 text-red-500 hover:text-red-700 p-1">
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button type="button" onClick={addPoint} className="mt-2 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                      <FiPlus className="mr-1" /> Add Step
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    createMutation.isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}>
                  {createMutation.isLoading ? "Saving..." : "Save Routine"}
                </button>
              </form>
            )}
          </div>

          {/* Routines List */}
          {isDaySelected && (
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Routines for {selectedDate?.toLocaleDateString()}
                {createMutation.isLoading && <span className="ml-2 text-blue-500">Saving...</span>}
              </h3>
              {selectedDayRoutines.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">No routines scheduled for this day</div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {selectedDayRoutines.map((routine) => (
                      <motion.li
                        key={routine.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-1">{routine.name}</h4>
                              {routine.studyBlocks?.map((block, i) => (
                                <div key={i} className="flex items-center text-sm text-gray-500 mb-2">
                                  <FiClock className="mr-1" />
                                  {block.startTime} - {block.endTime} ({block.subject})
                                </div>
                              ))}
                              <p className="text-gray-600 mb-2">{routine.description}</p>
                            </div>
                            <button
                              onClick={() => deleteMutation.mutate(routine.id)}
                              className="text-gray-400 hover:text-red-500"
                              disabled={deleteMutation.isLoading}>
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                          {routine.points && routine.points.length > 0 && (
                            <div className="mt-3">
                              <span className="text-xs font-medium text-gray-500">STEPS:</span>
                              <ul className="mt-1 space-y-1">
                                {routine.points.map((point, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    <span className="text-gray-700 text-sm">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutinePage;
