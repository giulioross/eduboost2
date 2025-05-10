import React from "react";
import { Link } from "react-router-dom";
import { Calendar, BookOpen, Brain, Clock, Award, TrendingUp, Bell, BarChart3, CheckCircle2, ChevronRight } from "lucide-react";

const DashboardPage: React.FC = () => {
  // Mock data
  const upcomingSessions = [
    { id: 1, title: "Calculus Review", time: "Today, 3:00 PM", duration: "45 min", subject: "Mathematics" },
    { id: 2, title: "History Essay Research", time: "Today, 5:00 PM", duration: "60 min", subject: "History" },
    { id: 3, title: "Physics Problem Set", time: "Tomorrow, 10:00 AM", duration: "90 min", subject: "Physics" },
  ];

  const weeklyProgress = {
    completed: 8,
    total: 12,
    percentage: 67,
  };

  return (
    <div className="pb-10">
      {/* Dashboard Header */}
      <div className="bg-primary-600 text-white">
        <div className="container-custom py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Alex!</h1>
              <p className="text-primary-100">Let's continue your learning journey</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="btn bg-white text-primary-700 hover:bg-gray-100">
                <Calendar className="mr-2 h-4 w-4" />
                Plan Study Session
              </button>
              <button className="btn bg-primary-700 text-white hover:bg-primary-800">
                <Clock className="mr-2 h-4 w-4" />
                Enter Focus Mode
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container-custom pt-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Progress Summary */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <ProgressCard
                title="Weekly Goal"
                value={`${weeklyProgress.completed}/${weeklyProgress.total}`}
                label="Study Sessions"
                icon={<CheckCircle2 className="h-5 w-5 text-primary-600" />}
                percentage={weeklyProgress.percentage}
              />
              <ProgressCard title="Streak" value="7" label="Days" icon={<Award className="h-5 w-5 text-amber-500" />} />
              <ProgressCard title="Focus Time" value="14.5" label="Hours this week" icon={<Clock className="h-5 w-5 text-emerald-500" />} />
            </div>

            {/* Upcoming Sessions */}
            <div className="card mb-6">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Upcoming Study Sessions</h2>
                <Link to="/routines" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-medium">{session.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500 mr-4">{session.time}</span>
                        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">{session.subject}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-4">{session.duration}</span>
                      <button className="btn btn-outline py-1 px-3 text-sm">Start</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <ActivityItem
                    icon={<BookOpen className="h-5 w-5 text-purple-500" />}
                    title="Completed Quiz: Organic Chemistry Basics"
                    time="Yesterday at 4:30 PM"
                    detail="Score: 85%"
                  />
                  <ActivityItem
                    icon={<Brain className="h-5 w-5 text-blue-500" />}
                    title="Created Mental Map: Spanish Verb Conjugation"
                    time="Yesterday at 2:15 PM"
                    detail="12 connections"
                  />
                  <ActivityItem
                    icon={<Clock className="h-5 w-5 text-green-500" />}
                    title="Completed Focus Session: Literature Review"
                    time="2 days ago at 7:00 PM"
                    detail="90 minutes"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Weekly Statistics */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">Weekly Statistics</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Focus Time by Subject</h3>
                    </div>
                    <div className="h-48 flex items-center justify-center">
                      <BarChart3 className="h-32 w-32 text-gray-300" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Productivity Score</h3>
                      <span className="text-sm text-emerald-600 font-medium">+12% from last week</span>
                    </div>
                    <div className="h-5 bg-gray-100 rounded-full">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">0%</span>
                      <span className="text-xs text-gray-500">78%</span>
                      <span className="text-xs text-gray-500">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Tips */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Study Tips</h2>
                <button className="text-sm text-primary-600 hover:text-primary-700">Refresh</button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <TipCard
                    title="Use the Pomodoro Technique"
                    description="Try studying in 25-minute intervals with 5-minute breaks to maintain focus."
                  />
                  <TipCard
                    title="Create Mental Associations"
                    description="Connect new information to concepts you already understand for better retention."
                  />
                  <TipCard title="Review Before Bedtime" description="Light review before sleep can help with memory consolidation." />
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <ReminderItem title="Physics Assignment" date="Tomorrow" type="Assignment" urgent />
                <ReminderItem title="Literature Essay" date="In 3 days" type="Essay" />
                <ReminderItem title="Chemistry Midterm" date="In 1 week" type="Exam" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProgressCardProps {
  title: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  percentage?: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, value, label, icon, percentage }) => {
  return (
    <div className="card p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon}
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold">{value}</p>
        <p className="ml-2 text-sm text-gray-500">{label}</p>
      </div>
      {percentage !== undefined && (
        <div className="mt-3">
          <div className="h-2 bg-gray-100 rounded-full">
            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  detail: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, time, detail }) => {
  return (
    <div className="flex">
      <div className="mr-4 mt-1">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center mt-1">
          <span className="text-sm text-gray-500 mr-3">{time}</span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{detail}</span>
        </div>
      </div>
    </div>
  );
};

interface TipCardProps {
  title: string;
  description: string;
}

const TipCard: React.FC<TipCardProps> = ({ title, description }) => {
  return (
    <div className="p-4 bg-primary-50 rounded-lg">
      <h3 className="font-medium text-primary-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
};

interface ReminderItemProps {
  title: string;
  date: string;
  type: string;
  urgent?: boolean;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ title, date, type, urgent }) => {
  return (
    <div className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
      <div>
        <div className="flex items-center">
          <h3 className="font-medium">{title}</h3>
          {urgent && <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Urgent</span>}
        </div>
        <p className="text-sm text-gray-500 mt-1">{date}</p>
      </div>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          type === "Exam" ? "bg-red-50 text-red-700" : type === "Assignment" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
        }`}>
        {type}
      </span>
    </div>
  );
};

export default DashboardPage;
