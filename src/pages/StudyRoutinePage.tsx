import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, Edit2, Trash, Filter, ChevronLeft, ChevronRight, Check, X } from "lucide-react";

const StudyRoutinePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Mock data
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Computer Science", "Languages"];

  const routines = [
    {
      id: 1,
      title: "Morning Mathematics Review",
      time: "08:00 AM - 09:30 AM",
      subject: "Mathematics",
      description: "Review calculus concepts and practice problems",
      days: ["Monday", "Wednesday", "Friday"],
    },
    {
      id: 2,
      title: "Physics Problem Set",
      time: "10:00 AM - 11:30 AM",
      subject: "Physics",
      description: "Work through problem set and review lecture notes",
      days: ["Tuesday", "Thursday"],
    },
    {
      id: 3,
      title: "History Essay Research",
      time: "02:00 PM - 03:30 PM",
      subject: "History",
      description: "Research and outline essay on Renaissance period",
      days: ["Monday", "Wednesday"],
    },
    {
      id: 4,
      title: "Chemistry Lab Preparation",
      time: "04:00 PM - 05:00 PM",
      subject: "Chemistry",
      description: "Review lab procedures and safety protocols",
      days: ["Tuesday"],
    },
  ];

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days: { day: string | number; isEmpty: boolean; isToday?: boolean; routines?: typeof routines }[] = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: "", isEmpty: true });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

      // Get routines for this day
      const dayRoutines = routines.filter((routine) => routine.days.includes(dayOfWeek));

      days.push({
        day: i,
        isEmpty: false,
        isToday: new Date().toDateString() === date.toDateString(),
        routines: dayRoutines,
      });
    }

    return days;
  };

  // Navigate through months
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Toggle subject filter
  const toggleSubjectFilter = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Filter routines by selected subjects
  const filteredRoutines = selectedSubjects.length > 0 ? routines.filter((routine) => selectedSubjects.includes(routine.subject)) : routines;

  const calendarDays = generateCalendarDays();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Study Routines</h1>
          <p className="text-gray-600 mt-1">Create and manage your personalized study schedule</p>
        </div>

        <div className="flex space-x-3 mt-4 md:mt-0">
          <button className="btn btn-outline" onClick={() => setShowFilterMenu(!showFilterMenu)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button className="btn btn-primary" onClick={() => setIsCreatingRoutine(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Routine
          </button>
        </div>
      </div>

      {showFilterMenu && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-fade-in">
          <h2 className="font-medium mb-3">Filter by Subject</h2>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => toggleSubjectFilter(subject)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedSubjects.includes(subject)
                    ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
                    : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                }`}>
                {subject}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Calendar View */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Study Calendar</h2>
              <div className="flex items-center space-x-2">
                <button onClick={() => navigateMonth("prev")} className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-sm font-medium">{monthName}</span>
                <button onClick={() => navigateMonth("next")} className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}

                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`p-1 min-h-[80px] border rounded-md transition-colors ${
                      day.isEmpty ? "border-transparent" : day.isToday ? "border-primary-300 bg-primary-50" : "border-gray-100 hover:bg-gray-50"
                    }`}>
                    {!day.isEmpty && (
                      <>
                        <div className={`text-xs font-medium ${day.isToday ? "text-primary-700" : "text-gray-700"} p-1`}>{day.day}</div>
                        <div className="mt-1 space-y-1">
                          {day.routines &&
                            day.routines.slice(0, 2).map((routine) => (
                              <div
                                key={routine.id}
                                className="px-1.5 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 truncate"
                                title={routine.title}>
                                {routine.title.length > 15 ? routine.title.substring(0, 15) + "..." : routine.title}
                              </div>
                            ))}
                          {day.routines && day.routines.length > 2 && (
                            <div className="px-1.5 py-0.5 text-xs text-gray-500">+{day.routines.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Routines List */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Your Routines</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredRoutines.length > 0 ? (
                filteredRoutines.map((routine) => (
                  <div key={routine.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{routine.title}</h3>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{routine.time}</span>
                    </div>
                    <div className="mt-1">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">{routine.subject}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{routine.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {routine.days.map((day) => (
                        <span key={day} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No routines match your filter criteria.</p>
                  {selectedSubjects.length > 0 && (
                    <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm" onClick={() => setSelectedSubjects([])}>
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create New Routine Modal */}
      {isCreatingRoutine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Create New Study Routine</h2>
              <button onClick={() => setIsCreatingRoutine(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <form>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Routine Name</label>
                    <input type="text" placeholder="e.g., Morning Mathematics Review" className="input" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input type="time" className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <input type="number" min="15" step="15" placeholder="60" className="input" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select className="input">
                      <option value="">Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                    <textarea rows={3} placeholder="What will you focus on during this study session?" className="input"></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Repeat on days</label>
                    <div className="flex flex-wrap gap-2">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <button key={day} type="button" className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" className="btn btn-outline" onClick={() => setIsCreatingRoutine(false)}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary">
                      <Check className="mr-2 h-4 w-4" />
                      Create Routine
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyRoutinePage;
