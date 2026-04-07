import React from 'react';
import { FiTrendingUp, FiAward, FiClock, FiCheckCircle, FiZap, FiStar, FiShield } from 'react-icons/fi';

const ProgressPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Progress</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your overall academic performance and achievements.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress', value: '45%', icon: FiTrendingUp, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/20' },
          { label: 'Courses Completed', value: '2', icon: FiAward, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-500/20' },
          { label: 'Study Hours', value: '32h', icon: FiClock, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/20' },
          { label: 'Tasks Done', value: '14', icon: FiCheckCircle, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-500/20' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1e2035] p-5 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Progress Bars & Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Study Hours Chart */}
          <div className="bg-white dark:bg-[#1e2035] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Study Hours</h3>
              <select className="bg-gray-50 dark:bg-[#151624] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            
            {/* Custom Tailwind Bar Chart */}
            <div className="relative h-48 mt-4 flex items-end gap-2 sm:gap-4 justify-between">
              {[
                { day: 'Mon', hours: 2, height: '40%' },
                { day: 'Tue', hours: 4, height: '70%' },
                { day: 'Wed', hours: 1, height: '20%' },
                { day: 'Thu', hours: 5, height: '85%' },
                { day: 'Fri', hours: 3, height: '55%' },
                { day: 'Sat', hours: 6, height: '100%' },
                { day: 'Sun', hours: 4, height: '70%' },
              ].map((data, index) => (
                <div key={index} className="flex flex-col items-center w-full group">
                  <div className="relative w-full flex justify-center bg-transparent h-full items-end rounded-t-md">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                      {data.hours} hrs
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full max-w-[2.5rem] bg-blue-100 dark:bg-blue-500/20 hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors rounded-t-md" 
                      style={{ height: data.height }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Course Progress */}
          <div className="bg-white dark:bg-[#1e2035] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Course Progress</h3>
            <div className="space-y-5">
              {[
                { title: 'Advanced React & Redux', value: 85, color: 'bg-blue-500' },
                { title: 'Fullstack Node.js Bootcamp', value: 45, color: 'bg-purple-500' },
                { title: 'UI/UX Masterclass', value: 15, color: 'bg-green-500' },
                { title: 'Python for Data Science', value: 100, color: 'bg-orange-500' },
              ].map((course, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{course.title}</h4>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{course.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-[#2a2c44] rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`${course.color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
                      style={{ width: `${course.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Column: Badges & Streaks */}
        <div className="space-y-6">
          
          {/* Streaks Widget */}
          <div className="bg-white dark:bg-[#1e2035] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden">
             {/* Decorative gradient blob */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-2xl rounded-full translate-x-10 -translate-y-10"></div>
             
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiZap className="text-orange-500" />
                Learning Streak
             </h3>
             <div className="flex items-end gap-3 mb-2">
               <span className="text-4xl font-extrabold text-gray-900 dark:text-white">12</span>
               <span className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-1">Days</span>
             </div>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You're on a roll! Keep it up to beat your personal best of 15 days.</p>
             
             {/* Mini week calendar view */}
             <div className="flex justify-between items-center">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dIdx) => {
                  const isDone = dIdx < 5; // Fake logic for past days
                  const isToday = dIdx === 4;
                  return (
                    <div key={dIdx} className="flex flex-col items-center gap-1">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                         ${isDone 
                           ? 'bg-orange-500 text-white' 
                           : 'bg-gray-100 dark:bg-[#2a2c44] text-gray-400'}
                         ${isToday ? 'ring-2 ring-offset-2 ring-orange-500 dark:ring-offset-[#1e2035]' : ''}
                       `}>
                          {isDone ? <FiCheckCircle size={14} /> : day}
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Badges & Certificates */}
          <div className="bg-white dark:bg-[#1e2035] p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Achievements</h3>
                <button className="text-blue-500 text-sm font-medium hover:underline">View All</button>
             </div>
             
             <div className="space-y-4">
                {/* Badge 1 */}
                <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0">
                    <FiStar size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Top Student</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Scored 100% in 3 quizzes.</p>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FiShield size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Problem Solver</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completed 5 complex assignments.</p>
                  </div>
                </div>
                
                {/* Badge 3 */}
                <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                    <FiAward size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Python Certified</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completed the Data Science course.</p>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
