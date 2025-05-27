import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchRoutines, addRoutine, deleteRoutine, Routine } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiCalendar, FiList, FiClock } from "react-icons/fi";

// Tipi per blocchi e dayOfWeek
type DayOfWeek = "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
type StudyBlock = {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime?: string;
  endTime?: string;
  // altri campi se servono
};
type RoutineWithBlocks = Routine & { studyBlocks?: StudyBlock[] };

const getDayOfWeek = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  return days[date.getDay()];
};

const RoutinePage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState("");
  const [points, setPoints] = useState<string[]>([""]);
  const [isDaySelected, setIsDaySelected] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all routines (con eventuali studyBlocks)
  const { data, isLoading, error } = useQuery<RoutineWithBlocks[]>("routines", fetchRoutines);
  const routines: RoutineWithBlocks[] = Array.isArray(data) ? data : [];

  // Filtro per giorno della settimana
  const selectedDayOfWeek = selectedDate ? getDayOfWeek(selectedDate) : null;
  const selectedDayRoutines = routines.filter((routine) => routine.studyBlocks?.some((block) => block.dayOfWeek === selectedDayOfWeek));

  // Create routine mutation
  const createMutation = useMutation(addRoutine, {
    onSuccess: () => {
      queryClient.invalidateQueries("routines");
      resetForm();
    },
  });

  // Delete routine mutation
  const deleteMutation = useMutation(deleteRoutine, {
    onSuccess: () => {
      queryClient.invalidateQueries("routines");
    },
  });

  // Handle date selection
  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setIsDaySelected(true);
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setDescription("");
    setTime("");
    setPoints([""]);
  };

  // Handle point changes
  const handlePointChange = (idx: number, value: string) => {
    setPoints((prev) => prev.map((p, i) => (i === idx ? value : p)));
  };

  const addPoint = () => setPoints((prev) => [...prev, ""]);
  const removePoint = (idx: number) => setPoints((prev) => prev.filter((_, i) => i !== idx));

  // Submit form (qui dovresti aggiungere anche la creazione di uno studyBlock associato)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const dayOfWeek = getDayOfWeek(selectedDate);

    const routineData = {
      name,
      description,
      subject: "",
      time: time || "",
      duration: 0,
      days: [dayOfWeek],
    };

    createMutation.mutate(routineData);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error instanceof Error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg max-w-md mx-auto mt-8">
        <h3 className="font-bold text-lg">Errore nel caricamento</h3>
        <p>{error.message}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FiCalendar className="mr-2" /> Calendario
          </h3>
          <div className="mb-4">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              minDate={new Date()}
              calendarClassName="w-full"
              className="w-full"
            />
          </div>
          {selectedDate && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">
                {selectedDate.toLocaleDateString("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h4>
              <div className="flex items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 mr-2">Ora:</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="border border-gray-300 rounded px-2 py-1" />
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              {isDaySelected ? (
                <>
                  <FiPlus className="mr-2" /> Crea Routine per il{" "}
                  {selectedDate?.toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </>
              ) : (
                "Seleziona un giorno dal calendario"
              )}
            </h3>

            {isDaySelected && (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Es. Routine Mattutina"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-24"
                    placeholder="Descrivi la tua routine..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiList className="mr-2" /> Punti della Routine
                  </label>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {points.map((point, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center">
                          <span className="text-gray-500 mr-2">{idx + 1}.</span>
                          <input
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder={`Azione ${idx + 1}`}
                            value={point}
                            onChange={(e) => handlePointChange(idx, e.target.value)}
                          />
                          {points.length > 1 && (
                            <button className="ml-2 text-red-500 hover:text-red-700 p-1" type="button" onClick={() => removePoint(idx)}>
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button className="mt-2 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium" type="button" onClick={addPoint}>
                      <FiPlus className="mr-1" /> Aggiungi punto
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || !name.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                    createMutation.isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : !name.trim()
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}>
                  {createMutation.isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Creazione in corso...
                    </span>
                  ) : (
                    `Crea Routine per ${selectedDate?.toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                    })}`
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Routines List */}
          {isDaySelected && (
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Routine per{" "}
                {selectedDate?.toLocaleDateString("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h3>
              {selectedDayRoutines.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">Nessuna routine programmata per questo giorno.</div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {selectedDayRoutines.map((r) => (
                      <motion.li
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                        className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-1">{r.name}</h4>
                              {r.studyBlocks?.map((block, i) => (
                                <div key={i} className="flex items-center text-sm text-gray-500 mb-2">
                                  <FiClock className="mr-1" />
                                  {block.startTime}
                                </div>
                              ))}
                              <p className="text-gray-600 mb-2">{r.description}</p>
                            </div>
                            <button
                              className="text-gray-400 hover:text-red-500 transition"
                              disabled={deleteMutation.isLoading}
                              onClick={() => deleteMutation.mutate(r.id)}>
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                          {(r.points ?? []).length > 0 && (
                            <div className="mt-3">
                              <span className="text-xs font-medium text-gray-500">ATTIVITÀ:</span>
                              <ul className="mt-1 space-y-1">
                                {(r.points ?? []).map((p, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    <span className="text-gray-700 text-sm">{p}</span>
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
